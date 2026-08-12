"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { CheckoutPartner } from "@/components/booking/CheckoutForm";
import { formatBdt, type Locale } from "@/lib/i18n";

/**
 * Which Shathi partners the chosen units would go to.
 *
 * WHY SHOW THIS AT ALL
 * The app's checkout shows it, and it is the whole proposition made concrete:
 * a booking is not an abstract holding, it is units against named producers
 * (FR-BOOK-03). Without it the website asks for money and shows only a total.
 *
 * WHY IT IS A PREVIEW AND NOT A CHOICE
 * The server re-runs the allocation inside the booking transaction against
 * live capacity (FR-BOOK-11), so anything shown here can change between render
 * and submit. It is labelled tentative for that reason — the same wording the
 * app uses — rather than presented as a decision the investor has made.
 *
 * The distribution mirrors the app's: one unit to each partner in turn, round
 * after round. See `allocate` below.
 */

export type Allocation = { partner: CheckoutPartner; units: number };

/**
 * Spreads units across partners one at a time, round-robin.
 *
 * THIS MIRRORS THE APP, AND THE FIRST VERSION DID NOT.
 * `ProjectDetails.tsx` loops in rounds: each pass walks every assigned partner
 * in order and gives one unit to anyone with room, repeating until the units
 * run out. So three units across three partners is one each — not three to the
 * first partner.
 *
 * The earlier implementation here filled each partner to capacity before moving
 * on, so the website showed a single partner taking every unit while the app
 * showed them shared. The booking that came back from the server then looked
 * nothing like the preview.
 *
 * ONE DEPARTURE, DELIBERATE.
 * The app's loop decrements only when it places a unit, so if no partner has
 * room it spins forever. Here a pass that places nothing ends the loop and the
 * caller reports the shortfall instead.
 */
export function allocate(partners: CheckoutPartner[], units: number): Allocation[] {
    const given = new Map<number, number>();
    let left = units;

    while (left > 0) {
        let placedThisRound = 0;

        for (const partner of partners) {
            if (left <= 0) break;

            const already = given.get(partner.idProjectPartners) ?? 0;
            // `remaining` is MAX_SAFE_INTEGER for a partner with no limit, so
            // the same comparison covers both cases.
            if (already >= partner.remaining) continue;

            given.set(partner.idProjectPartners, already + 1);
            left -= 1;
            placedThisRound += 1;
        }

        // Nobody could take a unit: every partner is full. Stop rather than
        // loop forever, and let the caller surface the shortfall.
        if (placedThisRound === 0) break;
    }

    return partners
        .filter((partner) => (given.get(partner.idProjectPartners) ?? 0) > 0)
        .map((partner) => ({ partner, units: given.get(partner.idProjectPartners) as number }));
}

function Avatar({ partner }: { partner: CheckoutPartner }) {
    if (partner.image) {
        return (
            <Image
                src={partner.image}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-full object-cover"
            />
        );
    }

    const initials = (partner.name ?? "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

    return (
        <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-canvas font-display text-xs font-bold text-brand-strong"
        >
            {initials || "·"}
        </span>
    );
}

export function AllocationPreview({
    locale,
    partners,
    units,
    unitValue,
}: {
    locale: Locale;
    partners: CheckoutPartner[];
    units: number;
    unitValue: number;
}) {
    const en = locale === "en";
    if (partners.length === 0 || units <= 0) return null;

    const allocations = allocate(partners, units);
    const placed = allocations.reduce((sum, a) => sum + a.units, 0);
    const short = units - placed;

    return (
        <div className="rounded-lg border border-stone-200 bg-white p-4">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-stone-900">
                <Icon name="users" size={16} className="shrink-0 text-brand-strong" />
                {en ? "Your Shathi partners" : "আপনার সাথী"}
            </h3>

            <ul className="mt-3 space-y-2.5">
                {allocations.map(({ partner, units: given }) => (
                    <li key={partner.idProjectPartners} className="flex items-center gap-3">
                        <Avatar partner={partner} />
                        <span className="min-w-0 flex-1">
                            <span className="block truncate font-display text-sm font-semibold text-stone-900">
                                {partner.name ?? (en ? "Shathi partner" : "সাথী")}
                            </span>
                            {!partner.unlimited && partner.capacity > 0 && (
                                <span className="block text-xs text-stone-500">
                                    {en
                                        ? `${partner.remaining} of ${partner.capacity} units free`
                                        : `${partner.capacity}টির মধ্যে ${partner.remaining}টি ইউনিট খালি`}
                                </span>
                            )}
                        </span>
                        <span className="shrink-0 text-end">
                            <span className="block font-display text-sm font-bold text-stone-900 tabular-nums">
                                ×{given}
                            </span>
                            <span className="block text-xs text-stone-500 tabular-nums">
                                {formatBdt(given * unitValue, locale)}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>

            {/* Honest about the case where the chosen units exceed capacity:
                the server would reject it, so saying nothing here would let the
                investor reach a failure they could have avoided. */}
            {short > 0 && (
                <p className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 p-2.5 text-xs leading-relaxed text-stone-700">
                    <Icon name="alert-triangle" size={14} className="mt-0.5 shrink-0 text-amber-600" />
                    {en
                        ? `Only ${placed} of ${units} units can be placed with the partners currently assigned to this project. Reduce the quantity, or the booking may be rejected.`
                        : `এই প্রকল্পে বর্তমানে নির্ধারিত সাথীদের কাছে ${units}টির মধ্যে মাত্র ${placed}টি ইউনিট রাখা যাবে। সংখ্যা কমান, নইলে বুকিং বাতিল হতে পারে।`}
                </p>
            )}

            <p className="mt-3 text-xs leading-relaxed text-stone-500">
                {en
                    ? "Tentative. Partners are confirmed after your payment is verified, based on who still has capacity then."
                    : "এটি অস্থায়ী। পরিশোধ যাচাইয়ের পর, তখন যাঁদের সক্ষমতা থাকবে তাঁদের ভিত্তিতে সাথী চূড়ান্ত হবে।"}
            </p>
        </div>
    );
}
