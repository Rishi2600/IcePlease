# IcePlease

Web application for IcePlease, a packaged flavored-ice brand: brand site,
product catalogue, B2C ordering, B2B enquiries and an admin dashboard.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Prisma · PostgreSQL ·
NextAuth.

---

## Getting started

```bash
npm install
cp .env.example .env          # then fill in NEXTAUTH_SECRET
npm run db:up                 # PostgreSQL on port 5433 via Docker
npm run db:migrate            # apply migrations
npm run db:seed               # demo catalogue, orders and enquiries
npm run dev
```

The app runs at http://localhost:3000.

Generate a secret with `openssl rand -base64 32`.

### Development sign-in

Created by `npm run db:seed`, from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@iceplease.local` | `iceplease-dev` |
| Customer | `customer@iceplease.local` | `iceplease-dev` |

These are development credentials. They are defined in `.env`, which is not
committed, and must never exist in a deployed environment.

---

## Scripts

```bash
npm run dev         # development server (Turbopack)
npm run build       # production build
npm run start       # serve the production build
npm run lint        # ESLint
npm run typecheck   # TypeScript, no emit
npm run smoke       # critical-path checks against the database
npm run db:up       # start the local PostgreSQL container
npm run db:migrate  # prisma migrate dev
npm run db:deploy   # prisma migrate deploy (production)
npm run db:seed     # seed development data
npm run db:studio   # Prisma Studio
```

`npm run smoke` exercises the logic that is expensive to get wrong — cart
pricing, server-side price authority, stock clamping, the order transaction,
the concurrent stock race, and the B2B enquiry path — against a real database,
cleaning up after itself.

---

## Architecture

```text
Browser
   ↓
Next.js App Router (server components by default)
   ↓
Server actions / route handlers      ← validation, authorization
   ↓
lib/server/*                         ← business logic
   ↓
Prisma
   ↓
PostgreSQL
```

```text
app/
  (site)/            public website, shop, cart, checkout, account
  admin/             admin dashboard (authorization enforced server-side)
  api/               auth, registration, cart pricing
components/
  ui/                primitives: button, field, card, badge, alert
  site/              navbar, footer, section, status badges
  product/ cart/ checkout/ forms/ admin/
lib/
  server/            server-only: pricing, orders, catalogue, analytics,
                     customers, inquiries, session, settings
  validation/        Zod schemas, shared by client and server
  money.ts           integer-paise formatting and parsing
  brand.ts           brand content and configured contact channels
prisma/
  schema.prisma  migrations/  seed.ts
scripts/smoke.ts
```

### Rules the code holds to

**Money is integer paise.** `₹199.00` is `19900`. Fields carrying money are
suffixed `Minor`. Rupees exist only as a formatted string at the display edge.

**The browser never sets a price.** The cart stores product ids and quantities.
`lib/server/pricing.ts` is the single authority on what a cart costs, and is
used by both the cart display and order creation, so the number shown and the
number charged come from the same code path.

**Orders snapshot what was bought.** Order items keep name, flavor, pack size
and purchase-time unit price. Editing a product never rewrites a placed order.

**Order status and payment status are independent.** An order can be confirmed
and prepared while payment is still pending, which is what offline payment
requires. A gateway later writes `paymentStatus` without touching fulfilment.

**Authorization runs next to the data.** Middleware guards `/admin` and
`/account`, every admin page calls `requireAdminPage`, and every admin mutation
calls `requireAdminAction`. Hiding a button is not authorization.

**Nothing is claimed that is not true.** No invented product facts, no
testimonials, no partner logos, no fabricated metrics. Contact channels that
are not configured are hidden rather than faked, and the dashboard names the
metrics it cannot honestly compute.

---

## Environment

See `.env.example` for the full list. Required:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | signs session tokens; the app refuses to start in production without it |
| `NEXTAUTH_URL` | canonical auth URL |
| `NEXT_PUBLIC_SITE_URL` | metadata, Open Graph, sitemap |

Optional but meaningful:

| Variable | Effect if unset |
| --- | --- |
| `DELIVERY_FEE_MINOR` | defaults to `4900` (₹49) |
| `FREE_DELIVERY_THRESHOLD_MINOR` | no free-delivery threshold |
| `MAX_QUANTITY_PER_ITEM` | defaults to `20` |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` / `_WHATSAPP_NUMBER` / `_INSTAGRAM_URL` / `_SERVICE_AREA` | that channel is hidden across the site rather than shown as a placeholder |

---

## Deployment notes

1. `npm run db:deploy` applies migrations. Do not run `db:seed` in production.
2. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL`.
3. Delete or replace the seeded demo products. They are badged "Demo" in the
   admin catalogue and are not real IcePlease product information.
4. Create a real admin account and remove the seeded one.

## Not built

Deliberately absent until a real workflow needs them: subscriptions, loyalty,
referrals, coupons, delivery zones and tracking, multi-location inventory, a
B2B self-serve portal, email/WhatsApp notification infrastructure, and any
payment gateway. The order model and the pricing and delivery-fee boundaries
are shaped so each can be added without a rewrite.
