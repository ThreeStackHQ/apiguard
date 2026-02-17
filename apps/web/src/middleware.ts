import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protected routes
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
