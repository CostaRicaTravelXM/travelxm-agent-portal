"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MoreHorizontal, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  isNavItemActive,
  MOBILE_MORE_ITEMS,
  MOBILE_PRIMARY_ITEMS,
} from "./nav-config";

/**
 * App-style bottom tab bar, mobile only. Three primary destinations, a
 * central New Booking action, and a "More" sheet for the remaining pages.
 * All targets are at least 44px tall for comfortable thumb use.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MOBILE_MORE_ITEMS.some((item) => isNavItemActive(pathname, item.href));

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E8E2D5] pb-safe"
    >
      <div className="grid grid-cols-5 h-16">
        {MOBILE_PRIMARY_ITEMS.map(({ href, icon: Icon, label }, i) => {
          const active = isNavItemActive(pathname, href);
          const tab = (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${
                active ? "text-[#0A4D5C]" : "text-[#6B6B6B]"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              <span className={`text-[10px] leading-none ${active ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          );
          // Center slot (index 2) is the New Booking action; primary item 3 shifts right
          if (i === 2) {
            return (
              <div key="center-group" className="contents">
                <Link
                  href="/bookings/new"
                  aria-label="New booking"
                  className="flex items-center justify-center"
                >
                  <span className="flex items-center justify-center h-12 w-12 -mt-5 rounded-2xl bg-[#E87A5D] text-white shadow-lg shadow-[#E87A5D]/30 border-4 border-[#FAFAF7]">
                    <Plus className="h-5 w-5" />
                  </span>
                </Link>
                {tab}
              </div>
            );
          }
          return tab;
        })}

        {/* More sheet */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="More pages"
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${
                moreActive ? "text-[#0A4D5C]" : "text-[#6B6B6B]"
              }`}
            >
              <MoreHorizontal className="h-5 w-5" strokeWidth={moreActive ? 2.4 : 2} />
              <span className={`text-[10px] leading-none ${moreActive ? "font-semibold" : "font-medium"}`}>
                More
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl border-[#E8E2D5] pb-safe">
            <SheetHeader className="text-left pb-2">
              <SheetTitle className="font-serif text-xl text-[#0A4D5C] font-light">
                More
              </SheetTitle>
            </SheetHeader>

            {/* Agent chip */}
            <div className="flex items-center gap-3 p-3 mb-2 rounded-2xl bg-[#FAFAF7] border border-[#E8E2D5]">
              <Avatar className="h-10 w-10 border border-[#D4A24C]/40">
                <AvatarFallback className="bg-[#D4A24C]/20 text-[#0A4D5C] text-sm font-semibold">
                  AG
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">Agent Jane</p>
                <p className="text-xs text-[#D4A24C]">Gold Tier</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {MOBILE_MORE_ITEMS.map(({ href, icon: Icon, label }) => {
                const active = isNavItemActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors min-h-[56px] ${
                      active
                        ? "bg-[#0A4D5C] text-white border-[#0A4D5C]"
                        : "bg-white text-[#1A1A1A] border-[#E8E2D5] hover:border-[#0A4D5C]"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/"
              onClick={() => setMoreOpen(false)}
              className="flex items-center justify-center gap-2 mt-3 p-4 rounded-2xl border border-[#E8E2D5] text-[#E87A5D] text-sm font-medium min-h-[44px] hover:bg-[#E87A5D]/5 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Log out
            </Link>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
