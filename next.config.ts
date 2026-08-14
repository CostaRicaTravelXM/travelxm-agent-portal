import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow embedding the portal in iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Don't leak full URLs to external origins
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The portal uses none of these sensors
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
