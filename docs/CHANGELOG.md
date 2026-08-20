# Changelog

All notable changes to the TravelXM Agent Portal frontend. Update this file at the end of every coding session, before committing.

## 2026-08-20 — Alignment, overflow, and touch-target polish pass

Design pass over all 13 portal routes plus the login page and 404. Refinement
only — the TravelXM visual world, copy, and features are unchanged. Verified
with a headless-Chrome measurement harness at 375 / 1280 / 1728 px, so the
findings below are measured rather than eyeballed.

### Added
- `.app-container` utility (`app/globals.css`) — the single horizontal rhythm
  for the portal (max-width 80rem, 1rem/2rem gutters). The topbar and every page
  body use it, so search field, page title, and cards share one left edge.
- Themed browser surfaces: text selection, caret, scrollbars, and one
  `:focus-visible` ring drawn from the palette; `scroll-margin-top` on anchored
  sections so they clear the sticky header.
- `prefers-reduced-motion` guard (the app uses framer-motion throughout).
- `.tabular` utility for figures that stack in a column; applied to money, IDs,
  and dates in tables and lists.
- `.edge-fade` utility signalling that a horizontal chip row has more to scroll
  (mobile only — above `sm` those rows now wrap instead).

### Changed
- **Topbar** is sticky at every width (was `static` on desktop, so it scrolled
  away on long pages) and lays out inside `.app-container`.
- **Sidebar** is `sticky top-0 h-screen`; navigation no longer scrolls out of
  view on long pages.
- **Bookings and CRM tables** declare their column tracks once, with the header
  row and every data row inheriting them via `grid-cols-subgrid`. Both switch to
  stacked cards below `lg` (was `md`, where six columns could not fit).
- **Touch targets** raised to the ≥44px project rule at the system level rather
  than per call site: `Button` (all sizes), `Input`, and `SelectTrigger` gain a
  mobile height that tightens at `md`; `Checkbox` keeps its 16px box but gets a
  44px hit area via a `::before` overlay.
- **CRM page** brought onto the design system — it was still on bare shadcn
  defaults (`<Card>`, `text-muted-foreground`, `bg-slate-100`) while every other
  page used the TravelXM palette. Its stat tiles now match Bookings/Commissions.
- Dashboard KPI grid switches to 4 columns at `lg`, matching every sibling page
  (was `xl`, leaving two columns of dead space on laptops).
- Filter chip rows (bookings, packages) wrap above `sm` instead of scrolling
  behind a hidden scrollbar.
- `html, body` use `overflow-x: clip` rather than `hidden` — `hidden` made the
  root a scroll container, which silently disables `position: sticky`.

### Fixed
Nine measured defects; see `docs/FIXED_ISSUES.md` for bug → root cause → fix.

## 2026-08-20 — Real Costa Rica photography

Twelve supplied photographs replace the Unsplash hotlinks on the portal's
*ambient* surfaces. Package imagery is deliberately untouched: packages come
from the API later and carry their own `imageUrl`.

### Added
- `public/imgs/` — 12 self-hosted WebP images (quality 90, longest edge capped
  at 2400px). Source masters (32 MB of JPEG, up to 7952×5304) moved to
  `assets-src/photos/` and gitignored, so they never ship to Vercel.
  **33 MB → 7.9 MB**, and `next/image` resizes further per request.
- `PHOTOS` registry in `lib/portal-images.ts` — every photo with an accurate
  `alt`, whether or not a surface uses it yet, so new surfaces pull from one
  list. Several source filenames described the wrong subject (the file named
  "Corcovado National Park2" is scarlet macaws; "Monteverde Cloud Forest
  Reserve2" is a quetzal; "Tortuguero National Park" is a capuchin), so alt text
  was written from the actual frames rather than the filenames.
- A photo band on the **mobile login**, which previously had no imagery at all —
  the carousel is desktop-only. It cross-fades with the same slide timer.
- A photo header on the **404 page**, which was a bare card.

### Changed
- Login carousel now runs on Costa Rica locations: Arenal Volcano, La Fortuna,
  Pacific Coast, Playa Sámara, Corcovado National Park. The five taglines are
  unchanged — they are brand copy and location-agnostic.
- Dashboard hero uses the rainforest valley near La Fortuna.
- All local images render through **`next/image`** with `fill` + explicit
  `sizes`, giving responsive srcsets, lazy loading below the fold, and
  `priority` on the two LCP images (login slide 1, dashboard hero). Remote
  package images stay on plain `<img>`, as `KNOWN_ISSUES` documents.

### Notes
- Photo→slot assignments were made by inspecting the images, not the filenames.
  Captions are honest to what each frame shows; if a location label is wrong,
  it is a one-line change in `CAROUSEL_SLIDES` (`app/page.tsx`).

## 2026-08-14 — Initial build (Replit → Next.js port)

### Added
- Scaffolded Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 project with npm.
- Ported the TravelXM design system from the Replit project (`app/globals.css`): teal `#0A4D5C` / gold `#D4A24C` / coral `#E87A5D` palette, Fraunces + Inter fonts (loaded via `next/font`), radii, shadows, elevate utilities, Ken Burns + shimmer animations.
- Vendored 16 customized shadcn/ui components from the original project into `components/ui/` (with `"use client"` directives added for Next.js).
- Typed domain model in `lib/types.ts`; static demo data in `lib/data.ts` (packages, bookings, customers, commissions, tickets, payments, CRM sync records); image slot registry in `lib/portal-images.ts`.
- App shell (`components/layout/`): collapsible desktop sidebar, topbar with search/notifications/CTA, and a mobile app-style **bottom tab bar** (Dashboard / Bookings / center New-Booking action / Packages / More sheet) with safe-area insets and ≥44px touch targets.
- Pages: login (`/`), dashboard, bookings (+ new), packages (+ detail), customers (+ detail), commissions, payments, support, crm, canva, and a branded 404.
- Interactivity preserved with local state: booking status changes/deletes, add-client dialog, ticket submission, payment-link generator (demo links), toasts throughout.
- Mobile adaptations: tables collapse to stacked cards (bookings, commissions, customer booking history), full-screen dialogs on small screens, horizontally scrollable filter chips.
- Living docs (`docs/`) and `CLAUDE.md` with project conventions.

### Changed
- Replaced generated React Query API hooks (`@workspace/api-client-react`) with static data imports — this phase is frontend-only.
- Canva page simplified to its disconnected state (OAuth flow needs the API backend).
- Dashboard tier card relabeled "Progress to Platinum" (summary data says the agent is already Gold; the original hardcoded "Progress to Gold").

### Repository
- Pushed to https://github.com/CostaRicaTravelXM/travelxm-agent-portal (public).
- Commits authored by the repo-owning account using its GitHub noreply address (`288302782+CostaRicaTravelXM@users.noreply.github.com`); identity is set **locally** in this repo only (`git config user.email`, no `--global`), so other projects on the machine keep their own identity.
- The remote is `https://CostaRicaTravelXM@github.com/...` — the username in the URL makes Git Credential Manager use that account's credential instead of the machine's default one.

### Security
- Security review of the full codebase: no secrets, no `dangerouslySetInnerHTML`/`eval`, all `target="_blank"` links carry `rel="noopener noreferrer"`, `npm audit` reports 0 vulnerabilities.
- Added security headers in `next.config.ts`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`.

### Fixed (during verification)
- Replaced hotlinked TravelXM logo (403 from shortpixel CDN) with a self-drawn `Logo` component; branded the favicon.
- Pinned `en-US` locale on all number formatting and made all date rendering UTC-deterministic via `lib/format.ts` (`formatUtc`) — prevents hydration mismatches and day-shifted dates.
- Swapped lucide-react's removed brand icons for inline SVGs in `components/icons/social.tsx`.

### Removed
- Replit-specific tooling (Vite plugins, wouter, react-query) — replaced by Next.js equivalents.
