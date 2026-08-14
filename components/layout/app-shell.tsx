import type { ReactNode } from "react";
import { MobileTabBar } from "./mobile-tab-bar";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

/**
 * Portal chrome: desktop sidebar + topbar, mobile app-style header + bottom
 * tab bar. Page content scrolls in between.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#FAFAF7]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1">
          <div className="p-4 pb-24 md:p-8 md:pb-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}
