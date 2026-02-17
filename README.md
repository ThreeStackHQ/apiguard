# ApiGuard

**API key management for indie SaaS** — Drop-in auth, rate limiting, and usage tracking for your API.

## What is ApiGuard?

ApiGuard is a lightweight SaaS tool that gives your users API key management without building it yourself:

- 🔑 **API Key Generation** — Secure bcrypt-hashed keys with prefix support
- 🚦 **Rate Limiting** — Redis-backed sliding window (100/hr, 1000/hr, unlimited)
- 📊 **Usage Tracking** — Monitor API calls per key
- 🎨 **Custom Dashboard** — White-label ready for your users

Perfect for indie developers shipping APIs who don't want to reinvent auth.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Radix UI
- **Backend:** Next.js API Routes, Drizzle ORM (PostgreSQL)
- **Rate Limiting:** Redis (Upstash)
- **Auth:** NextAuth.js v5

## Monorepo Structure

```
apiguard/
├── apps/
│   └── web/          # Next.js dashboard app
├── packages/
│   ├── db/           # Drizzle ORM schema + migrations
│   ├── sdk/          # Middleware SDKs (Express, Next.js, Koa)
│   └── config/       # Shared configs (tsconfig, eslint, prettier)
└── turbo.json        # Turborepo config
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL
- Redis

### Install

```bash
pnpm install
```

### Setup Environment

```bash
cp .env.example .env
# Edit .env with your database and Redis URLs
```

### Run Development

```bash
pnpm dev
```

Apps will be available at:
- Web dashboard: http://localhost:3000

### Build

```bash
pnpm build
```

## Deployment

**Preview:** https://apiguard-dev.threestack.io  
**Production:** https://apiguard.threestack.io

## License

MIT License — Built by [ThreeStack](https://threestack.io)
