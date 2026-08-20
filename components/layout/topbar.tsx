"use client"

import Link from "next/link";
import { Bell, ChevronDown, LogOut, Plus, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Logo } from "./logo";

/**
 * Top header. On desktop: search, notifications, New Booking CTA, agent menu.
 * On mobile it compacts to an app-style header: logo left, actions right.
 *
 * Sticky at every width so navigation and search stay reachable on long pages.
 * The safe-area inset is padding on the header, not on the fixed-height row,
 * so a notch cannot squash the contents.
 */
export function Topbar() {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8E2D5] bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 pt-safe">
      <div className="app-container flex h-14 md:h-16 items-center gap-3 md:gap-4">
        {/* Mobile logo */}
        <Link href="/dashboard" className="md:hidden shrink-0 -ml-1 flex items-center min-h-[44px] px-1" aria-label="TravelXM dashboard">
          <Logo className="text-[#0A4D5C]" />
        </Link>

        {/* Search (desktop) */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6B6B]" />
          <Input
            placeholder="Search bookings, customers, packages…"
            aria-label="Search bookings, customers, and packages"
            className="pl-9 pr-14 h-9 md:h-9 bg-[#FAFAF7] border-[#E8E2D5] rounded-xl text-sm focus:border-[#D4A24C] focus:ring-[#D4A24C]/20"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-[#6B6B6B] bg-[#F4EFE6] border border-[#E8E2D5] rounded">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-1 md:gap-3 ml-auto">
          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative grid place-content-center h-11 w-11 md:h-9 md:w-9 rounded-xl hover:bg-[#F4EFE6] transition-colors text-[#6B6B6B] hover:text-[#0A4D5C]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 md:top-1 md:right-1 w-2 h-2 bg-[#E87A5D] rounded-full border border-white" />
          </button>

          {/* New Booking CTA (desktop — mobile has it in the tab bar) */}
          <Link href="/bookings/new" className="hidden md:block">
            <Button
              size="sm"
              className="bg-[#E87A5D] hover:bg-[#E87A5D]/90 text-white rounded-xl font-medium gap-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Booking
            </Button>
          </Link>

          {/* Agent menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Account menu"
                className="flex items-center gap-2 h-11 md:h-9 px-1.5 rounded-xl hover:bg-[#F4EFE6] transition-colors"
              >
                <Avatar className="h-8 w-8 border border-[#E8E2D5]">
                  <AvatarFallback className="bg-[#0A4D5C]/10 text-[#0A4D5C] text-xs font-semibold">
                    AG
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-[#6B6B6B] hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#E8E2D5]">
              <div className="px-3 py-2 border-b border-[#E8E2D5]">
                <p className="text-sm font-medium">Agent Jane</p>
                <p className="text-xs text-[#6B6B6B]">Gold Tier Member</p>
              </div>
              <DropdownMenuItem className="gap-2 text-sm">
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="gap-2 text-sm text-[#E87A5D]">
                <Link href="/">
                  <LogOut className="h-4 w-4" /> Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
