import type { NextConfig } from "next";

/**
 * NEXT_STATIC_EXPORT=1 produces the static demo build deployed to GitHub
 * Pages (CI strips src/app/api first — Pages can't run server routes).
 * The default build keeps full server functionality for Vercel/Node.
 */
const isExport = process.env.NEXT_STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Custom-Signature";

const nextConfig: NextConfig = {
  ...(isExport
    ? { output: "export" as const, basePath, trailingSlash: true }
    : {}),
  images: {
    unoptimized: isExport,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
