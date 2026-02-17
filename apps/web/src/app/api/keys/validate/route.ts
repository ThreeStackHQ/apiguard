import { NextResponse } from 'next/server';
import { db, apiKeys } from '@apiguard/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// POST /api/keys/validate - Validate API key (for client SDK)
export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (!key || typeof key !== 'string' || !key.startsWith('ag_')) {
      return NextResponse.json(
        { valid: false, error: 'Invalid API key format' },
        { status: 400 }
      );
    }

    // Extract prefix to narrow search (optimization for large datasets)
    const prefix = key.startsWith('ag_live_')
      ? `ag_live_${key.slice(8, 16)}...`
      : `ag_test_${key.slice(8, 16)}...`;

    // Find all keys with matching prefix
    const candidateKeys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.keyPrefix, prefix));

    // Check hash for each candidate (should only be 1)
    for (const candidate of candidateKeys) {
      const isValid = await bcrypt.compare(key, candidate.keyHash);
      
      if (isValid) {
        if (candidate.status === 'revoked') {
          return NextResponse.json(
            { valid: false, error: 'API key has been revoked' },
            { status: 403 }
          );
        }

        // Update last used timestamp
        await db
          .update(apiKeys)
          .set({ lastUsedAt: new Date() })
          .where(eq(apiKeys.id, candidate.id));

        return NextResponse.json({
          valid: true,
          key: {
            id: candidate.id,
            workspaceId: candidate.workspaceId,
            rateLimit: candidate.rateLimit,
          },
        });
      }
    }

    // No match found
    return NextResponse.json(
      { valid: false, error: 'Invalid API key' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Validate API key error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
