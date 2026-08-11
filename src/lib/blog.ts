import type { Article } from "@/lib/api/content";
import type { Locale } from "@/lib/i18n";

/**
 * Client-safe blog helpers.
 *
 * Split from `content.server.ts` for the same reason `projects.ts` is split
 * from `projects.server.ts`: anything a client component might import must not
 * drag in the `server-only` API client.
 */

/**
 * Shown when a CMS post has no featured image.
 *
 * A neutral brand asset rather than a stock field photograph: the design brief
 * forbids putting an unrelated identifiable farmer next to an arbitrary post.
 */
export const BLOG_FALLBACK_IMAGE = "/assets/brand/village-motif.png";

/** Label for a post with no category — CMS posts have no category column. */
export function categoryLabel(article: Article, locale: Locale): string {
    if (article.category) return locale === "en" ? article.category.en : article.category.bn;
    return locale === "en" ? "News" : "খবর";
}

export function readingLabel(article: Article, locale: Locale): string {
    return locale === "en"
        ? `${article.readingMinutes} min read`
        : `${article.readingMinutes} মিনিট পড়া`;
}
