import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Map,
  Palette,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/bookings", icon: CalendarCheck, label: "Bookings" },
  { href: "/packages", icon: Map, label: "Packages" },
  { href: "/customers", icon: Users, label: "Leads & CRM" },
  { href: "/commissions", icon: TrendingUp, label: "Commissions" },
  { href: "/payments", icon: CreditCard, label: "Payments" },
  { href: "/support", icon: LifeBuoy, label: "Support" },
  { href: "/crm", icon: Zap, label: "Zoho CRM" },
  { href: "/canva", icon: Palette, label: "Canva Images" },
];

/** Primary items shown in the mobile bottom tab bar; the rest live in the "More" sheet. */
export const MOBILE_PRIMARY_ITEMS = NAV_ITEMS.slice(0, 3);
export const MOBILE_MORE_ITEMS = NAV_ITEMS.slice(3);

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}
