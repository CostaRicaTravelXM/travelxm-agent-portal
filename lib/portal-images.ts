/**
 * Portal image slots. In the full product these can be overridden with Canva
 * designs via the API; in this static frontend the defaults always apply.
 *
 * Ambient photography is self-hosted Costa Rica work in `public/imgs/`
 * (WebP, quality 90, capped at 2400px — masters live in the gitignored
 * `assets-src/photos/`). Package imagery is deliberately NOT sourced from here:
 * packages come from the API later and carry their own `imageUrl`.
 */

export interface ImageSlot {
  key: string;
  label: string;
  defaultUrl: string;
  section: string;
}

export interface Photo {
  src: string;
  /** Describes what is actually in the frame — several source filenames did not. */
  alt: string;
  credit?: string;
}

/**
 * The self-hosted photo library. Every image is registered here whether or not
 * a surface currently uses it, so new surfaces can pull from one list.
 */
export const PHOTOS = {
  arenalVolcano: {
    src: "/imgs/arenal-volcano.webp",
    alt: "Arenal Volcano rising into low cloud above dense rainforest",
  },
  laFortunaWaterfall: {
    src: "/imgs/la-fortuna-waterfall.webp",
    alt: "Waterfall falling into a turquoise pool ringed by rainforest at La Fortuna",
  },
  rainforestValley: {
    src: "/imgs/rainforest-valley-la-fortuna.webp",
    alt: "Mist drifting over a forested valley with a distant waterfall near La Fortuna",
  },
  pacificSunsetBeach: {
    src: "/imgs/pacific-sunset-beach.webp",
    alt: "Sunset over a Pacific beach with a rock outcrop and palms",
  },
  playaSamara: {
    src: "/imgs/playa-samara.webp",
    alt: "Hand-painted wooden signpost above the sand at Playa Sámara",
  },
  scarletMacaws: {
    src: "/imgs/scarlet-macaws-corcovado.webp",
    alt: "A pair of scarlet macaws perched on a branch in Corcovado National Park",
  },
  jaguar: {
    src: "/imgs/jaguar-corcovado.webp",
    alt: "A jaguar resting in long grass in Corcovado National Park",
  },
  quetzal: {
    src: "/imgs/quetzal-monteverde.webp",
    alt: "A resplendent quetzal perched among leaves in the Monteverde cloud forest",
  },
  capuchin: {
    src: "/imgs/capuchin-tortuguero.webp",
    alt: "A white-faced capuchin monkey in the canopy at Tortuguero National Park",
  },
  toucan: {
    src: "/imgs/keel-billed-toucan.webp",
    alt: "A keel-billed toucan on a mossy branch",
  },
  sloth: {
    src: "/imgs/sloth.webp",
    alt: "A three-toed sloth resting over a branch",
  },
  seaTurtles: {
    src: "/imgs/sea-turtles.webp",
    alt: "Two sea turtles swimming over a reef among shoaling fish",
  },
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

export const IMAGE_SLOTS: ImageSlot[] = [
  { key: "dashboard-hero",  label: "Dashboard Hero Banner",             defaultUrl: PHOTOS.rainforestValley.src,  section: "Dashboard" },
  { key: "login-slide-1",   label: "Login Slide 1 – Arenal",            defaultUrl: PHOTOS.arenalVolcano.src,     section: "Login" },
  { key: "login-slide-2",   label: "Login Slide 2 – La Fortuna",        defaultUrl: PHOTOS.laFortunaWaterfall.src, section: "Login" },
  { key: "login-slide-3",   label: "Login Slide 3 – Pacific Coast",     defaultUrl: PHOTOS.pacificSunsetBeach.src, section: "Login" },
  { key: "login-slide-4",   label: "Login Slide 4 – Playa Sámara",      defaultUrl: PHOTOS.playaSamara.src,       section: "Login" },
  { key: "login-slide-5",   label: "Login Slide 5 – Corcovado",         defaultUrl: PHOTOS.scarletMacaws.src,     section: "Login" },
  { key: "not-found",       label: "404 Page Banner",                   defaultUrl: PHOTOS.toucan.src,            section: "System" },

  // Featured-package imagery still comes from the package record itself; these
  // slots stay on the demo URLs until the packages API supplies real photos.
  { key: "dashboard-pkg-1", label: "Featured Package 1", defaultUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80", section: "Dashboard" },
  { key: "dashboard-pkg-2", label: "Featured Package 2", defaultUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80", section: "Dashboard" },
  { key: "dashboard-pkg-3", label: "Featured Package 3", defaultUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80", section: "Dashboard" },
  { key: "dashboard-pkg-4", label: "Featured Package 4", defaultUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80", section: "Dashboard" },
  { key: "dashboard-pkg-5", label: "Featured Package 5", defaultUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80", section: "Dashboard" },
];

export function getImageUrl(slotKey: string, fallback: string): string {
  const slot = IMAGE_SLOTS.find((s) => s.key === slotKey);
  return slot?.defaultUrl ?? fallback;
}
