# AuraStore

AuraStore is a full-stack e-commerce application with the original React storefront, a PostgreSQL/Prisma data layer, an Express API, transactional checkout, and a protected administration portal.

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (local, Docker, Neon, Supabase, or another PostgreSQL provider)

## Setup

```bash
npm install
copy .env.example .env
```

Edit `.env` and provide a reachable PostgreSQL URL and strong secrets. JWT secrets must each be at least 32 characters. The seed creates the initial administrator only when both `ADMIN_EMAIL` and `ADMIN_PASSWORD` are present; the password must be at least 12 characters.

```bash
npm run db:deploy
npm run db:seed
npm run dev
```

`npm run dev` starts the API and Vite storefront together. You can also use `npm run dev:server` and `npm run dev:web` in separate terminals.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Access-token signing secret (32+ characters) |
| `JWT_REFRESH_SECRET` | Separate refresh-token signing secret (32+ characters) |
| `ADMIN_EMAIL` | Initial seeded administrator email |
| `ADMIN_PASSWORD` | Initial seeded administrator password (12+ characters) |
| `ADMIN_NAME` | Initial administrator display name |
| `CLIENT_URL` | Allowed browser origin, normally `http://localhost:5173` |
| `PORT` | Express API port, normally `3000` |
| `SERVER_ENV` | `development`, `test`, or `production` for the API |
| `UPLOAD_DIR` | Local product-image directory |
| `VITE_API_URL` | Optional API origin; blank uses the Vite proxy |

Never commit `.env` or real credentials.

## Database

The initial migration is stored in `prisma/migrations`. Prisma models include:

- `AdminUser`, `AdminSession`
- `Product`, `ProductImage`, `Category`
- `Inventory`, `InventoryAdjustment`
- `Customer`, `Address`
- `Order`, `OrderItem`
- `Coupon`

Useful commands:

```bash
npm run db:migrate     # create/apply development migrations
npm run db:deploy      # apply committed migrations
npm run db:seed        # seed existing AuraStore catalog, coupons, and admin
npm run db:studio      # inspect data visually
npm run db:local:start # start the project-local Windows PostgreSQL installation
npm run db:local:stop  # stop the project-local Windows PostgreSQL installation
npm run prisma:generate
```

The seed imports every product from the original storefront catalog, including images, prices, discounts, ratings, descriptions, variants, categories, and stock.

## URLs

- Storefront: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin/login`
- Admin dashboard: `http://localhost:5173/admin`
- API: `http://localhost:3000/api`
- Health check: `http://localhost:3000/api/health`

Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` after seeding.

## Security and order integrity

- Admin APIs require signed access cookies; refresh sessions are rotated and stored as hashes.
- Passwords are hashed with bcrypt.
- Manager accounts are read-only; `ADMIN` and `SUPER_ADMIN` can mutate store data.
- Helmet, credentialed CORS, authentication rate limiting, Zod validation, and sanitized errors are enabled.
- Checkout sends only product IDs, quantities, and variants. The API reloads current prices and stock, validates coupons, calculates totals, writes order snapshots, and decrements inventory in one serializable transaction.
- Products used in previous orders are archived instead of breaking order history.

## Images

Development uploads are validated and stored below `UPLOAD_DIR`, served at `/uploads`. Product images are separate database records, so replacing local storage with S3, Cloudinary, or another provider does not require changing the product/order model.

## Production

```bash
npm run build
npm run db:deploy
npm start
```

The production server build is emitted to `server-dist`, and the storefront build to `dist`. Serve `dist` with your web host or CDN and point `VITE_API_URL` at the deployed API before building.
