import { format } from "date-fns";

/**
 * Format an ISO date/timestamp deterministically in UTC.
 *
 * Plain `format(new Date(iso), …)` renders in the runtime's local timezone,
 * which shifts date-only strings a day backwards in negative-UTC offsets and
 * makes the server-rendered HTML differ from the client render (hydration
 * mismatch). Shifting by the timezone offset first makes the output identical
 * everywhere.
 */
export function formatUtc(iso: string, pattern: string): string {
  const d = new Date(iso);
  const shifted = new Date(d.getTime() + d.getTimezoneOffset() * 60_000);
  return format(shifted, pattern);
}
