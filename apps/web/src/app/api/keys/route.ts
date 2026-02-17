import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, apiKeys, workspaces } from '@apiguard/db';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';

const createKeySchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1).max(100),
  rateLimit: z.number().int().positive().optional(),
});

// Generate API key with format: ag_live_xxxxx or ag_test_xxxxx
function generateApiKey(env: 'live' | 'test' = 'live'): { fullKey: string; prefix: string; hash: string } {
  const random = crypto.randomBytes(24).toString('base64url'); // 32 chars base64url
  const fullKey = `ag_${env}_${random}`;
  const prefix = `ag_${env}_${random.slice(0, 8)}...`; // Show first 8 chars
  const hash = bcrypt.hashSync(fullKey, 10);
  
  return { fullKey, prefix, hash };
}

// POST /api/keys - Create new API key
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId, name, rateLimit } = createKeySchema.parse(body);

    // Verify user owns workspace
    const workspace = await db
      .select()
      .from(workspaces)
      .where(
        and(
          eq(workspaces.id, workspaceId),
          eq(workspaces.userId, session.user.id)
        )
      )
      .limit(1);

    if (workspace.length === 0) {
      return NextResponse.json(
        { error: 'Workspace not found or access denied' },
        { status: 404 }
      );
    }

    // Generate API key
    const { fullKey, prefix, hash } = generateApiKey('live');

    // Insert into database
    const [newKey] = await db
      .insert(apiKeys)
      .values({
        workspaceId,
        name,
        keyPrefix: prefix,
        keyHash: hash,
        rateLimit: rateLimit || null,
      })
      .returning();

    // Return full key ONCE (never stored in DB)
    return NextResponse.json(
      {
        key: newKey,
        fullKey, // ⚠️ Only shown once!
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create API key error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/keys - List all API keys for user's workspaces
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    let query = db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        rateLimit: apiKeys.rateLimit,
        status: apiKeys.status,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
        workspaceId: apiKeys.workspaceId,
      })
      .from(apiKeys)
      .innerJoin(workspaces, eq(apiKeys.workspaceId, workspaces.id))
      .where(eq(workspaces.userId, session.user.id));

    if (workspaceId) {
      query = query.where(eq(apiKeys.workspaceId, workspaceId));
    }

    const keys = await query;

    return NextResponse.json({ keys });
  } catch (error) {
    console.error('List API keys error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
