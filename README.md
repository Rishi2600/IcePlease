# IcePlease

The web application for **IcePlease** — a packaged flavored-ice brand built around one idea:

> Make the ice itself part of the drink experience.

This app is the brand's digital operating layer: it presents the product, lets customers
order, collects B2B enquiries, and gives the founder simple product and order management.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| Database | PostgreSQL via Prisma 6 |
| Auth | NextAuth 4 (credentials + GitHub) |

## Getting started

```bash
npm install
cp .env.example .env   # then fill in real values
npx prisma migrate dev # create/apply the database schema
npm run dev
```

The app runs at http://localhost:3000.

## Scripts

```bash
npm run dev        # development server (Turbopack)
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
npm run db:migrate # prisma migrate dev
npm run db:studio  # browse the database
npm run db:generate# regenerate the Prisma client
```

## Layout

```text
app/          routes (App Router), API routes, global styles
components/   ui/ holds reusable primitives
lib/          prisma client singleton, shared helpers
prisma/       schema and migrations
```

## Conventions

- **Money is stored as integers** in the smallest currency unit (paise). Never use floats.
- **Order totals are calculated server-side.** The browser is never trusted for price,
  subtotal, stock or availability.
- **Authorization is enforced on the server.** Hiding a button in the UI is not authorization.
- **Design tokens live in `app/globals.css`.** Components consume semantic tokens
  (`--primary`, `--muted`) rather than raw brand colors.
- **The physical product is the source of truth for site content.** Do not publish flavors,
  pack sizes, claims, shelf life or availability that have not been finalized.

## Build order

1. **Foundation** — layout, metadata, design tokens, navbar/footer, auth boundaries
2. **Brand website** — homepage, flavors, product detail, how it works, about, B2B, contact
3. **Commerce** — cart, checkout, order creation and confirmation
4. **Admin** — product CRUD, order management, B2B enquiry management
5. **Business signals** — analytics that answer real questions

Start lean. Validate. Measure. Improve. Then scale.
