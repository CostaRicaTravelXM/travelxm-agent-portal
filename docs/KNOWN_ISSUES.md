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
- Dark mode tokens exist in `globals.css` but there's no theme toggle; the app renders light.
