import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { db, apiKeys } from '@apiguard/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { checkRateLimit } from '@/lib/redis';

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // API key validation + rate limiting
  if (pathname.startsWith('/api/v1/')) {
    const apiKey = req.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key' },
        { status: 401 }
      );
    }

    // Extract prefix to narrow search
    const prefix = apiKey.startsWith('ag_live_')
      ? `ag_live_${apiKey.slice(8, 16)}...`
      : `ag_test_${apiKey.slice(8, 16)}...`;

    // Find matching key
    const candidateKeys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.keyPrefix, prefix));

    let validKey: typeof candidateKeys[0] | null = null;

    for (const candidate of candidateKeys) {
      const isValid = await bcrypt.compare(apiKey, candidate.keyHash);
      if (isValid) {
        validKey = candidate;
        break;
      }
    }

    if (!validKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (validKey.status === 'revoked') {
      return NextResponse.json(
        { error: 'API key has been revoked' },
        { status: 403 }
      );
    }

    // Rate limiting (if limit is set)
    if (validKey.rateLimit) {
      const rateLimitKey = `apikey:${validKey.id}`;
      const { allowed, remaining, reset } = await checkRateLimit(
        rateLimitKey,
        validKey.rateLimit,
        3600000 // 1 hour window
      );

      if (!allowed) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', reset },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': String(validKey.rateLimit),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(reset),
            },
          }
        );
      }

      // Add rate limit headers to response
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', String(validKey.rateLimit));
      response.headers.set('X-RateLimit-Remaining', String(remaining));
      response.headers.set('X-RateLimit-Reset', String(reset));

      // Attach key metadata to request (for usage logging)
      response.headers.set('X-ApiGuard-Key-Id', validKey.id);
      response.headers.set('X-ApiGuard-Workspace-Id', validKey.workspaceId);

      return response;
    }

    // No rate limit — just pass through
    const response = NextResponse.next();
    response.headers.set('X-ApiGuard-Key-Id', validKey.id);
    response.headers.set('X-ApiGuard-Workspace-Id', validKey.workspaceId);
    return response;
  }

  // Protected dashboard routes
  const isProtected = pathname.startsWith('/dashboard');
  const isAuth = !!req.auth;

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/signup') && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
