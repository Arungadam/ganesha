import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ganesha",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
