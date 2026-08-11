import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Where the build output goes.
   *
   * `next build` and `next dev` share `.next` by default, and a build run while
   * a dev server is up replaces the dev chunks underneath it. The dev server
   * then dies with "Cannot find module './vendor-chunks/<something>.js'", which
   * looks like a dependency problem and is not — it is a stale process holding
   * references to files that were just deleted.
   *
   * `npm run build:verify` sets NEXT_DIST_DIR so a build-for-checking writes
   * somewhere else and leaves a running dev server alone. Deploys use plain
   * `npm run build`, which keeps `.next`.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "api.digigramventures.com" },
      { protocol: "https", hostname: "api-test.digigramventures.com" },
      { protocol: "https", hostname: "digigramventures.com" },
      /*
       * Project, partner, blog and testimonial images.
       *
       * `next/image` refuses any host not listed here, so this must be kept in
       * step with `SHATHI_S3_URL`. Pointing the site at the staging bucket
       * without adding it here is exactly what broke every page with a remote
       * image: the failure is a hard runtime error, not a missing picture.
       */
      { protocol: "https", hostname: "saathi-files-new.s3.ap-southeast-1.amazonaws.com" },
      { protocol: "https", hostname: "saathi-production-2025.s3.ap-southeast-1.amazonaws.com" },
      { protocol: "https", hostname: "saathi-staging-2026.s3.ap-southeast-1.amazonaws.com" },
      { protocol: "https", hostname: "saathi-files-production-new.s3.ap-southeast-1.amazonaws.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["clsx"],
  },
  // Type safety is enforced by `npm run typecheck`; ESLint config is managed
  // outside this repo, so builds must not block on a missing flat config.
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
