# PROJECT STATE

> Living document. Update whenever the project meaningfully changes.
> Last updated: 2026-09-15 — commit `3690d3f`

---

## 1. Current status

**Clean slate.** The repository was deliberately reduced to a bare Next.js
skeleton so IcePlease could be rebuilt against the product scope.

Nothing of the application exists yet. No database, no auth, no catalogue,
no cart, no checkout, no admin, no B2B flow.

What is present:

```text
app/layout.tsx       minimal root layout
app/page.tsx         placeholder
app/globals.css      Tailwind import only
eslint.config.mjs    next/core-web-vitals + next/typescript
next.config.ts       defaults
postcss.config.mjs   @tailwindcss/postcss
tsconfig.json        strict, @/* path alias
```

Dependencies are `next` / `react` / `react-dom` plus the TypeScript, ESLint
and Tailwind toolchain. Nothing else.

`npm run lint`, `npm run typecheck` and `npm run build` pass.

---

## 2. History worth knowing

The repository previously contained a partial foundation: a Prisma schema
(User, Product, Order, OrderItem, Address, plus the NextAuth models), NextAuth
wired with the Prisma adapter and a credentials provider, a `/api/register`
route, a Prisma client singleton, and a shadcn `button`.

That work was removed in the clean slate but is **not lost**:

| What | Where |
| --- | --- |
| Full previous foundation | commit `211976a`, branch `chore/fresh-start` |
| Prisma schema | `git checkout 211976a -- prisma/schema.prisma` |
| IcePlease design tokens | `git checkout 211976a -- app/globals.css` |
| IcePlease metadata | `git checkout 211976a -- app/layout.tsx` |

The old schema is a reasonable starting point for the data layer but is **not
sufficient as-is** — see §5.

---

## 3. Source of truth

Two documents define this project. They currently exist only in conversation
history, **not in the repository**, which is a risk for future sessions:

1. `IcePlease_Critical_Project_Rules.md` — guardrails. Highest priority.
2. `IcePlease_Web_Application_Scope.md` — product context and web-app scope.

Where the two conflict, the rules document wins (its §31 handoff order).

**Open action:** commit both into `docs/` so they survive independently of
any chat session.

---

## 4. Architecture (intended)

```text
Browser
   ↓
Next.js App Router (server components by default)
   ↓
Server Actions / Route Handlers
   ↓
Business logic  (pricing, order creation, authorization)
   ↓
Prisma
   ↓
PostgreSQL
```

No separate backend service. No microservices. No queues.

---

## 5. Database entities (intended)

Not yet implemented. Target set:

| Entity | Purpose |
| --- | --- |
| `User` | customers and admin; role-bearing |
| `Account` / `Session` / `VerificationToken` | NextAuth |
| `Product` | catalogue; flavor, pack size, price, stock, availability |
| `Order` | totals, order status, payment status, address snapshot |
| `OrderItem` | purchase-time price preserved |
| `Address` | saved customer addresses |
| `B2BInquiry` | enquiry-first B2B pipeline |

Deltas the old schema does **not** yet cover:

- `Product`: `flavor`, `packSize`, `isActive`
- `Order`: `subtotal`, `deliveryFee`, `paymentStatus` (separate from `status`)
- `User`: `phone`, `role`
- `B2BInquiry`: entire model missing

---

## 6. Authentication and authorization

Not yet implemented. Intended:

- NextAuth with a credentials provider; GitHub optional and only if it earns
  its place for a consumer brand.
- Roles: `CUSTOMER`, `ADMIN`. `B2B_CUSTOMER` deferred until a real workflow
  needs it.
- Authorization enforced server-side on every admin route and mutation.
  Hiding a button is not authorization.

---

## 7. Environment variables

None required by the current skeleton. `.env.example` is intentionally empty
apart from a header comment.

Expected as the build proceeds:

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Prisma / PostgreSQL |
| `NEXTAUTH_URL` | NextAuth |
| `NEXTAUTH_SECRET` | NextAuth |
| `NEXT_PUBLIC_SITE_URL` | metadata, canonical URLs, Open Graph |

---

## 8. Implemented features

None.

---

## 9. Deferred features

Per rules §14 and scope §39 — deliberately not built:

loyalty, referrals, coupons, subscriptions, delivery tracking, recommendation
engine, advanced CRM, demand forecasting, production planning, multi-city
inventory, notification infrastructure, custom payment abstraction layers,
large analytics dashboards, complex role hierarchies.

---

## 10. Known limitations

- No database is provisioned. A PostgreSQL instance is required before any
  data work can begin.
- No payment provider is configured, and none will be faked.
- No real product photography exists. Image slots must be drop-in
  replaceable (rules §19).
- No finalized product facts exist — no flavors, pack sizes, prices, shelf
  life or claims. Nothing of the sort may be published (rules §2, §3, §22).

---

## 11. Important assumptions

Each of these is a real assumption, not a validated fact. Revisit when the
business supplies truth.

| # | Assumption | Consequence |
| --- | --- | --- |
| A-1 | Online payment is not configured for MVP | Checkout creates an order with `paymentStatus = PENDING`; the founder confirms payment manually |
| A-2 | Currency is INR, stored as integer paise | `₹199.00` is stored as `19900`; no floating-point money anywhere |
| A-3 | The founder is the sole operator initially | One `ADMIN` role is enough; no permission hierarchy |
| A-4 | Delivery is local and manually fulfilled | Address capture plus a simple delivery fee; no routing, zones or tracking |
| A-5 | B2B begins as enquiry-first | No B2B self-serve checkout or portal |
| A-6 | Any product data present during development is seed data | Must be clearly marked and trivially replaceable |

---

## 12. Future integration points

Kept as clean boundaries, not built:

- **Payment** — a provider slots in behind `paymentStatus` without touching
  order state.
- **Messaging** — WhatsApp/email notifications on order events.
- **Delivery** — serviceability and zone checks at address entry.
- **Analytics** — derived from real order data only; never fabricated.
