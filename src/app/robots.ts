import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing here should rank: these pages are per-user and noindexed.
        disallow: ["/login", "/bn/login", "/register", "/bn/register", "/account", "/bn/account"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
