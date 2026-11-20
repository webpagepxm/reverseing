import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  output: "export",
  basePath: "/reverseing",
  trailingSlash: true,
  images: { unoptimized: true },
};
export default config;
