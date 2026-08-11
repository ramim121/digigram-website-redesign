import type { Bi } from "@/lib/i18n";
import { s3Url } from "./config";
import { num, nullIfBlank, type ApiBlog, type ApiPartnership, type ApiTestimonial } from "./types";

/**
 * Mappers for the CMS-managed content the admin panel owns: partner logos,
 * investor testimonials and blog posts.
 *
 * Kept apart from `map.ts` (projects) because the shapes share nothing but the
 * bilingual helper, and because these three are the surfaces the client edits
 * day to day — a change here should not risk the project detail page.
 *
 * S3 PREFIXES
 * Each admin uploader writes to its own key prefix, transcribed from the
 * handlers rather than guessed:
 *   partnerships/            partnerships/create.ts
 *   investor-testimonials/   investor-testimonials/create.ts
 *   blog-featured-images/    blogs/create.ts
 * All three are public objects on the same bucket the project images use.
 */

/** English is the fallback when a Bangla column is null — a partly translated row still renders. */
function bi(en: string | null | undefined, bn: string | null | undefined): Bi {
    const english = nullIfBlank(en) ?? "";
    return { en: english, bn: nullIfBlank(bn) ?? english };
}

function slugify(value: string): string {
    return (
        value
            .toLowerCase()
            .normalize("NFKD")
            // Keep Bangla letters: a heading written only in Bangla would otherwise
            // slugify to the empty string and collide with every other such post.
            .replace(/[^\wঀ-৿\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-") || "post"
    );
}

/* ---------------------------------------------------------- partnerships -- */

export type PartnerLogo = {
    id: string;
    name: Bi;
    logo: string | null;
    priority: number;
};

export function mapPartnership(row: ApiPartnership): PartnerLogo {
    return {
        id: String(row.idPartnerships),
        name: bi(row.name, row.nameBn),
        logo: s3Url("partnerships", row.image),
        priority: num(row.priority, 999),
    };
}

/* ----------------------------------------------------------- testimonials -- */

export type InvestorVoice = {
    id: string;
    name: Bi;
    quote: Bi;
    photo: string | null;
    /** 0–5. Null when the row carries no usable rating, so the UI can omit stars. */
    rating: number | null;
    priority: number;
};

export function mapTestimonial(row: ApiTestimonial): InvestorVoice {
    // Arrives as "4.00". Clamped because nothing in the admin form enforces 0–5.
    const parsed = row.rating == null ? null : num(row.rating, 0);
    const rating = parsed === null ? null : Math.max(0, Math.min(5, parsed));

    return {
        id: String(row.idInvestorTestimonials),
        name: bi(row.name, row.nameBn),
        quote: bi(row.testimonial, row.testimonialBn),
        photo: s3Url("investor-testimonials", row.image),
        rating,
        priority: num(row.priority, 999),
    };
}

/* ------------------------------------------------------------------ blog -- */

export type Article = {
    slug: string;
    title: Bi;
    excerpt: Bi;
    bodyHtml: Bi;
    date: string | null;
    /** Null for API posts — `writtenBy` is an admin user id with no public lookup. */
    author: Bi | null;
    category: Bi | null;
    image: string | null;
    readingMinutes: number;
    /** `seed` posts are the drafted editorial set in `content/blog.ts`. */
    source: "live" | "seed";
};

/** Rough text extraction for excerpts and reading time. The body is admin-authored HTML. */
function textFromHtml(html: string): string {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&#39;|&rsquo;/g, "'")
        .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
}

function excerptFrom(html: string, limit = 190): string {
    const text = textFromHtml(html);
    if (text.length <= limit) return text;
    const cut = text.slice(0, limit);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * Reading time.
 *
 * Bangla is counted at a slower rate than English: 200 wpm is a reasonable
 * English figure, and Bangla script reads slower for most people, so the same
 * word count would understate it. This is an estimate either way and is
 * labelled as one in the UI.
 */
function readingMinutes(html: string, locale: "en" | "bn"): number {
    const words = textFromHtml(html).split(/\s+/).filter(Boolean).length;
    const perMinute = locale === "bn" ? 140 : 200;
    return Math.max(1, Math.round(words / perMinute));
}

function isoDate(value: string | null | undefined): string | null {
    const raw = nullIfBlank(value);
    if (!raw) return null;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

export function mapBlog(row: ApiBlog): Article {
    const bodyEn = row.description ?? "";
    const bodyBn = nullIfBlank(row.descriptionBn) ?? bodyEn;
    const headingEn = row.heading ?? "";

    return {
        // The id keeps two posts sharing a heading from sharing a URL.
        slug: `${slugify(headingEn || "post")}-${row.idBlogs}`,
        title: bi(row.heading, row.headingBn),
        excerpt: { en: excerptFrom(bodyEn), bn: excerptFrom(bodyBn) },
        bodyHtml: { en: bodyEn, bn: bodyBn },
        date: isoDate(row.writtenDate),
        // `writtenBy` is a numeric admin user id and there is no public endpoint
        // to resolve it to a name. Inventing a byline is worse than omitting one.
        author: null,
        category: null,
        image: s3Url("blog-featured-images", row.featuredImage),
        readingMinutes: Math.max(readingMinutes(bodyEn, "en"), readingMinutes(bodyBn, "bn")),
        source: "live",
    };
}

/** Numeric id back out of a blog slug produced above. */
export function blogIdFromSlug(slug: string): number | null {
    const match = /-(\d+)$/.exec(slug);
    return match ? Number(match[1]) : null;
}
