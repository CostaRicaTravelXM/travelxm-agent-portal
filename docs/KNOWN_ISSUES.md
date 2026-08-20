# Known Issues & Future Risks

Potential problems, tech debt, and things that will need attention later. Update whenever new code introduces a risk or a TODO.

## Will matter when the backend is added
- **Static data everywhere**: all pages import from `lib/data.ts`. Swap these imports for API fetchers returning the `lib/types.ts` shapes. Client pages that copy data into `useState` (bookings, customers, support) will need React Query or server actions instead.
- **Mutations are local-only**: status changes, deletes, add-client, and ticket submission mutate component state and reset on refresh. This is by design for the demo.
- **Payment links are fake**: `app/(portal)/payments/page.tsx` generates a placeholder `checkout.stripe.com` URL locally. Wire to the real `/api/payments/link` endpoint later.
- **Canva page is display-only**: the connect button shows a toast. The original OAuth flow (`/api/canva/*`) needs the Express API server.
- **No authentication**: the login page is visual only; every portal route is publicly reachable. Add real auth (and route protection/middleware) before any real data goes in.

## External dependencies / hosting
- **Logo is a drawn wordmark**, not the official asset — the real logo blocks hotlinking and direct download (see FIXED_ISSUES). If the official PNG/SVG becomes available, drop it into `public/` and update `components/layout/logo.tsx`.
- **All photos are Unsplash hotlinks**. Fine for a demo; for production, self-host or use a licensed source, and consider `next/image` with a configured `images.remotePatterns` for optimization (currently plain `<img>` tags to match the original markup).
- **Replit export zip** (`Travel-Agent-Portal.zip`, 122 MB) sits in the project folder and is gitignored — GitHub rejects files >100 MB. Don't remove the ignore rule. Safe to delete the zip once the port is confirmed complete.

## Environment quirks
- Local Node is v20.18.0; one dev dependency (`eslint-visitor-keys@5`) wants ≥20.19 and prints an `EBADENGINE` warning on install. Harmless locally; Vercel builds with its own Node ≥20.19 so it doesn't affect deploys.
- `next.config.ts` is default/empty. If `next/image` is adopted for Unsplash images, `images.remotePatterns` must be added.

## UI polish backlog
- Desktop search input (topbar) is decorative — no search behavior is wired.
- "Edit booking" menu item on the bookings page has no action yet.
- "Export CSV" / "Download Statement" buttons show a toast instead of producing files.
- Dark mode tokens exist in `globals.css` but there's no theme toggle; the app renders light. **Dark mode has never been visually verified** — the 2026-08-20 polish pass covered light only, by scope. Expect drift: many surfaces hardcode hex values (`bg-white`, `text-[#1A1A1A]`, `border-[#E8E2D5]`) instead of the semantic tokens, so they will not respond to the `.dark` class at all.

## Photography (added 2026-08-20)
- **Five of the twelve photos are registered but unused**: the jaguar, quetzal, capuchin, sloth, and sea turtles are in `PHOTOS` (`lib/portal-images.ts`) with alt text, but no surface renders them yet. They are wildlife close-ups, which fight text overlays — they suit empty states, an "about" panel, or package cards once real inventory arrives. Nothing breaks if they stay unused.
- **Source filenames do not match their contents.** "Corcovado National Park2.jpg" is scarlet macaws, "Monteverde Cloud Forest Reserve2.jpg" is a quetzal, "Tortuguero National Park.jpg" is a capuchin, and "afari Float from Playa Samara.jpg" is missing its first letter. The `PHOTOS` keys and alt text describe the actual frames. **If you re-export from the masters, re-check the mapping** rather than trusting filenames.
- **Location captions are a judgement call.** The login slide labels (Arenal Volcano, La Fortuna, Pacific Coast, Playa Sámara, Corcovado National Park) were inferred from filenames plus what is visible. "Pacific Coast" in particular is generic because its source file is named `1033579.jpg`. Correct any that are wrong in `CAROUSEL_SLIDES` (`app/page.tsx`).
- **Masters are local-only.** `assets-src/photos/` (32 MB) is gitignored, so it exists on this machine and nowhere else. Anyone cloning the repo gets the WebP versions only. Back the masters up somewhere durable if they matter.
- **~4.4 MB of dead assets still ship**: `public/hero-rainforest.png` (2.2 MB), `public/login-bg.png` (2.1 MB), and `public/opengraph.jpg` (112 KB) are referenced nowhere in `app/`, `components/`, or `lib/` — leftovers from the Replit port. Safe to delete; left in place because removing files was not part of the request.
- **No OpenGraph image is configured.** `app/layout.tsx` sets no `openGraph`/`twitter` metadata, so links to the portal preview with no image even though `opengraph.jpg` exists. Wiring one of the new photos in would be a small, self-contained improvement.

## Introduced or confirmed by the 2026-08-20 polish pass
- **Hardcoded hex is the dominant styling idiom.** Most pages write `#0A4D5C` / `#E8E2D5` / `#6B6B6B` inline rather than using the `--primary` / `--border` / `--muted-foreground` tokens that `globals.css` already defines. It is consistent and correct today, but any future re-theme (dark mode, white-label) means a find-and-replace across ~20 files rather than a token change. Migrating page-by-page to semantic tokens is the highest-value follow-up.
- **`grid-cols-subgrid` is now load-bearing** for the bookings and CRM tables. Baseline-supported (Chrome 117+, Safari 16+, Firefox 71+) so it is safe for this audience, but a row's cells must stay *direct children* of the row element — wrapping them in a `<div>` silently breaks column alignment.
- **Two touch-target exceptions remain**, both deliberate: the "Terms of Service" / "Privacy Policy" links on the login page and the "Canva Developer Portal" link on the Canva page are ~32px and ~16px tall. All three are inline links inside a running sentence, where WCAG 2.5.8 exempts inline text; forcing 44px would break the paragraph's line rhythm.
- **The dashboard hero still uses a kicker** ("GOOD MORNING" above "Welcome back, Agent"). It was left alone because it is a real time-of-day greeting rather than decoration, and removing or merging it would delete copy — a redesign call, not polish. Worth revisiting if the hero is ever reworked.
- **CRM "Integration Flows" nests bordered panels inside a card.** Left as-is (it is a legitimate grouping and the restyle kept it on-system), but nested card-in-card is a pattern worth replacing if that section grows.
- **Featured-packages carousel has no scroll affordance** on any width — the last card is simply cut at the card's padding edge. The filter chip rows got an `edge-fade`; this carousel did not, since it scrolls at every width rather than only on mobile.
- **No automated regression guard for layout.** The overflow/alignment/touch-target harness used for this pass lived in the job scratch directory, not the repo. If these defects should stay fixed, that harness (headless Chrome over CDP, measuring rects at 375/1280/1728) is worth committing as a script plus a CI step.
