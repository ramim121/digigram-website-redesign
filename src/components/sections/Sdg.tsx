import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Bi, Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

/**
 * Sustainable Development Goal tiles.
 *
 * OFFICIAL ARTWORK, IF YOU PROVIDE IT
 * The UN's SDG icons are official marks. They are not in this repository and
 * they are not something to redraw or generate — an approximated UN logo is
 * worse than no logo. So each tile looks for the real file first:
 *
 *     public/assets/sdg/E-WEB-Goal-01.png
 *     public/assets/sdg/E-WEB-Goal-02.png   … through 17
 *
 * Download the set from un.org/sustainabledevelopment/news/communications-material/
 * and drop it in that folder — the tiles switch to the official artwork with no
 * code change. Until then they render as colour tiles using the official goal
 * colours and numbering, which matches the structure of the real icons without
 * pretending to be them.
 *
 * The existence check runs on the server at render time. It is a handful of
 * `statSync` calls against the public folder, memoised below, so it costs
 * nothing per request.
 */

export type GoalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

/** Official SDG palette and titles. */
const GOALS: Record<GoalNumber, { color: string; title: Bi }> = {
    1: { color: "#E5243B", title: { en: "No poverty", bn: "দারিদ্র্যমুক্তি" } },
    2: { color: "#DDA63A", title: { en: "Zero hunger", bn: "ক্ষুধামুক্তি" } },
    3: { color: "#4C9F38", title: { en: "Good health and well-being", bn: "সুস্বাস্থ্য ও কল্যাণ" } },
    4: { color: "#C5192D", title: { en: "Quality education", bn: "মানসম্মত শিক্ষা" } },
    5: { color: "#FF3A21", title: { en: "Gender equality", bn: "লিঙ্গ সমতা" } },
    6: { color: "#26BDE2", title: { en: "Clean water and sanitation", bn: "বিশুদ্ধ পানি ও স্যানিটেশন" } },
    7: { color: "#FCC30B", title: { en: "Affordable and clean energy", bn: "সাশ্রয়ী ও পরিচ্ছন্ন জ্বালানি" } },
    8: { color: "#A21942", title: { en: "Decent work and economic growth", bn: "উপযুক্ত কাজ ও প্রবৃদ্ধি" } },
    9: { color: "#FD6925", title: { en: "Industry, innovation and infrastructure", bn: "শিল্প, উদ্ভাবন ও অবকাঠামো" } },
    10: { color: "#DD1367", title: { en: "Reduced inequalities", bn: "বৈষম্য হ্রাস" } },
    11: { color: "#FD9D24", title: { en: "Sustainable cities and communities", bn: "টেকসই শহর ও জনগোষ্ঠী" } },
    12: { color: "#BF8B2E", title: { en: "Responsible consumption and production", bn: "দায়িত্বশীল ভোগ ও উৎপাদন" } },
    13: { color: "#3F7E44", title: { en: "Climate action", bn: "জলবায়ু পদক্ষেপ" } },
    14: { color: "#0A97D9", title: { en: "Life below water", bn: "জলজ জীবন" } },
    15: { color: "#56C02B", title: { en: "Life on land", bn: "স্থলজ জীবন" } },
    16: { color: "#00689D", title: { en: "Peace, justice and strong institutions", bn: "শান্তি, ন্যায় ও শক্তিশালী প্রতিষ্ঠান" } },
    17: { color: "#19486A", title: { en: "Partnerships for the goals", bn: "লক্ষ্যের জন্য অংশীদারিত্ব" } },
};

const ICON_DIR = path.join(process.cwd(), "public", "assets", "sdg");

/** Memoised so repeated tiles do not re-stat the same file. */
const iconCache = new Map<GoalNumber, string | null>();

function officialIcon(goal: GoalNumber): string | null {
    if (iconCache.has(goal)) return iconCache.get(goal) ?? null;

    const padded = String(goal).padStart(2, "0");
    // The UN ships several naming conventions depending on the download; accept
    // the common ones rather than forcing a rename.
    const candidates = [
        `E-WEB-Goal-${padded}.png`,
        `E_WEB_${padded}.png`,
        `sdg-${padded}.png`,
        `${padded}.png`,
    ];

    const found = candidates.find((name) => {
        try {
            return fs.statSync(path.join(ICON_DIR, name)).isFile();
        } catch {
            return false;
        }
    });

    const result = found ? `/assets/sdg/${found}` : null;
    iconCache.set(goal, result);
    return result;
}

export function SdgTile({
    goal,
    locale,
    size = 104,
}: {
    goal: GoalNumber;
    locale: Locale;
    size?: number;
}) {
    const { color, title } = GOALS[goal];
    const label = `SDG ${goal}: ${t(title, locale)}`;
    const icon = officialIcon(goal);

    if (icon) {
        return (
            <Image
                src={icon}
                alt={label}
                title={label}
                width={size}
                height={size}
                className="h-auto w-full max-w-[var(--sdg-size)] rounded-sm"
                style={{ ["--sdg-size" as string]: `${size}px` }}
            />
        );
    }

    // Placeholder: official colour, official number, official short title —
    // laid out like the real tile, but plainly not a reproduction of the mark.
    return (
        <span
            title={label}
            aria-label={label}
            role="img"
            className="flex flex-col justify-between rounded-sm p-2 text-white"
            style={{ backgroundColor: color, width: size, height: size }}
        >
            <span className="font-display text-2xl leading-none font-extrabold">{goal}</span>
            <span className="font-display text-[9px] leading-tight font-bold tracking-tight uppercase">
                {t(title, locale)}
            </span>
        </span>
    );
}

/**
 * A composite image covering several goals at once, if one was supplied.
 *
 * The official artwork often arrives already paired — the existing DigiGram
 * site uses images holding two goals side by side, and those are the files in
 * `public/assets/sdg`. Slicing them apart would degrade official artwork, so a
 * matching pair is used whole and only falls back to individual tiles when no
 * composite exists.
 *
 * The filename states its goals in order: `goals-11-10.png` is goal 11 then
 * goal 10, which is how that pair appears on the current site.
 */
const compositeCache = new Map<string, string | null>();

function compositeFor(goals: GoalNumber[]): string | null {
    const name = `goals-${goals.join("-")}`;
    if (compositeCache.has(name)) return compositeCache.get(name) ?? null;

    const found = [".png", ".webp", ".jpg", ".svg"]
        .map((extension) => `${name}${extension}`)
        .find((file) => {
            try {
                return fs.statSync(path.join(ICON_DIR, file)).isFile();
            } catch {
                return false;
            }
        });

    const result = found ? `/assets/sdg/${found}` : null;
    compositeCache.set(name, result);
    return result;
}

/** A pair (or more) of goal tiles, as the current site presents them. */
export function SdgTiles({
    goals,
    locale,
    size = 104,
}: {
    goals: GoalNumber[];
    locale: Locale;
    size?: number;
}) {
    const composite = compositeFor(goals);

    if (composite) {
        // One image, two goals. The alt text still names both, because the
        // numbers in the artwork are not readable to a screen reader.
        const label = goals.map((goal) => `SDG ${goal}: ${t(GOALS[goal].title, locale)}`).join(", ");
        return (
            <Image
                src={composite}
                alt={label}
                title={label}
                width={size * goals.length}
                height={size}
                className="h-auto w-auto"
                style={{ maxHeight: size }}
            />
        );
    }

    return (
        <div className="flex gap-0.5">
            {goals.map((goal) => (
                <SdgTile key={goal} goal={goal} locale={locale} size={size} />
            ))}
        </div>
    );
}

/** True when the official artwork is in place — used to show a one-time hint. */
export function hasOfficialIcons(): boolean {
    return officialIcon(1) !== null;
}
