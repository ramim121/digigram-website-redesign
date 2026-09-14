import type { Bi } from "@/lib/i18n";
import type { PartnerLogo } from "@/lib/api/content";

/**
 * Locally held partner marks, and the rule for merging them with the CMS band.
 *
 * WHY THIS FILE EXISTS
 * The partner strip is CMS-driven — the admin's Partnerships panel is the
 * source of truth and should stay that way. But two things are true that the
 * CMS alone does not cover:
 *
 *   1. **Coverage.** The Partnerships table holds seven rows. Several partners
 *      who belong on the band — BRAC Bank as the lending partner, the two
 *      cooperatives, and the Shathi Sheba offtake buyers — have never been
 *      entered there. They exist as real marks in `ShathiSheba/Resources` and
 *      in the Sheba platform's own `business_partners` table.
 *
 *   2. **Fidelity.** The CMS uploads are small, lossy re-encodes. The band now
 *      renders logos in their own colours at up to 3rem tall, which is exactly
 *      the size at which a 90px JPEG artefacts visibly.
 *
 * So this is an *overlay*, not a replacement. `mergePartnerLogos` keeps every
 * CMS row and the admin's ordering, swaps in a local file wherever one matches
 * by name, and appends the partners the CMS does not know about yet. Enter a
 * partner in the admin panel later and the row simply starts winning on
 * ordering; delete an entry from here and its CMS version takes over. Neither
 * change requires touching the component.
 */

export type LocalPartnerLogo = {
    /** Canonical display name, used when this entry is appended rather than merged. */
    name: Bi;
    /** Path under `public/`. */
    logo: string;
    /**
     * Names this entry should attach itself to when the CMS holds the same
     * partner under a different spelling. Compared after normalisation, so
     * "OCB" and "Orange Corners Bangladesh" can both point at one file.
     */
    aliases?: string[];
    /**
     * Sort position among *appended* entries only. CMS rows keep the priority
     * the admin gave them and always sort first.
     */
    priority?: number;
};

/**
 * Partners the CMS does not hold, plus higher-fidelity files for ones it does.
 *
 * Sources: `ShathiSheba/Resources/*-logo.*` for the lender and the two
 * cooperatives; the Sheba platform's `business_partners` rows (Bengal Meat,
 * Khan Agro Farm, Angus Agro) for the offtake buyers, whose marks are public on
 * the `shathi-sheba` bucket and are copied in here so the band does not depend
 * on a second backend being reachable just to draw a logo.
 */
export const localPartnerLogos: LocalPartnerLogo[] = [
    {
        name: { en: "BRAC Bank", bn: "ব্র্যাক ব্যাংক" },
        logo: "/assets/partners/brac-bank.svg",
        aliases: ["brac bank", "brac bank plc", "brac bank limited"],
        priority: 10,
    },
    {
        // Already in the CMS as "Amra Shadhin Women Cooperative"; the alias
        // means this file replaces that row's logo rather than duplicating it.
        name: {
            en: "Amra Shadhin Women's Cooperative",
            bn: "আমরা স্বাধীন মহিলা সমবায় সমিতি",
        },
        logo: "/assets/partners/amra-shadhin.jpg",
        aliases: [
            "amra shadhin women cooperative",
            "amra shadhin womens cooperative",
            "amra shadhin",
        ],
        priority: 11,
    },
    {
        name: {
            en: "Walia Shimul Mohila Samabaya Samity",
            bn: "ওয়ালিয়া শিমুল মহিলা সমবায় সমিতি",
        },
        logo: "/assets/partners/walia-shimul.jpg",
        aliases: ["walia shimul", "walia shimul mohila samabaya samity"],
        priority: 12,
    },
    {
        name: { en: "Bengal Meat", bn: "বেঙ্গল মিট" },
        logo: "/assets/partners/bengal-meat.png",
        aliases: ["bengal meat"],
        priority: 13,
    },
    {
        name: { en: "Angus Agro", bn: "অ্যাঙ্গাস এগ্রো" },
        logo: "/assets/partners/angus-agro.jpg",
        aliases: ["angus agro"],
        priority: 14,
    },
    {
        name: { en: "Khan Agro Farm", bn: "খান এগ্রো ফার্ম" },
        logo: "/assets/partners/khan-agro.webp",
        aliases: ["khan agro", "khan agro farm"],
        priority: 15,
    },
];

/**
 * Lowercase, strip punctuation and collapse whitespace, so "Amra Shadhin
 * Women's Cooperative", "amra shadhin women cooperative" and "AMRA SHADHIN
 * WOMEN COOPERATIVE" all compare equal.
 */
function normalise(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/** Every string a local entry answers to, including its own English name. */
function keysFor(entry: LocalPartnerLogo): string[] {
    return [normalise(entry.name.en), ...(entry.aliases ?? []).map(normalise)];
}

/**
 * CMS rows first, in the admin's order, with local files substituted where they
 * match; then the local-only partners.
 *
 * A CMS row that matches a local entry keeps its own id and priority — the
 * admin still controls where it sits — and takes only the image. That way
 * improving a logo here never silently reorders the band.
 */
export function mergePartnerLogos(cmsRows: PartnerLogo[]): PartnerLogo[] {
    const byKey = new Map<string, LocalPartnerLogo>();
    for (const entry of localPartnerLogos) {
        for (const key of keysFor(entry)) byKey.set(key, entry);
    }

    const used = new Set<LocalPartnerLogo>();

    const merged = cmsRows.map((row) => {
        const local = byKey.get(normalise(row.name.en));
        if (!local) return row;
        used.add(local);
        return { ...row, logo: local.logo };
    });

    // Highest CMS priority, so appended partners always land after the rows the
    // admin has explicitly ordered.
    const base = merged.reduce((max, row) => Math.max(max, row.priority), 0);

    const appended = localPartnerLogos
        .filter((entry) => !used.has(entry))
        .map((entry, index) => ({
            id: `local-${normalise(entry.name.en).replace(/\s/g, "-")}`,
            name: entry.name,
            logo: entry.logo,
            priority: base + (entry.priority ?? 100 + index),
        }));

    return [...merged, ...appended].sort((a, b) => a.priority - b.priority);
}
