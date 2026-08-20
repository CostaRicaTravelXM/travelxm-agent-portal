# Fixed Issues

Problems encountered and how they were resolved (bug → root cause → fix), so the same thing never needs re-debugging.

## 2026-08-20 — Polish pass

### Sidebar collapse toggle was invisible and unclickable on every desktop page
- **Bug**: the expand/collapse control rendered as a ~12px sliver at the sidebar's right edge and could not be used.
- **Root cause**: the toggle is `absolute -right-3`, deliberately overhanging the aside, but the aside carried `overflow-hidden`, which clipped exactly that overhang.
- **Fix**: removed `overflow-hidden` from the aside. The elements that genuinely need clipping during the collapse animation (logo wrapper, nav labels via `truncate`, profile chip) already clip themselves.

### Topbar and page content did not share a left edge
- **Bug**: at 1280px the topbar search sat at x=264 while the page title sat at x=272; at 1728px the gap widened to 80px (264 vs 344).
- **Root cause**: the page body was `max-w-7xl mx-auto` with `p-8`, while the topbar was full-bleed with `px-6` — two different max-widths and two different gutters.
- **Fix**: introduced `.app-container` and applied it to both. Measured after the fix: `headerInner.left === mainInner.left` on all 13 routes at both 1280 and 1728.

### Bookings table headers did not line up with their columns
- **Bug**: "DESTINATION", "DATES", "AMOUNT" and "STATUS" sat visibly offset from the data beneath them.
- **Root cause**: the header row and each data row were *separate* grids that happened to share a `grid-cols-[1fr_1fr_auto_auto_auto_auto]` string. The `auto` tracks size to each grid's own contents — the header's to its label text, the rows' to their values — so they resolved to different widths.
- **Fix**: one parent grid owns the tracks; the header and rows are `grid-cols-subgrid` children of it, so columns are identical by construction. Same pattern applied to the CRM sync table.

### Horizontal overflow was globally masked
- **Bug**: real overflow could not be seen or diagnosed, and the mobile sticky topbar did not stick.
- **Root cause**: `html, body { overflow-x: hidden }` hid the symptom, and setting it on the root makes the body a scroll container, which disables `position: sticky` in descendants.
- **Fix**: switched to `overflow-x: clip` (contains overflow without creating a scroll container) and fixed the underlying overflows individually.

### CRM sync table forced a 175px sideways scroll on mobile
- **Bug**: the table was ~550px wide inside a 375px viewport, against the project rule that tables collapse to stacked cards on `max-md`.
- **Fix**: added a stacked-card layout below `lg`; the table renders only where it fits.

### Filter chips were clipped with no way to reach them
- **Bug**: on desktop the last status/category chips ("Cancelled", "Honeymoon") were cut off at the container edge. The row was `overflow-x-auto` with `scrollbar-hide`, so there was no scrollbar and no drag affordance with a mouse.
- **Fix**: the row wraps above `sm`; below `sm` it still scrolls but carries an `edge-fade` mask so the cut edge reads as "more this way".

### Search icon detached from its field once the chip row wrapped
- **Bug**: introduced by the chip-wrapping fix above — the magnifier appeared *below* the search input on bookings and packages.
- **Root cause**: the filter row is `sm:flex-row` with default `align-items: stretch`, so the search wrapper grew to match the now-two-line chip row; the icon is positioned at `top-1/2` of that wrapper, not of the input.
- **Fix**: `sm:items-start` on the filter row. Verified: wrapper height 40px = input height, icon centre = input centre.

### Important text truncated where there was room to wrap
- **Bug**: support ticket subjects lost up to 160px of their text on mobile ("Payment link expired before customer paid" rendered as "Payment link expired before custom…"), and customer/payment email addresses were clipped mid-domain.
- **Root cause**: single-line `truncate` applied to the row's most important content.
- **Fix**: subjects wrap (`text-pretty`, no truncate); addresses use `break-all` + `line-clamp-2`, since emails contain no spaces for normal wrapping to act on.

### Card titles sat 4–12px off their own content
- **Bug**: on support, "My Tickets" and "Frequently Asked Questions" were inset 24px while their list rows were inset 20px; on the dashboard, "Recent Bookings" was inset 24px while its rows were inset 36px.
- **Root cause**: `CardHeader` defaults to `p-6`, but the list bodies used `p-5` or added their own `px-3`.
- **Fix**: headers moved onto their bodies' rhythm; the dashboard list uses `-mx-3` so the hover band still bleeds while the text aligns with the title.

## 2026-08-14

### create-next-app refused the project folder name
- **Bug**: `npx create-next-app@latest .` cannot be used directly in `Agents Portal` — the folder name contains a space and capital letters, which violate npm package-name rules.
- **Fix**: scaffolded into a temporary `agents-portal` subfolder, then moved all files (including dotfiles) up to the root with `shopt -s dotglob; mv agents-portal/* .`.

### Extracting the Replit zip on Windows
- **Bug**: Git Bash `unzip` silently failed to extract subdirectories (exit code 2, only top-level files landed), and GNU `tar` can't read zip archives ("This does not look like a tar archive"; also treats `C:` as a remote host without `--force-local`).
- **Root cause**: the zip uses a directory-entry layout the msys unzip build mishandles.
- **Fix**: used .NET `System.IO.Compression.ZipFile` via PowerShell to selectively extract `artifacts/agent-portal/**` (93 files) while skipping `.git/` and `node_modules/`.

### Vendored shadcn components crashed under Next.js
- **Bug**: components copied from the Vite project would fail in Next.js App Router — Vite doesn't need `"use client"`, Next.js does for anything using hooks/context/Radix.
- **Fix**: prepended `"use client"` to the 11 vendored files that lacked it (and `hooks/use-toast.ts`) before first build.

### Broken logo (403) on every page
- **Bug**: the logo image hotlinked from `sp-ao.shortpixel.ai` (travelxm.com's CDN) returns 403 when requested from any other origin; travelxm.com also blocks direct downloads.
- **Fix**: replaced all logo `<img>`s with a self-contained `Logo` component (`components/layout/logo.tsx`) — gold plane mark + Fraunces "TravelXM" wordmark, color-inheriting for dark/light surfaces. Removed the dead `LOGO_URL` constant. Also replaced the placeholder favicon with a branded teal/gold SVG.

### Hydration mismatch from locale-dependent number formatting
- **Bug**: `value.toLocaleString()` renders `96,400` on the server but `96.400` on clients with non-US locales → React hydration errors and wrong-looking numbers.
- **Fix**: pinned every call to `.toLocaleString("en-US")`.

### Timezone-dependent dates (day-shift + hydration risk)
- **Bug**: `format(new Date("2026-09-04"), …)` renders the date in the runtime's local timezone; date-only ISO strings parse as UTC midnight, so negative-UTC viewers see the previous day, and server (UTC on Vercel) vs client timezones differ → hydration mismatches on times.
- **Fix**: added `lib/format.ts` `formatUtc()` (shifts by the timezone offset before formatting) and replaced all `format(new Date(...))`, `toLocaleString`-on-Date and `toLocaleDateString` call sites with it.

### `useSearchParams` build error on /bookings/new
- **Bug class**: Next.js fails `next build` if `useSearchParams()` isn't wrapped in a `<Suspense>` boundary.
- **Fix**: the form component reading `?packageId=` is wrapped in `<Suspense>` inside the page export (see `app/(portal)/bookings/new/page.tsx`). Follow the same pattern for future pages that read query params.
