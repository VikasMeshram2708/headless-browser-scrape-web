import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "m.media-amazon.com",
        protocol: "https",
        pathname: "/**",
        port: "",
        search: "",
      },
    ],
  },
};

export default nextConfig;
