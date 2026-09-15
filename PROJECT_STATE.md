# PROJECT STATE

> Living document. Update whenever the project meaningfully changes.
> Last updated: 2026-09-15 — MVP build complete.

---

## 1. Current status

**Built and running.** The application covers the full MVP: public brand site,
database-backed catalogue, cart, checkout and order creation, customer
accounts, B2B enquiry capture, and an admin dashboard for products, orders,
customers, enquiries and messages.

`npm run lint`, `npm run typecheck`, `npm run build` and `npm run smoke` all
pass. Verified against a running production build, not only by inspection —
see §12.

Superseded: the "clean slate" status recorded before this build.

---

## 2. Stack

Next.js 15 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 ·
Prisma 6 · PostgreSQL 16 · NextAuth 4 · Zod 4 · bcryptjs · lucide-react ·
Radix primitives.

`bcryptjs` rather than `bcrypt`: same algorithm, no native compile step, so
`npm install` works without build tooling on the host.

---

## 3. Source of truth

Product and business context live in the founder's brief. Engineering
decisions live in `DECISIONS.md`. Where they conflict, the business context
wins, and an unknown business fact stays configurable rather than invented.

---

## 4. Architecture

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

No separate backend service, no microservices, no queues.

---

## 5. Database entities

Implemented in `prisma/schema.prisma`, migration `20260915090817_init`.

| Entity | Purpose |
| --- | --- |
| `User` | customers and admins; role, phone, default delivery address |
| `Account` / `Session` / `VerificationToken` | NextAuth adapter models |
| `Product` | catalogue: flavor, pack size, price, stock, active, featured, seed flag |
| `Order` | totals, order status, payment status and method, delivery snapshot |
| `OrderItem` | purchase-time snapshot of name, flavor, pack size and unit price |
| `B2BInquiry` | enquiry-first B2B pipeline |
| `ContactMessage` | contact-form inbox, with a handled flag |

A separate `Address` model was considered and dropped: the order carries its
own delivery snapshot, and one default address on `User` covers prefilling
checkout. Multiple saved addresses can be added later without touching orders.

Money is integer paise throughout, on fields suffixed `Minor`.

---

## 6. Authentication and authorization

NextAuth with a credentials provider, bcrypt hashing and JWT sessions. The
Prisma adapter is retained so an OAuth provider can be added without a
migration.

Roles: `CUSTOMER`, `ADMIN`. Role is re-read on session refresh, so a revoked
admin loses access without waiting for token expiry.

Three layers, all present:

1. `middleware.ts` over `/admin` and `/account`.
2. `requireAdminPage` in every admin page.
3. `requireAdminAction` in every admin mutation.

---

## 7. Environment variables

Documented in `.env.example`. Required: `DATABASE_URL`, `NEXTAUTH_SECRET`,
`NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`. The app throws at import time in
production if `NEXTAUTH_SECRET` is missing.

Business settings (`DELIVERY_FEE_MINOR`, `FREE_DELIVERY_THRESHOLD_MINOR`,
`MAX_QUANTITY_PER_ITEM`) and contact channels are configurable. An unset
contact channel is hidden in the UI rather than rendered as a placeholder.

---

## 8. Implemented features

**Public** — homepage, shop with flavor filter, product detail, how it works,
about, B2B, contact, 404 and error boundaries, robots and a catalogue-driven
sitemap.

**Commerce** — cart with server-side pricing and reconciliation, checkout with
server-side validation, transactional order creation with conditional stock
decrements, order confirmation reachable by reference.

**Accounts** — registration, sign-in, order history, editable profile and
default address.

**B2B** — segment-specific positioning and an enquiry form persisted to the
database, with an admin pipeline.

**Admin** — dashboard metrics, product CRUD with inline stock editing, order
management with validated status transitions and manual payment bookkeeping,
customers split into registered and guest, B2B pipeline, message inbox.

---

## 9. Deferred features

Subscriptions, loyalty, referrals, coupons, delivery zones and tracking,
cold-chain logistics, multi-location inventory, a B2B self-serve portal,
notification infrastructure, and any payment gateway.

---

## 10. Known limitations

- **No payment provider.** Checkout records payment intent. `paymentStatus` is
  set by hand in admin, and both the customer view and the dashboard say so.
- **No email or WhatsApp integration.** The contact form and B2B form say the
  message was recorded, never that it was sent. Messages live in the admin
  inbox.
- **No product photography.** Products with no `imageUrl` render a generated
  ice treatment tinted by the product's accent colour. Setting `imageUrl`
  swaps in a photograph at the same aspect ratio with no layout change.
- **Seed data is demo content.** Flavors, prices, pack sizes and descriptions
  in `prisma/seed.ts` are placeholders, flagged `isSeedData` and badged "Demo"
  in admin. They are not finalized IcePlease product facts.
- **No delivery serviceability.** Any address is accepted. The rule lives in
  one function (`calculateDeliveryFeeMinor`) ready to become zone-based.
- **Admin lists are capped** at 100–500 rows with no pagination. Fine at
  current volume; pagination is the obvious next step.

---

## 11. Important assumptions

| # | Assumption | Consequence |
| --- | --- | --- |
| A-1 | Online payment is not configured | Orders are created with `paymentStatus = PENDING` and confirmed manually |
| A-2 | Currency is INR, stored as integer paise | `₹199.00` is `19900`; no float money anywhere |
| A-3 | The founder is the sole operator | One `ADMIN` role; no permission hierarchy |
| A-4 | Delivery is local and manually fulfilled | Address capture plus a flat fee; no routing or tracking |
| A-5 | B2B begins enquiry-first | No B2B self-serve checkout or portal |
| A-6 | Development product data is seed data | Flagged and badged; trivially replaceable |
| A-7 | Guests may order without an account | Orders carry contact details independently of `User` |

---

## 12. Verification performed

Against a running production build:

- Every public route returns 200; unknown routes 404.
- `/admin` and `/account` redirect correctly: signed out to sign-in with a
  callback, signed-in non-admin to the homepage.
- Wrong-password sign-in yields an empty session.
- `/api/cart` prices from the database and ignores a forged `unitPriceMinor`
  in the request body.
- The B2B server action persists an enquiry and returns per-field errors on
  invalid input.
- All five admin product actions are refused for a customer session and
  succeed for an admin; delete correctly refuses a product with order history.
- `npm run smoke`: 19 assertions covering cart pricing, stock clamping,
  duplicate-line collapsing, order totals, price snapshotting, stock
  decrementing and the concurrent stock race, all passing.

---

## 13. Future integration points

Kept as clean boundaries, not built:

- **Payment** — a provider writes `paymentStatus` without touching fulfilment.
- **Messaging** — WhatsApp/email on order and enquiry events.
- **Delivery** — `calculateDeliveryFeeMinor` becomes zone- or distance-based.
- **Analytics** — extend `lib/server/analytics.ts`; add cost fields to
  `Product` before claiming margin.
