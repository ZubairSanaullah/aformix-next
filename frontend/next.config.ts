import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "@icons-pack/react-simple-icons",
      "date-fns",
      "framer-motion",
      "recharts",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "mtigyvdozzacbyzldcoe.supabase.co",
      },
    ],
  },
};

export default nextConfig;