import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, workspaces } from '@apiguard/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
});

// POST /api/workspaces - Create workspace
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug } = createWorkspaceSchema.parse(body);

    // Check if slug is already taken
    const existing = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Slug already taken' },
        { status: 400 }
      );
    }

    const [workspace] = await db
      .insert(workspaces)
      .values({
        userId: session.user.id,
        name,
        slug,
      })
      .returning();

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create workspace error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/workspaces - List user's workspaces
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userWorkspaces = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, session.user.id));

    return NextResponse.json({ workspaces: userWorkspaces });
  } catch (error) {
    console.error('List workspaces error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
