import "server-only";

import { apiGet } from "@/lib/api/client";
import {
    mapBlog,
    mapPartnership,
    mapTestimonial,
    type Article,
    type InvestorVoice,
    type PartnerLogo,
} from "@/lib/api/content";
import type { ApiBlog, ApiPartnership, ApiTestimonial } from "@/lib/api/types";
import { posts as seedPosts, type Post } from "@/content/blog";
import { partners as seedPartners } from "@/content/company";

/**
 * Server-side fetchers for admin-managed content.
 *
 * Same contract as `projects.server.ts`: nothing throws, and a failed call
 * falls back to the drafted content in `src/content/*` with `stale: true` so
 * the UI can say so rather than pass fixtures off as live.
 *
 * WHAT IS AND IS NOT LIVE
 * - **Partner logos** — live. The admin has real uploaded logos; the drafted
 *   list carried names only and said "logos pending".
 * - **Blog** — live, with the drafted posts as fallback. See the note on
 *   `fetchArticles`.
 * - **Investor testimonials** — live, and *new*: these are investors, whereas
 *   `company.testimonials` are Shathi partner voices gated behind
 *   `consentGranted`. They are different people saying different things, so one
 *   does not replace the other.
 */

/* ---------------------------------------------------------- partnerships -- */

export async function fetchPartners(): Promise<{ data: PartnerLogo[]; stale: boolean }> {
    const res = await apiGet<ApiPartnership[]>("partnerships/all-partnerships");

    if (!res.ok || !Array.isArray(res.data)) {
        // The drafted list has no logos, so it renders as the name-only band.
        return {
            data: seedPartners.map((partner, index) => ({
                id: `seed-${index}`,
                name: { en: partner.name, bn: partner.name },
                logo: null,
                priority: index,
            })),
            stale: true,
        };
    }

    return {
        data: res.data.map(mapPartnership).sort((a, b) => a.priority - b.priority),
        stale: false,
    };
}

/* ----------------------------------------------------------- testimonials -- */

/**
 * Investor testimonials. Returns an empty array rather than falling back:
 * there is no drafted investor-voice content to stand in for these, and an
 * empty list simply hides the section.
 */
export async function fetchInvestorVoices(): Promise<InvestorVoice[]> {
    const res = await apiGet<ApiTestimonial[]>("investor-testimonials/all-testimonials");
    if (!res.ok || !Array.isArray(res.data)) return [];
    return res.data.map(mapTestimonial).sort((a, b) => a.priority - b.priority);
}

/* ------------------------------------------------------------------ blog -- */

/** Adapts a drafted post to the same shape a live post maps to. */
function fromSeed(post: Post): Article {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        bodyHtml: post.body,
        date: post.date,
        author: post.author,
        category: post.category,
        image: post.image,
        readingMinutes: post.readingMinutes,
        source: "seed",
    };
}

/**
 * The blog index, newest first.
 *
 * The drafted posts are included alongside the live ones rather than being
 * dropped. The reason is concrete: the CMS holds one post today and the three
 * drafted pieces are the site's entire long-form SEO surface — switching to
 * live-only would silently delete them at launch. They are deduplicated by
 * slug, so once the client publishes a drafted piece through the admin the live
 * copy is what renders.
 *
 * To retire the drafted set, empty `src/content/blog.ts`; nothing else changes.
 */
export async function fetchArticles(): Promise<{ data: Article[]; stale: boolean }> {
    const res = await apiGet<ApiBlog[]>("blogs/list");
    const live = res.ok && Array.isArray(res.data) ? res.data.map(mapBlog) : null;

    const bySlug = new Map<string, Article>();
    for (const article of seedPosts.map(fromSeed)) bySlug.set(article.slug, article);
    // Live wins on a slug collision.
    for (const article of live ?? []) bySlug.set(article.slug, article);

    const data = [...bySlug.values()].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    return { data, stale: live === null };
}

/**
 * One post.
 *
 * Served from the list rather than a per-id endpoint: `blogs/list` already
 * returns the full `description` body, and the only per-id route is
 * `blogs/edit-info/{id}`, which is the admin form's loader. It happens to be
 * unauthenticated today, but building the public site on an admin route means a
 * future lock breaks the blog.
 */
export async function fetchArticle(slug: string): Promise<Article | null> {
    const { data } = await fetchArticles();
    return data.find((article) => article.slug === slug) ?? null;
}

export async function allArticleSlugs(): Promise<string[]> {
    const { data } = await fetchArticles();
    return data.map((article) => article.slug);
}
