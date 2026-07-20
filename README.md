# EmmaPresh Eatery & Lounge — Digital Platform

A multi-location food, bakery, catering, academy and events platform for EmmaPresh Eatery & Lounge
(Abuja, Lagos, Badagry), built with Next.js App Router, TypeScript and Tailwind CSS.

This README documents what's fully wired end-to-end, what's stubbed for a future backend pass, and
how to run and extend the project.

## Stack

- Next.js (App Router) + TypeScript, strict mode
- Tailwind CSS v4 (design tokens defined in `src/app/globals.css` via `@theme`)
- Zustand (+ `persist`) for cart, branch selection, and every mock "database" store
- React Hook Form + Zod for validated forms
- Framer Motion for motion, Lucide for icons
- Supabase (`@supabase/supabase-js` + `@supabase/ssr`) — connected, not yet load-bearing (see below)
- next/font for `Archivo Black` (display) + `Plus Jakarta Sans` (body)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000. On first visit you'll be asked to choose a branch (Abuja, Lagos or
Badagry) — this drives menu availability, pricing and bank details throughout the site.

> **Windows note:** avoid `&` or other shell-special characters in the project folder path. Node's
> internal worker processes (used by Next/Turbopack) spawn through `cmd.exe` on Windows, and an
> unescaped `&` in the path will crash them intermittently.

### Admin access

`/admin/*` is gated behind Supabase auth (middleware-enforced — signed-out users are redirected to
`/admin/login`). Create your first staff account with:

```bash
ADMIN_EMAIL=you@emmapresh.com ADMIN_PASSWORD='StrongPass123!' npm run create-admin
```

This calls the Supabase Admin API directly using the service-role key in `.env.local` — no dashboard
clicking required. Sign in at `/admin/login` afterward.

## What's fully implemented (real UI + working logic, no dead buttons)

**Customer-facing:**
- Homepage — hero, quick-service cards, popular menu, junk food strip, feature sections, branch
  cards, testimonials, FAQ accordion, gallery preview
- Full menu browsing + product detail (option groups, quantity, age confirmation, related items)
- Cart (drawer + full page), multi-step checkout, bank-transfer payment + receipt upload (does not
  auto-confirm payment), order confirmation, and order tracking with a visual status timeline
- **Meals by Litre** and **Meal Plans** — litre-size selector feeding the same cart/checkout, plus a
  weekly/monthly plan request form
- **Catering** — package listing + a full quotation request form (guest count, service style,
  staffing/equipment/decoration add-ons)
- **Cakes** — ready-cake catalogue (add straight to cart, inscription support) + a custom cake
  request form with multi-image upload
- **Academy** — course catalogue (by track: cooking/baking), course detail pages, and an application
  form
- **Event Halls** — hall catalogue, capacity/facilities detail pages, and an availability request form
- **Reservations** — table booking request form
- **Locations** — branch index + per-branch detail pages (hours, services offered, contact)
- Content pages: About, Contact (with a working message form), FAQ (with `FAQPage` structured data),
  Gallery, Offers, Search, and the Privacy/Terms/Refund/Delivery policy pages
- **Account area** — guest "look up my order history" flow (no password needed, matches by the
  email/phone used at checkout), order + request history across every module, and a working
  Favourites list (heart icon on any menu item)

**Admin dashboard (`/admin`), gated behind real Supabase auth:**
- Overview — live stats computed from real order + request data across every module
- Orders — searchable/filterable list + detail view with full status controls
- Payments — dedicated verification queue (approve/reject, amount/reference/date, rejection reason)
  — the "no auto-approval from receipt upload" rule is enforced here
- Kitchen board — Kanban view with one-click status moves
- Menu management — live sold-out/low-stock toggle reflected instantly on the storefront
- **Catering, Cakes, Academy, Event Halls, Reservations** — real list views wired to their stores,
  with status-update controls and (for catering/cakes) a quote-amount workflow
- Customers & Audit Logs — derived live from real order history, not hardcoded

Every module above shares its own Zustand store (persisted to `localStorage`), so an action taken as
a customer (place an order, request a quote, apply to a course) shows up immediately in the matching
admin list — all within the same browser session.

## What's intentionally out of scope for this pass

- **Real backend wiring**: Supabase is connected (see below) but no page queries it yet — all data
  lives in the mock stores/localStorage. This is the main remaining step toward production.
- **Customer authentication**: the account area works via a lightweight "lookup by email" pattern
  rather than real sign-up/sign-in — intentional, since guest checkout is the priority per the brief,
  but a real customer auth flow (mirroring the admin login already built) is a natural next step.
- **PWA offline support**: manifest + icons are real (`src/app/manifest.ts`, `src/app/icon.tsx`,
  `src/app/icons/*`), but there's no service worker yet, so "add to home screen" works but offline
  caching doesn't.
- Real photography (placeholder gradient/icon cards are used throughout by design — see `FoodImage`),
  automated tests, and a few very specific sub-routes from the original spec (`/catering/indoor`,
  `/cake-order-terms`, per-service location pages like `/catering-in-lagos`) were trimmed for scope.

## Backend integration point

Everything in `src/services/*` and `src/stores/*` is a typed mock — swap the function bodies for
Supabase queries (Postgres + RLS + Storage for receipts/cake references) without touching any page
or component; the function signatures are the contract. `src/data/*` is the seed data used both by
the mock services and to pre-populate demo orders/requests.

### Supabase — connected, ready to take over

A Supabase project is wired up (`.env.local`, gitignored):

- `src/lib/supabase/client.ts` — browser client for Client Components (anon key, subject to RLS)
- `src/lib/supabase/server.ts` — server client for Server Components/Actions (reads the caller's
  session from cookies, still subject to RLS)
- `src/lib/supabase/admin.ts` — service-role client for trusted server-only operations that must
  bypass RLS (e.g. finance verifying a payment). Guarded with `server-only` so it can't accidentally
  end up in client-side JS.
- `src/middleware.ts` — refreshes the auth session cookie on every request **and gates `/admin/*`**
  behind a signed-in session (this part is live and enforced today)
- `scripts/create-admin-user.mjs` — bootstraps a staff account via the Admin API

Next steps to go fully live: run schema migrations for the entities in `src/types/`, enable RLS
policies per table, then replace one mock service/store at a time with real Supabase queries —
starting with `orders-store.ts` since every other module follows its exact shape.

**Rotate your keys:** if you ever paste a `service_role`/secret key into a chat, ticket, or log,
treat it as compromised and regenerate it from Project Settings → API — plaintext secrets in a
transcript aren't meaningfully different from a leaked `.env` file.

## Project structure

```
src/
  app/            routes (App Router) — including manifest.ts, sitemap.ts, robots.ts, icon.tsx
  components/     ui/, layout/, home/, menu/, cart/, checkout/, orders/, admin/, catering/, cakes/,
                  academy/, halls/, reservations/, account/, contact/, legal/, seo/
  stores/         Zustand stores — one per module (cart, branch, orders, catering, cake-requests,
                  academy, halls, reservations, meal-plans, contact, favourites, customer-session)
  services/       typed mock services (menu, branch, cake) — Supabase integration point
  data/           seed data + seed requests for every module
  schemas/        Zod validation schemas
  types/          shared TypeScript types for every entity in the platform
  config/         site config, nav, fonts
  lib/            utils + supabase/ (client, server, admin)
scripts/
  create-admin-user.mjs   bootstrap a staff/admin account
```

## Brand system

All colours are CSS variables in `src/app/globals.css` (`--color-primary-red`, `--color-primary-yellow`,
etc.) — change them there to re-skin the whole product. The logo is a text wordmark
(`src/components/layout/logo.tsx`) designed to be swapped for a real logo file later. The favicon/app
icons are generated dynamically (`src/app/icon.tsx`, `apple-icon.tsx`, `icons/192`, `icons/512`) — no
static image files to manage until you have real brand assets.

## Transactional email

Email is sent server-side through Nodemailer and Gmail SMTP. Copy `.env.example` to `.env.local`, enable 2-Step Verification on the Google account, create a Google App Password for Mail, and set `GMAIL_USER` plus `GMAIL_APP_PASSWORD`. The app password may include spaces; the mailer removes them before authentication.

The reusable mailer is in `src/lib/email.ts`. It includes a pooled TLS connection, address and header validation, branded responsive HTML with a plain-text fallback, connection timeouts, retry with exponential backoff for transient SMTP failures, and delivery metadata. Customer submission and admin order-update emails flow through `src/lib/notifications.ts`.

After signing in as a staff user, request `GET /api/admin/email/verify` to verify the SMTP login without sending a message. A successful response is `{ "ok": true }`. Keep App Passwords only in `.env.local` and in the deployment provider's encrypted environment settings; revoke and replace one immediately if it is exposed.

Gmail is suitable for low-to-moderate transactional traffic, but Google enforces sending limits. For sustained bulk automation, keep the `sendEmail` interface and replace the transport with a dedicated transactional provider.
