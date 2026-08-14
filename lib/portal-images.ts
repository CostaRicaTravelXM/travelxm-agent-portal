/**
 * Portal image slots. In the full product these can be overridden with Canva
 * designs via the API; in this static frontend the defaults always apply.
 */

export interface ImageSlot {
  key: string;
  label: string;
  defaultUrl: string;
  section: string;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  { key: "dashboard-hero",  label: "Dashboard Hero Banner",         defaultUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80", section: "Dashboard" },
  { key: "login-slide-1",   label: "Login Slide 1 – Santorini",     defaultUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=80", section: "Login" },
  { key: "login-slide-2",   label: "Login Slide 2 – Maldives",      defaultUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2000&q=80", section: "Login" },
  { key: "login-slide-3",   label: "Login Slide 3 – Alps",          defaultUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2000&q=80", section: "Login" },
  { key: "login-slide-4",   label: "Login Slide 4 – Kyoto",         defaultUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=80", section: "Login" },
  { key: "login-slide-5",   label: "Login Slide 5 – Dubai",         defaultUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80", section: "Login" },
  { key: "dashboard-pkg-1", label: "Featured Package 1 – Bali",     defaultUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80", section: "Dashboard" },
  { key: "dashboard-pkg-2", label: "Featured Package 2 – Maldives", defaultUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80", section: "Dashboard" },
  { key: "dashboard-pkg-3", label: "Featured Package 3 – Swiss",    defaultUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80", section: "Dashboard" },
  { key: "dashboard-pkg-4", label: "Featured Package 4 – Kyoto",    defaultUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80", section: "Dashboard" },
  { key: "dashboard-pkg-5", label: "Featured Package 5 – Dubai",    defaultUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80", section: "Dashboard" },
];

export function getImageUrl(slotKey: string, fallback: string): string {
  const slot = IMAGE_SLOTS.find((s) => s.key === slotKey);
  return slot?.defaultUrl ?? fallback;
}
