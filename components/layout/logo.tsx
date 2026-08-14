import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * TravelXM brand logo. The original portal hotlinked the logo image from
 * travelxm.com, which blocks cross-origin requests — so the brand is drawn
 * here instead: gold plane mark + Fraunces wordmark. Text color inherits
 * from `className` (white on the teal sidebar, teal on light surfaces).
 */
export function Logo({
  variant = "full",
  className,
}: {
  variant?: "full" | "mark";
  className?: string;
}) {
  const mark = (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#D4A24C]">
      <Plane className="h-4.5 w-4.5 text-white" style={{ width: 18, height: 18 }} />
    </span>
  );

  if (variant === "mark") {
    return <span className={cn("inline-flex", className)}>{mark}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark}
      <span className="font-serif text-xl font-medium tracking-tight leading-none">
        Travel<span className="text-[#D4A24C]">XM</span>
      </span>
    </span>
  );
}
