import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, apiKeys, workspaces } from '@apiguard/db';
import { eq, and } from 'drizzle-orm';

// DELETE /api/keys/:id - Revoke API key
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keyId = params.id;

    // Verify user owns workspace that owns this key
    const key = await db
      .select({
        id: apiKeys.id,
        workspaceId: apiKeys.workspaceId,
      })
      .from(apiKeys)
      .innerJoin(workspaces, eq(apiKeys.workspaceId, workspaces.id))
      .where(
        and(
          eq(apiKeys.id, keyId),
          eq(workspaces.userId, session.user.id)
        )
      )
      .limit(1);

    if (key.length === 0) {
      return NextResponse.json(
        { error: 'API key not found or access denied' },
        { status: 404 }
      );
    }

    // Soft delete by marking as revoked
    await db
      .update(apiKeys)
      .set({ status: 'revoked' })
      .where(eq(apiKeys.id, keyId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Revoke API key error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
