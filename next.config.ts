import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "next.coinhubbd.com",
        pathname: "/**", // Allows all image paths (e.g., /wp-content/uploads/...)
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**", // Allows the fallback placeholder image
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // Allows all Unsplash images
      },
    ],
  },
};

export default nextConfig;
