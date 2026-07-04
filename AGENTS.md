# deeray — Agent Guide

## Stack
- **Next.js 15** (App Router) + React 19 + TypeScript 5 (strict)
- **Tailwind v4** — CSS-first config: `@theme` in `src/app/globals.css`, **no** `tailwind.config.*`
- **Prisma v6** + PostgreSQL (via `@prisma/client`)
- **Auth**: Admin-only sessions via `iron-session`. No customer accounts.
- **Cart**: Guest cart in encrypted cookies via server actions (`"use server"`)
- **Payments**: Stripe + COD adapters; JazzCash/Easypaisa stubs
- **Animations**: Framer Motion 12

## Commands
| Action | Command |
|---|---|
| dev server | `npm run dev` |
| build | `npm run build` |
| lint | `npm run lint` (ESLint flat config — `eslint.config.mjs`) |
| typecheck | `npx tsc --noEmit` (no npm script for this) |
| Prisma generate | `npm run db:generate` |
| push schema (dev) | `npm run db:push` |
| create migration | `npm run db:migrate:dev` |
| seed DB | `npm run db:seed` (`tsx prisma/seed.ts` — creates `admin@deeray.com` / `admin123`) |
| Prisma Studio | `npm run db:studio` |

## Project layout
- `src/app/` — routes (storefront, admin, API)
- `src/app/(store)/` — storefront pages (products, cart, checkout, etc.)
- `src/app/admin/` — admin panel (auth-protected)
- `src/app/api/` — API routes
- `src/components/` — shared React components
- `src/lib/` — utilities, Prisma singleton, auth, cart, payment/courier adapters
- `src/types/` — Cart, CartItem types
- `prisma/` — schema + seed
- `deploy/` — Docker Compose + Nginx + PM2 (VPS deployment, no CI)
- `scripts/` — `startup.sh`, `create-migration.sh`

## Gotchas
- **No test framework installed** — add one before writing tests
- **No formatter** (Prettier etc.) configured
- **ESLint is flat config** (`eslint.config.mjs`) — do not create `.eslintrc.*`
- **Env file required**: `DATABASE_URL`, `SESSION_SECRET` (64-char hex), `NEXT_PUBLIC_SITE_URL`. Copy from `.env.example`.
- **GA env var**: component reads `NEXT_PUBLIC_GA4_ID` (not `GA_ID`)
- **Path alias**: `@/*` → `./src/*`
- **ESM config files**: `postcss.config.mjs`, `eslint.config.mjs` — use ESM syntax
- **Root `index.html`** is a standalone static file, **not** part of the Next.js app
- **`.agents/`, `.opencode/`, `.codex/`, `.impeccable/`** are AI-agent tooling, not runtime dependencies
- `.codex/hooks.json` runs a UI audit hook after every file edit via `impeccable`
- **No migrations exist yet** — first deploy should use `db:migrate:dev` or `db:push` to bootstrap
