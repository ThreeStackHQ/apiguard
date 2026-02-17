# @apiguard/db

Database package for ApiGuard using Drizzle ORM.

## Schema

- **users**: User accounts (email, password hash)
- **workspaces**: Multi-tenant workspaces (slug for subdomain)
- **api_keys**: API keys with rate limits (key_prefix + key_hash for security)
- **usage_logs**: API usage tracking (method, path, status, IP, timestamp)
- **subscriptions**: Stripe subscription management (free/pro/business tiers)

## Scripts

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

## Environment Variables

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/apiguard
```

## Usage

```typescript
import { db, users, apiKeys } from '@apiguard/db';

// Query users
const allUsers = await db.select().from(users);

// Insert API key
await db.insert(apiKeys).values({
  workspaceId: '...',
  name: 'Production API Key',
  keyPrefix: 'ag_live_abc123',
  keyHash: '...', // bcrypt hash
  rateLimit: 1000,
});
```
