import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { AssignedPartner } from "@/lib/bookings.server";
import { formatBdt, type Locale } from "@/lib/i18n";

/**
 * The Shathi partners a booking is allocated to.
 *
 * WHY EACH ONE EXPANDS
 * A name and a location is not a person. The whole proposition is that money
 * reaches a specific producer, so the detail — photo, what they farm, their own
 * words — is the point rather than decoration. It is collapsed by default
 * because a booking across several partners would otherwise be a wall of prose
 * before the reader reaches the payment step.
 *
 * `<details>` rather than a modal: it works before hydration, is keyboard
 * operable for free, and does not trap focus. This is content to read, not a
 * task to complete.
 */

function Avatar({ partner, size = 56 }: { partner: AssignedPartner; size?: number }) {
    if (partner.image) {
        return (
            <Image
                src={partner.image}
                alt=""
                width={size}
                height={size}
                className="size-14 shrink-0 rounded-full object-cover"
            />
        );
    }

    // Initials rather than a generic silhouette: a placeholder person reads as a
    // missing record, initials read as "no photo yet".
    const initials = (partner.name ?? "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

    return (
        <span
            aria-hidden
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-canvas font-display text-base font-bold text-brand-strong"
        >
            {initials || "·"}
        </span>
    );
}

export function PartnerList({
    locale,
    partners,
    tentative,
}: {
    locale: Locale;
    partners: AssignedPartner[];
    /** True before payment is confirmed — allocation can still change. */
    tentative: boolean;
}) {
    const en = locale === "en";
    if (partners.length === 0) return null;

    return (
        <section>
            <h2 className="font-display text-base font-bold text-stone-900">
                {en ? "Your Shathi partners" : "আপনার সাথী"}
                <span className="ms-2 font-display text-sm font-semibold text-stone-500">
                    {partners.length}
                </span>
            </h2>

            <ul className="mt-3 space-y-2">
                {partners.map((partner) => {
                    const hasDetail = Boolean(partner.bio || partner.interestedIn);

                    const header = (
                        <>
                            <Avatar partner={partner} />
                            <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                    <span className="font-display text-sm font-bold text-stone-900">
                                        {partner.name ?? (en ? "Shathi partner" : "সাথী")}
                                    </span>
                                    {partner.hasDisability && (
                                        <span
                                            className="inline-flex items-center gap-1 rounded-full bg-brand-canvas px-2 py-0.5 text-[11px] font-semibold text-brand-strong"
                                            title={
                                                en
                                                    ? "Person with a disability"
                                                    : "প্রতিবন্ধী ব্যক্তি"
                                            }
                                        >
                                            <Icon name="accessibility" size={12} />
                                            {en ? "Inclusion" : "অন্তর্ভুক্তি"}
                                        </span>
                                    )}
                                </span>

                                <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-stone-500">
                                    {partner.location && (
                                        <span className="inline-flex items-center gap-1">
                                            <Icon name="map-pin" size={12} />
                                            {partner.location}
                                        </span>
                                    )}
                                    {partner.interestedIn && (
                                        <span className="inline-flex items-center gap-1">
                                            <Icon name="leaf" size={12} />
                                            {partner.interestedIn}
                                        </span>
                                    )}
                                </span>
                            </span>

                            <span className="shrink-0 text-end">
                                <span className="block font-display text-sm font-bold text-stone-900 tabular-nums">
                                    {partner.units} {en ? "units" : "ইউনিট"}
                                </span>
                                <span className="block text-xs text-stone-500 tabular-nums">
                                    {formatBdt(partner.amount, locale)}
                                </span>
                            </span>
                        </>
                    );

                    if (!hasDetail) {
                        return (
                            <li
                                key={partner.id}
                                className="flex items-center gap-3 rounded-lg border border-stone-200 p-3"
                            >
                                {header}
                            </li>
                        );
                    }

                    return (
                        <li key={partner.id} className="rounded-lg border border-stone-200">
                            <details className="group">
                                <summary className="flex cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
                                    {header}
                                    <Icon
                                        name="chevron-down"
                                        size={16}
                                        className="shrink-0 text-stone-400 transition-transform group-open:rotate-180"
                                    />
                                </summary>

                                <div className="border-t border-stone-100 px-3 pt-3 pb-4">
                                    {partner.bio && (
                                        <p className="text-sm leading-relaxed text-stone-700">
                                            {partner.bio}
                                        </p>
                                    )}
                                </div>
                            </details>
                        </li>
                    );
                })}
            </ul>

            {tentative && (
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-stone-50 p-3 text-xs leading-relaxed text-stone-600">
                    <Icon name="info" size={14} className="mt-0.5 shrink-0 text-stone-400" />
                    {en
                        ? "These allocations are tentative. Partners are confirmed once your payment is verified, based on who still has capacity."
                        : "এই বরাদ্দ আপাতত অস্থায়ী। পরিশোধ যাচাই হওয়ার পর, যাঁদের সক্ষমতা আছে তাঁদের ভিত্তিতে সাথী চূড়ান্ত হবে।"}
                </p>
            )}
        </section>
    );
}
