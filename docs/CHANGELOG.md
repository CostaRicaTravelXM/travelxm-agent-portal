# Changelog

All notable changes to the TravelXM Agent Portal frontend. Update this file at the end of every coding session, before committing.

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

### Security
- Security review of the full codebase: no secrets, no `dangerouslySetInnerHTML`/`eval`, all `target="_blank"` links carry `rel="noopener noreferrer"`, `npm audit` reports 0 vulnerabilities.
- Added security headers in `next.config.ts`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`.

### Fixed (during verification)
- Replaced hotlinked TravelXM logo (403 from shortpixel CDN) with a self-drawn `Logo` component; branded the favicon.
- Pinned `en-US` locale on all number formatting and made all date rendering UTC-deterministic via `lib/format.ts` (`formatUtc`) — prevents hydration mismatches and day-shifted dates.
- Swapped lucide-react's removed brand icons for inline SVGs in `components/icons/social.tsx`.

### Removed
- Replit-specific tooling (Vite plugins, wouter, react-query) — replaced by Next.js equivalents.
