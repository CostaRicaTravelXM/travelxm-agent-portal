import type { ReactNode } from "react";
import { MobileTabBar } from "./mobile-tab-bar";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

/**
 * Portal chrome: desktop sidebar + topbar, mobile app-style header + bottom
 * tab bar. Page content scrolls in between.
 *
 * The topbar and the page body both lay out inside `.app-container`, so the
 * search field, page title, and cards share one left edge at every width.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#FAFAF7]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 min-w-0">
          <div className="app-container py-4 pb-24 md:py-8 md:pb-12">{children}</div>
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}
