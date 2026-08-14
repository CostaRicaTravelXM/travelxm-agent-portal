# TravelXM Agent Portal

Premium B2B travel agent portal — bookings, packages, commissions, CRM leads, payments and support, in the TravelXM design system (deep teal / warm gold / sunset coral, Fraunces + Inter).

**Current phase: frontend only.** Every page renders static demo data from `lib/data.ts`; there is no backend yet. On mobile the portal behaves like a native app (bottom tab bar, sheets, stacked cards, safe-area support).

## Stack

- [Next.js](https://nextjs.org) 16 · App Router · TypeScript
- Tailwind CSS v4 (CSS-first config in `app/globals.css`)
- shadcn/ui components (vendored & customized in `components/ui/`)
- Framer Motion · Recharts · react-hook-form + zod · lucide-react

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the login screen's **Sign In to Workspace** button takes you into the portal.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (what Vercel runs) |
| `npm run lint` | ESLint |

## Project layout

```
app/            routes (login at /, portal pages under (portal)/)
components/
  layout/       app shell: sidebar, topbar, mobile tab bar, logo
  ui/           vendored shadcn primitives (TravelXM-customized)
  icons/        inline brand SVGs
lib/            types.ts (domain model) · data.ts (static demo data)
docs/           CHANGELOG · KNOWN_ISSUES · FIXED_ISSUES (living docs)
```

## Deployment

Hosted on [Vercel](https://vercel.com) via GitHub integration — every push to `main` deploys automatically. No environment variables or extra config required in this phase.

## Documentation

- [docs/CHANGELOG.md](docs/CHANGELOG.md) — what changed, per session
- [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md) — risks, tech debt, TODOs
- [docs/FIXED_ISSUES.md](docs/FIXED_ISSUES.md) — bugs fixed and how
- [CLAUDE.md](CLAUDE.md) — project conventions for AI-assisted development
