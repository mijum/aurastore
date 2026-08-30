# AuraStore

AuraStore is a full-stack e-commerce application featuring a React storefront (Vite + Tailwind CSS), an Express TypeScript API, a PostgreSQL data layer powered by Prisma with connection pooling, and an administrative operations portal.

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (Local, Docker, Neon, Supabase, or any compatible PostgreSQL provider)

## Quick Start

### 1. Installation & Environment Configuration

```bash
npm install
copy .env.example .env
```

Edit `.env` to configure your database connection and security credentials:

```ini
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
JWT_ACCESS_SECRET="your-jwt-access-secret-at-least-32-chars"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-at-least-32-chars"
CLIENT_URL="http://localhost:5173"
PORT=3000
SERVER_ENV="development"
UPLOAD_DIR="uploads"
ADMIN_EMAIL="admin@aurastore.com"
ADMIN_PASSWORD="YourSecurePassword123!"
ADMIN_NAME="AuraStore Administrator"
```

> **Note**: The database seed initializes the administrator account with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in `.env`.

### 2. Database Migration & Seed

```bash
npm run db:deploy      # Apply Prisma migrations
npm run db:seed        # Seed product catalog, categories, coupons, and initial admin account
```

### 3. Start Development Server

```bash
npm run dev
```

`npm run dev` concurrently starts both:
- **API Server**: Express backend on [http://localhost:3000](http://localhost:3000)
- **Storefront / Admin**: Vite dev server on [http://localhost:5173](http://localhost:5173)

You can also run them independently via `npm run dev:server` and `npm run dev:web`.

---

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (supports Neon, Supabase, and local Postgres) |
| `JWT_ACCESS_SECRET` | Secret key for signing short-lived access tokens (min. 32 characters) |
| `JWT_REFRESH_SECRET` | Secret key for signing rotating refresh tokens (min. 32 characters) |
| `ADMIN_EMAIL` | Administrator login email / username |
| `ADMIN_PASSWORD` | Administrator login password |
| `ADMIN_NAME` | Administrator display name |
| `CLIENT_URL` | Allowed CORS origin (typically `http://localhost:5173`) |
| `PORT` | API server port (default: `3000`) |
| `SERVER_ENV` | Environment mode (`development`, `test`, or `production`) |
| `UPLOAD_DIR` | Directory for uploaded media and product imagery |
| `VITE_API_URL` | Optional custom API base URL (empty defaults to Vite reverse proxy) |

---

## Key Architecture & Features

### 1. Database & Connection Pooling
- **Prisma with `@prisma/adapter-pg`**: Configured with a dedicated `pg.Pool` instance in `server/src/db.ts` to manage connection limits, timeouts, and idle connections.
- **Serverless Database Compatibility**: Optimized for cloud databases (such as Neon and Supabase) by preventing cold-start transaction timeouts.
- **Concurrent Read Queries**: High-throughput read endpoints (dashboard metrics, product catalog, orders, and customer queries) utilize non-blocking `Promise.all` rather than wrapping read-only queries in serializable database transactions.

### 2. Authentication & Authorization
- **Clean Authentication**: All demo auto-fill banners have been removed from both Customer Sign In (`/login`) and Admin Sign In (`/admin/login`) in favor of direct credential authentication.
- **Role-Based Access Control (RBAC)**: Support for `MANAGER` (read-only inspection), `ADMIN`, and `SUPER_ADMIN` roles.
- **Secure Token Lifecycle**: HTTP-only cookie-based authentication with rotating refresh token sessions and SHA-256 session hashing. Passwords are encrypted with bcrypt (12 salt rounds).
- **Security Middleware**: Helmet security headers, credentialed CORS, rate limiting on authentication routes, and Zod schema validation on incoming payloads.

### 3. Storefront & Checkout Integrity
- **Server-Side Price Validation**: Client submissions provide only item IDs, quantities, and chosen variants. The backend verifies real-time pricing, recalculates discounts and taxes, and locks stock.
- **Transactional Order Placement**: Order creation and stock decrement execute within atomic transactions to prevent double-spending or overselling.
- **Non-Destructive Archival**: Products referenced in historical orders are flagged as `ARCHIVED` rather than hard-deleted.

---

## Application Routes

| Endpoint | Destination |
| --- | --- |
| `http://localhost:5173/` | Customer Storefront |
| `http://localhost:5173/shop` | Product Catalog with filtering & search |
| `http://localhost:5173/login` | Customer Sign In |
| `http://localhost:5173/admin/login` | Admin Operations Portal Sign In |
| `http://localhost:5173/admin` | Admin Operations Dashboard |
| `http://localhost:3000/api` | API Root |
| `http://localhost:3000/api/health` | API & Database Health Check |

---

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Runs both Express API and Vite frontend concurrently with hot reload |
| `npm run dev:server` | Runs Express API only (`tsx watch server/src/server.ts`) |
| `npm run dev:web` | Runs Vite frontend development server |
| `npm run db:deploy` | Applies pending Prisma migrations to the database |
| `npm run db:migrate` | Generates and applies development database migrations |
| `npm run db:seed` | Seeds reference categories, products, coupons, and admin credentials |
| `npm run db:studio` | Launches Prisma Studio GUI for data inspection |
| `npm run build` | Builds Prisma client, compiles server TypeScript, and bundles Vite assets |
| `npm start` | Runs the compiled production server (`node server-dist/server/src/server.js`) |

---

## Production Deployment

```bash
npm run build
npm run db:deploy
npm start
```

The production server serves both the Express API and the compiled frontend bundle from `dist/` on the configured `PORT`.

