# Deeray

Minimalist home essentials storefront — Next.js 15 + PostgreSQL.

## Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind v4 (CSS-first config in `globals.css`)
- **Database**: PostgreSQL via Prisma 6
- **Auth**: Admin-only sessions via `iron-session`
- **Cart**: Guest cart in encrypted cookies
- **Email**: Nodemailer (SMTP)

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up .env (copy from .env.example)
cp .env.example .env
# Edit .env with your DATABASE_URL and SESSION_SECRET

# 3. Push schema + seed
npm run db:push
npm run db:seed

# 4. Start dev server
npm run dev
```

Admin login: `admin@deeray.com` / `admin123`

## Commands

| Action | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Type check | `npx tsc --noEmit` |
| Prisma Studio | `npm run db:studio` |
| Create migration | `npm run db:migrate:dev` |
| Seed DB | `npm run db:seed` |

## Deploy to Oracle Cloud (VPS)

### Quick start (Make)

```bash
# 1. Clone
sudo mkdir -p /var/www/deeray && sudo chown -R ubuntu:ubuntu /var/www/deeray
cd /var/www/deeray
git clone <your-repo-url> .

# 2. System setup (once)
make setup

# 3. Environment
make env
nano .env.production   # edit DB_PASSWORD, SESSION_SECRET, SITE_URL, SMTP_*

# 4. Start DB
make db

# 5. Migrate + seed
make migrate
make seed

# 6. Nginx + SSL
make nginx DOMAIN=yourdomain.com
make ssl DOMAIN=yourdomain.com
```

That's it — `https://yourdomain.com` live.

### Update to new version

```bash
make deploy
```

### Available commands

| Command | What it does |
|---|---|
| `make setup` | Install Docker, Nginx, certbot, PM2 |
| `make env` | Create `.env.production` from example |
| `make db` | Start PostgreSQL |
| `make migrate` | Run Prisma migrations |
| `make seed` | Seed admin user |
| `make build` | Build app (Docker) |
| `make start` | Start app |
| `make restart` | Restart app |
| `make deploy` | Pull + build + migrate + restart |
| `make nginx DOMAIN=x` | Configure Nginx for your domain |
| `make ssl DOMAIN=x` | Get SSL cert from Let's Encrypt |
| `make logs` | View app logs |
| `make dev` | Start local dev server |

Admin login: `admin@deeray.com` / `admin123`

## Project Layout

| Path | Purpose |
|---|---|
| `src/app/(store)/` | Storefront (products, cart, checkout, etc.) |
| `src/app/admin/` | Admin panel |
| `src/components/` | Shared React components |
| `src/lib/` | Utilities, Prisma singleton, auth, cart |
| `deploy/` | Nginx config, setup scripts |
| `prisma/` | Schema + seed |
| `Makefile` | All-in-one deploy commands |
