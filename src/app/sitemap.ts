import type { MetadataRoute } from "next";
import { allProjectSlugs } from "@/lib/projects.server";
import { posts } from "@/content/blog";
import { localePath, locales } from "@/lib/i18n";
import { routes, site } from "@/lib/site";

/**
 * Sitemap.
 *
 * Every URL is emitted once per language with `alternates.languages`, so a
 * crawler discovers the Bangla mirror of a page from the English entry and
 * never treats the two as duplicates. Auth and account routes are excluded —
 * they are `noindex` and have nothing to rank.
 */

type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

const staticEntries: Entry[] = [
  { path: routes.home, priority: 1, changeFrequency: "weekly" },
  { path: routes.projects, priority: 0.95, changeFrequency: "daily" },
  { path: routes.products, priority: 0.8, changeFrequency: "monthly" },
  { path: routes.shathi, priority: 0.9, changeFrequency: "monthly" },
  { path: routes.shathiSheba, priority: 0.9, changeFrequency: "monthly" },
  { path: routes.shadhinFeed, priority: 0.7, changeFrequency: "monthly" },
  { path: routes.about, priority: 0.8, changeFrequency: "monthly" },
  { path: routes.careers, priority: 0.5, changeFrequency: "monthly" },
  { path: routes.impact, priority: 0.85, changeFrequency: "monthly" },
  { path: routes.blog, priority: 0.7, changeFrequency: "weekly" },
  { path: routes.contact, priority: 0.6, changeFrequency: "yearly" },
  { path: routes.faq, priority: 0.6, changeFrequency: "monthly" },
  { path: routes.terms, priority: 0.3, changeFrequency: "yearly" },
  { path: routes.privacy, priority: 0.3, changeFrequency: "yearly" },
  { path: routes.deleteAccount, priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  // Live slugs, so the sitemap lists the projects that actually exist.
  const projectSlugs = await allProjectSlugs();

  const all: Entry[] = [
    ...staticEntries,
    ...projectSlugs.map((slug) => ({
      path: routes.project(slug),
      priority: 0.9,
      changeFrequency: "weekly" as const,
    })),
    ...posts.map((post) => ({
      path: routes.post(post.slug),
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
  ];

  return all.flatMap((entry) =>
    locales.map((locale) => ({
      url: new URL(localePath(locale, entry.path), site.url).toString(),
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: {
          "en-BD": new URL(localePath("en", entry.path), site.url).toString(),
          "bn-BD": new URL(localePath("bn", entry.path), site.url).toString(),
        },
      },
    })),
  );
}
