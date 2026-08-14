# Fixed Issues

Problems encountered and how they were resolved (bug → root cause → fix), so the same thing never needs re-debugging.

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
