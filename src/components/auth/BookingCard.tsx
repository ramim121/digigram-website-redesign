import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { BOOKING_STATUS_LABEL, type BookingStatus } from "@/lib/booking";
import type { BookingSummary } from "@/lib/bookings.server";
import { formatBdt, formatDate, localePath, t, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * One booking, as a card.
 *
 * WHY A CARD AND NOT A ROW
 * The list used to be one line per booking: reference, project name, amount,
 * status. Every amount read BDT 0 because the mapper was reading the wrong
 * shape, but even with correct numbers a single line cannot carry what the SRS
 * asks for — amount, units, expected return, maturity, and whether a receipt is
 * still owed (FR-INV-02, FR-INV-03). A booking is the record of real money
 * moving; it earns the space.
 *
 * THE NEXT ACTION IS THE POINT
 * A booking awaiting a receipt is the only state where the investor has to do
 * something, and there is a deadline attached. That case gets the prominent
 * treatment; everything else is reference material.
 */

const STATUS_TONE: Record<BookingStatus, string> = {
    pending: "bg-amber-100 text-amber-900",
    proof_submitted: "bg-sky-100 text-sky-900",
    confirmed: "bg-emerald-100 text-emerald-900",
    denied: "bg-red-100 text-red-900",
    cancelled: "bg-stone-100 text-stone-600",
    // A status the API returned that we do not model. Neutral, never alarming.
    unknown: "bg-stone-100 text-stone-600",
};

function Figure({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone?: "strong" | "muted";
}) {
    return (
        <div>
            <dt className="font-display text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                {label}
            </dt>
            <dd
                className={
                    tone === "strong"
                        ? "mt-0.5 font-display text-lg font-bold text-stone-900 tabular-nums"
                        : tone === "muted"
                          ? "mt-0.5 text-sm text-stone-600 tabular-nums"
                          : "mt-0.5 font-display text-sm font-semibold text-stone-900 tabular-nums"
                }
            >
                {value}
            </dd>
        </div>
    );
}

export function BookingCard({ locale, booking }: { locale: Locale; booking: BookingSummary }) {
    const en = locale === "en";
    const href = localePath(locale, `${routes.account}/bookings/${booking.id}`);

    const awaitingProof = booking.status === "pending" && !booking.proofSubmitted;
    const awaitingReview = booking.status === "proof_submitted" || booking.proofSubmitted;

    return (
        <li className="relative rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <Link
                        href={href}
                        className="font-display text-base font-bold text-stone-900 after:absolute after:inset-0 hover:underline"
                    >
                        {en ? "Booking" : "বুকিং"} {booking.reference}
                    </Link>
                    <p className="mt-1 text-sm text-stone-600">
                        {booking.projectNames.length
                            ? booking.projectNames.join(" · ")
                            : en
                              ? "Project details unavailable"
                              : "প্রকল্পের তথ্য পাওয়া যায়নি"}
                    </p>
                </div>

                <span
                    className={`rounded-full px-2.5 py-1 font-display text-xs font-bold ${STATUS_TONE[booking.status]}`}
                >
                    {t(BOOKING_STATUS_LABEL[booking.status], locale)}
                </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-stone-50 p-4 sm:grid-cols-4">
                <Figure
                    label={en ? "Invested" : "বিনিয়োগ"}
                    value={formatBdt(booking.totalInvested, locale)}
                    tone="strong"
                />
                <Figure
                    label={en ? "Units" : "ইউনিট"}
                    value={String(booking.totalUnits)}
                />
                {/* Stated as a range and labelled "expected", never a promise. */}
                <Figure
                    label={en ? "Expected return" : "প্রত্যাশিত ফেরত"}
                    value={
                        booking.expectedReturnMax > 0
                            ? `${formatBdt(Math.round(booking.expectedReturnMin), locale)} – ${formatBdt(Math.round(booking.expectedReturnMax), locale)}`
                            : "—"
                    }
                />
                <Figure
                    label={en ? "Matures" : "মেয়াদপূর্তি"}
                    value={
                        booking.maturityDate
                            ? (formatDate(booking.maturityDate, locale) ?? "—")
                            : en
                              ? "After payment"
                              : "পরিশোধের পর"
                    }
                    tone="muted"
                />
            </dl>

            {booking.partners.length > 0 && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-stone-600">
                    <Icon name="users" size={15} className="shrink-0 text-brand-strong" />
                    {en
                        ? `${booking.partners.length} Shathi partner${booking.partners.length === 1 ? "" : "s"}`
                        : `${booking.partners.length} জন সাথী`}
                    <span className="text-stone-400">·</span>
                    <span className="truncate">
                        {booking.partners
                            .map((p) => p.name)
                            .filter(Boolean)
                            .slice(0, 2)
                            .join(", ")}
                        {booking.partners.length > 2 && (en ? " and more" : " ও আরও")}
                    </span>
                </p>
            )}

            {/* The only state that asks something of the investor. */}
            {awaitingProof && (
                <div className="relative z-10 mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3">
                    <Icon name="alert-triangle" size={18} className="shrink-0 text-amber-600" />
                    <p className="flex-1 text-sm text-stone-700">
                        {en
                            ? "Transfer the amount, then upload your receipt within 3 days or this booking is cancelled."
                            : "টাকা পাঠিয়ে ৩ দিনের মধ্যে রসিদ আপলোড করুন, নইলে বুকিংটি বাতিল হবে।"}
                    </p>
                    <Link
                        href={href}
                        className="inline-flex items-center gap-1.5 rounded-md bg-brand-strong px-3 py-2 font-display text-sm font-semibold text-white"
                    >
                        {en ? "Upload receipt" : "রসিদ আপলোড"}
                        <Icon name="arrow-right" size={15} />
                    </Link>
                </div>
            )}

            {awaitingReview && booking.status !== "confirmed" && (
                <p className="mt-4 flex items-center gap-2 rounded-lg bg-sky-50 p-3 text-sm text-stone-700">
                    <Icon name="info" size={16} className="shrink-0 text-sky-700" />
                    {en
                        ? "Receipt received and under review. Nothing more is needed from you."
                        : "রসিদ পাওয়া গেছে, পর্যালোচনায় আছে। আপনার আর কিছু করার নেই।"}
                </p>
            )}

            <p className="mt-3 text-xs text-stone-500">
                {en ? "Placed" : "বুকিং"}{" "}
                {(booking.placedAt && formatDate(booking.placedAt, locale)) || "—"}
            </p>
        </li>
    );
}
