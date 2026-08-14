@AGENTS.md

# TravelXM Agent Portal — project conventions

Frontend-only Next.js (App Router) port of the TravelXM Agent Portal (originally React + Vite on Replit). Displays static demo data; no backend yet. Deployed to Vercel via GitHub integration (push to `main` = deploy).

## Living documentation — MANDATORY
Update these files at the end of EVERY session that produces code, before committing:
- `docs/CHANGELOG.md` — dated entry: what changed, where, why.
- `docs/KNOWN_ISSUES.md` — new risks, tech debt, TODOs introduced or discovered.
- `docs/FIXED_ISSUES.md` — bugs fixed this session: bug → root cause → fix.

## Architecture rules (SOLID-aligned)
- Pages under `app/` compose sections; shared chrome in `components/layout/`; primitives in `components/ui/` (vendored, customized shadcn — do NOT regenerate them with the shadcn CLI, they carry the TravelXM design system).
- Data flows through interfaces: types in `lib/types.ts`, static data in `lib/data.ts`. Components must depend on the types, never on data internals — swapping static data for an API later should touch only `lib/data.ts` call sites.
- Strict TypeScript, no `any`. Server Components by default; `"use client"` only where interactivity requires it.
- No `dangerouslySetInnerHTML`. No secrets/env values in the repo.

## Design system
- Colors: teal `#0A4D5C` (brand/sidebar), gold `#D4A24C` (highlights/active), coral `#E87A5D` (primary CTAs), off-white `#FAFAF7`, sand `#F4EFE6`, borders `#E8E2D5`.
- Fonts: Fraunces (serif, h1–h3 automatically) + Inter (body), loaded via `next/font` in `app/layout.tsx`.
- Tokens live in `app/globals.css` (Tailwind v4, CSS-first config — there is no tailwind.config file).

## Mobile = app, not website
- Bottom tab bar (`components/layout/mobile-tab-bar.tsx`) is the primary mobile nav; sidebar is desktop-only (`hidden md:flex`).
- Touch targets ≥44px; tables collapse to stacked cards on `max-md`; dialogs go full-screen on small viewports; respect safe-area insets (`.pb-safe`/`.pt-safe` utilities).
- Verify changes at both 1280px and 375px widths.

## Gotchas
- Folder name has a space (`Agents Portal`) — quote paths in shell commands.
- `Travel-Agent-Portal.zip` (122 MB Replit export) is gitignored; never commit it.
- Pages reading query params via `useSearchParams` must wrap in `<Suspense>` or `next build` fails.
- Images are plain `<img>` with remote URLs (Unsplash + hotlinked logo) — see docs/KNOWN_ISSUES.md before "optimizing" them.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build (what Vercel runs); must pass before every push
- `npm run lint` — ESLint
