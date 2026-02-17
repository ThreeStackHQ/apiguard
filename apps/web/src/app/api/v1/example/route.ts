import { NextResponse } from 'next/server';

// Example protected API endpoint
// Usage: curl -H "x-api-key: ag_live_xxxxx" https://apiguard.dev/api/v1/example

export async function GET(req: Request) {
  // API key has already been validated by middleware
  const keyId = req.headers.get('X-ApiGuard-Key-Id');
  const workspaceId = req.headers.get('X-ApiGuard-Workspace-Id');

  return NextResponse.json({
    message: 'Hello from ApiGuard!',
    authenticated: true,
    keyId,
    workspaceId,
    timestamp: new Date().toISOString(),
  });
}
