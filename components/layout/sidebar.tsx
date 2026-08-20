"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "./logo";
import { isNavItemActive, NAV_ITEMS } from "./nav-config";

/**
 * Desktop-only collapsible sidebar (hidden below md).
 *
 * Sticky and full-height so navigation stays reachable on long pages. The
 * aside is deliberately not `overflow-hidden` — that clipped the collapse
 * toggle, which overhangs the right edge. Each animating label clips itself.
 */
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative z-20 hidden md:flex flex-col shrink-0 self-start sticky top-0 h-screen bg-[#0A4D5C] text-white"
    >
      {/* Logo area */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 shrink-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <Logo className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="logo-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Logo variant="mark" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-2 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isNavItemActive(pathname, href);
          return (
            <Link key={href} href={href} className="block rounded-xl">
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 cursor-pointer relative ${
                  collapsed ? "justify-center" : ""
                } ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#D4A24C] rounded-full"
                  />
                )}
                <Icon className="shrink-0" style={{ width: 18, height: 18 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4A24C] shrink-0" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Agent profile chip */}
      <div className="border-t border-white/10 p-3 shrink-0">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${collapsed ? "justify-center" : ""}`}
        >
          <Avatar className="h-8 w-8 shrink-0 border border-[#D4A24C]/40">
            <AvatarFallback className="bg-[#D4A24C]/20 text-[#D4A24C] text-xs font-semibold">
              AG
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-medium text-white truncate">Agent Jane</p>
                <p className="text-xs text-[#D4A24C] truncate">Gold Tier</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Link href="/" className="block rounded-xl">
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm cursor-pointer mt-1 ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut style={{ width: 16, height: 16 }} className="shrink-0" />
            {!collapsed && <span className="truncate">Log out</span>}
          </div>
        </Link>
      </div>

      {/* Collapse toggle — overhangs the right edge, so the aside must not clip. */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className="absolute -right-3.5 top-[72px] z-30 grid place-content-center h-7 w-7 bg-white border border-[#E8E2D5] rounded-full shadow-md text-[#0A4D5C] hover:bg-[#F4EFE6] hover:border-[#D4A24C] transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </motion.aside>
  );
}
