# DECISIONS

Architectural and business decisions for IcePlease, newest last.

Each record states the decision, why it was made, and what it rules out.
These exist so a future session does not silently undo a good decision.

**Status values:** `Accepted` — decided and binding. `Proposed` — needs
founder confirmation before it becomes binding.

---

## ADR-001 — Reset the repository to a clean slate

**Status:** Accepted · commit `3690d3f`

**Context.** The repository held a partial foundation built before the product
scope existed: a Prisma schema, NextAuth wiring, a register route and a stub
navbar, mixed with untouched `create-next-app` boilerplate. Rebuilding around
it meant inheriting decisions nobody had actually made.

**Decision.** Reduce the repository to a bare Next.js + TypeScript + Tailwind
skeleton and rebuild against the scope, preserving git history so nothing is
destroyed.

**Consequences.** The previous foundation stays recoverable at `211976a` and on
`chore/fresh-start`. The old Prisma schema is a useful reference but is not
re-adopted unchanged — see ADR-006.

---

## ADR-002 — PostgreSQL via Prisma

**Status:** Accepted · implemented

**Context.** IcePlease needs products, orders, order items, customers and B2B
enquiries with real relational integrity. Order totals and stock must be
correct under concurrent writes.

**Decision.** PostgreSQL as the database, Prisma as the ORM and migration tool.
All database access is server-side through a single client singleton.

**Why not the alternatives.** A document store would make order/product/customer
relations and transactional stock handling harder for no gain. Raw SQL costs
migration tooling and type safety.

**Consequences.** Schema evolves through committed migrations. Multi-write
operations that must stay consistent — order plus order items plus stock —
use transactions. Rules §26: data stays clean and portable, no lock-in.

---

## ADR-003 — Money is stored as integer minor units

**Status:** Accepted · implemented

**Context.** Floating-point arithmetic silently corrupts financial totals.

**Decision.** Every monetary value is an integer in paise. `₹199.00` is stored
as `19900`. This applies to product price, order item price, subtotal,
delivery fee and total. Formatting to rupees happens only at the display edge.

**Consequences.** Initial currency is INR (rules §17). No `Float` or `Decimal`
money columns, and no float arithmetic anywhere in pricing.

---

## ADR-004 — Order status and payment status are separate fields

**Status:** Accepted · implemented

**Context.** The scope document (§28) left two competing status sets
unreconciled: a database set (`PENDING / PROCESSING / SHIPPED / DELIVERED /
CANCELED`) and a business set (`New / Confirmed / Preparing / Ready /
Dispatched / Delivered / Cancelled`). The rules document (§11) additionally
requires payment state to be independent of fulfilment state.

**Decision.** Two independent fields.

```text
orderStatus    PENDING → CONFIRMED → PREPARING → READY → DISPATCHED → DELIVERED
                                                                    → CANCELLED
paymentStatus  PENDING → PAID | FAILED | REFUNDED
```

**Why fulfilment uses the business vocabulary.** These are the states the
founder physically acts on, and they are what the admin dashboard must surface
(rules §25: "5 Orders Need Confirmation", "3 Orders Ready for Dispatch").
`SHIPPED` is a parcel-logistics concept that does not describe frozen goods
delivered within a local radius. Mapping business language onto a mismatched
database enum would push a translation layer into every query and report.

**Supersedes.** An earlier suggestion in this project to keep the compact
database set and relabel it in the UI. The rules document outranks it.

**Consequences.** An unpaid order can still be confirmed and prepared, which is
what manual/offline payment during validation actually requires (A-1). A real
payment provider later writes `paymentStatus` without touching fulfilment
logic (rules §11, §23).

---

## ADR-005 — B2B is enquiry-first

**Status:** Accepted · implemented

**Context.** B2B buyers need quantities, quotes, trials and recurring terms.
None of that is consumer checkout with a bigger number in the cart.

**Decision.** B2B starts as a structured enquiry captured to the database, with
a founder-managed pipeline: `NEW → CONTACTED → QUOTED → CONVERTED | CLOSED`.
(`CLOSED` rather than `LOST`: an enquiry also closes when it simply goes quiet,
which is not the same as being lost to a competitor.)
Quotation and negotiation stay manual.

**Consequences.** No B2B self-serve checkout, pricing tiers, contract terms or
portal until real enquiries prove the need (rules §12, §14). The enquiry record
must capture enough to answer "are B2B leads converting?" (rules §6).

---

## ADR-006 — Product data is database-driven, never hardcoded

**Status:** Accepted · implemented

**Context.** The physical product is unvalidated. Flavors, pack sizes, prices,
descriptions and availability will all change repeatedly.

**Decision.** Product information lives in the database and flows through the
server layer to the UI. No component hardcodes a product name, flavor, price,
pack size or image. The founder changes the catalogue through admin screens,
never by editing frontend code.

**Consequences.** The old Prisma schema is insufficient: `Product` gains
`flavor`, `packSize` and `isActive`. Any product data used during development
is clearly marked seed data and is trivially replaceable (rules §8, §10).

---

## ADR-007 — No invented product facts, no fabricated metrics

**Status:** Accepted

**Context.** It is easy to make a site look finished by inventing flavors and a
dashboard look impressive by inventing numbers. Both actively harm a business
in validation, and some would be false public claims.

**Decision.** The application publishes no flavor, ingredient, pack size,
price, shelf life, melting behaviour, certification, partnership, testimonial
or availability claim that the business has not finalized. Any metric that
cannot be honestly computed from real data is not displayed, or is labelled
unavailable — never estimated, never filled with plausible-looking numbers.

**Consequences.** Placeholder UI states say "not configured yet" rather than
showing a convincing fake. Development seed data is visibly marked as such and
never presented as evidence (rules §2, §3, §7, §8, §22).

---

## ADR-008 — Vertical slices, not layers

**Status:** Accepted · was `Proposed`, confirmed by the completed build

**Context.** The scope document's build order front-loaded a brand website and
reached the database in a later phase. The rules forbid fake checkouts and
UI-only CRUD.

**Decision.** Build the data layer and server logic first, then the screens on
top of them, so no screen is ever a mock.

**Outcome.** Every feature shipped in this build reads and writes real rows.
There is no placeholder button and no hardcoded product anywhere in the UI.

---

## ADR-009 — The browser never sets a price

**Status:** Accepted

**Context.** A cart has to be readable and editable offline-ish in the browser,
but anything the browser stores is editable by its owner.

**Decision.** `localStorage` holds product ids and quantities only — no price,
no name, no availability. `lib/server/pricing.ts` turns that into names,
prices and totals, and is used by both the cart display and order creation.

**Consequences.** The number on screen and the number recorded on the order
come from one code path, so they cannot disagree. A forged `unitPriceMinor` in
a request body is ignored, which is verified. The cost is a server round trip
whenever the cart changes; at this scale that is the right trade.

---

## ADR-010 — Stock is claimed with a conditional update

**Status:** Accepted

**Context.** Two customers can check out for the last tray at the same moment.
Read-then-write would let both succeed and drive stock negative.

**Decision.** Inside the order transaction, each line runs
`updateMany({ where: { id, isActive: true, stock: { gte: quantity } }, data: { stock: { decrement: quantity } } })`
and requires `count === 1`. A miss aborts the whole transaction.

**Consequences.** Correct under concurrency without table locks or a
reservation system. Covered by a test in `npm run smoke` that fires two
simultaneous orders at a one-unit product and asserts exactly one succeeds and
stock lands at zero.

**Also:** cancelling an order returns its items to stock in the same
transaction, so cancelled goods do not stay reserved.

---

## ADR-011 — Order status transitions are validated server-side

**Status:** Accepted

**Context.** A status dropdown that accepts any value lets an order jump from
PENDING to DELIVERED, or come back from CANCELLED, corrupting the operational
picture the dashboard is built on.

**Decision.** `NEXT_STATUSES` declares the legal transitions from each state.
The server checks against it; the admin UI renders only the transitions the
server would accept.

**Consequences.** The UI cannot offer an action that will be refused, and the
guard still holds if the action is invoked directly.

---

## ADR-012 — No separate Address model

**Status:** Accepted · refines ADR-002

**Context.** Earlier planning listed an `Address` entity for saved customer
addresses.

**Decision.** One default address on `User`, which prefills checkout, plus the
delivery snapshot every `Order` already carries.

**Why.** Multiple saved addresses is not an MVP need, and a second model would
have brought its own CRUD screens for no current benefit. The order snapshot —
not the user record — is what delivery history actually depends on, so adding
an `Address` model later changes nothing about existing orders.

---

## ADR-013 — Honest gaps over plausible numbers

**Status:** Accepted · implements ADR-007

**Context.** A dashboard with empty spaces looks unfinished, which is a strong
pull toward filling it with something.

**Decision.** Three concrete rules, all now implemented:

1. Order value and money marked paid are separate figures with separate
   labels. With no payment provider, an order total is what was agreed, not
   what was received, and the dashboard says so.
2. Metrics that cannot be honestly derived — gross margin, acquisition cost,
   wastage, settled revenue — are listed by name in a "Not calculated yet"
   panel with what each one needs, rather than estimated.
3. A rate with nothing to divide by renders as "—" or "no data", never 0%.

**Consequences.** The dashboard is less impressive and more useful. The same
rule governs the public site: no testimonials, no partner logos, and contact
channels that are not configured are hidden rather than faked.

---

## ADR-014 — bcryptjs rather than bcrypt

**Status:** Accepted

**Context.** Earlier planning named `bcrypt`, which is a native addon and
requires a working C++ toolchain wherever `npm install` runs.

**Decision.** `bcryptjs`, pure JavaScript, same algorithm and same cost factor
(12 rounds).

**Consequences.** `npm install` works on any machine and in any CI image
without build tooling. Hashing is slower in absolute terms, which is
immaterial at sign-in frequency. Existing hashes are interchangeable between
the two libraries if this is ever revisited.
