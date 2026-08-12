import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card, Note } from "@/components/ui/Primitives";
import { ProofOfPaymentForm } from "@/components/booking/ProofOfPaymentForm";
import { CancelBookingButton } from "@/components/booking/CancelBookingButton";
import { SubmittedProof } from "@/components/booking/SubmittedProof";
import { Icon } from "@/components/ui/Icon";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { PartnerList } from "@/components/booking/PartnerList";
import { fetchBankAccounts } from "@/lib/account.server";
import { getSessionUser } from "@/lib/auth/session";
import { fetchBooking, fetchDigigramBank } from "@/lib/bookings.server";
import { BOOKING_STATUS_LABEL, type BookingStatus } from "@/lib/booking";
import { buildMetadata } from "@/lib/seo";
import { formatBdt, formatDate, isLocale, localePath, t, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";
import { loginUrlFor } from "@/lib/auth/returnTo";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale: raw } = await params;
    const locale = (isLocale(raw) ? raw : "en") as Locale;
    return buildMetadata({
        locale,
        path: routes.account,
        title: locale === "en" ? "Booking" : "বুকিং",
        description: "",
        noindex: true,
    });
}

/** Session-dependent, and the status changes as we process the payment. */
export const dynamic = "force-dynamic";

const STATUS_TONE: Record<BookingStatus, string> = {
    pending: "bg-amber-100 text-amber-900",
    proof_submitted: "bg-sky-100 text-sky-900",
    confirmed: "bg-emerald-100 text-emerald-900",
    denied: "bg-red-100 text-red-900",
    cancelled: "bg-stone-100 text-stone-600",
    unknown: "bg-stone-100 text-stone-600",
};

const SUPPORT_EMAIL = "info@digigramventures.com";

function Figure({
    label,
    value,
    strong,
    tone,
}: {
    label: string;
    value: string;
    strong?: boolean;
    tone?: "positive";
}) {
    return (
        <div>
            <dt className="font-display text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                {label}
            </dt>
            <dd
                className={"mt-0.5 font-display tabular-nums " +
                    (strong ? "text-xl font-extrabold " : "text-sm font-bold ") +
                    (tone === "positive" ? "text-emerald-700" : "text-stone-900")}
            >
                {value}
            </dd>
        </div>
    );
}

export default async function BookingPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale: raw, id } = await params;
    if (!isLocale(raw)) notFound();
    const locale = raw as Locale;
    const en = locale === "en";

    const user = await getSessionUser();
    if (!user) {
        // Send them back to this booking once they are in, rather than to a
        // generic landing page — they asked for this URL.
        const here = localePath(locale, `${routes.account}/bookings/${id}`);
        redirect(loginUrlFor(localePath(locale, routes.login), here));
    }

    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) notFound();

    // `fetchBooking` uses the ownership-checked v2 route, which answers 404 for
    // somebody else's booking — so "not yours" and "does not exist" are
    // indistinguishable from here, which is the intent.
    const booking = await fetchBooking(numericId);
    if (!booking) notFound();

    const { summary } = booking;
    const [digigramBank, userBanks] = await Promise.all([
        fetchDigigramBank(),
        fetchBankAccounts(user.idUsers),
    ]);

    const awaitingPayment = summary.status === "pending";

    return (
        <div className="container-page py-12 lg:py-16">
            <Link
                href={localePath(locale, routes.account)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-brand-strong"
            >
                <Icon name="arrow-left" size={15} />
                {en ? "All bookings" : "সব বুকিং"}
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900">
                    {en ? "Booking" : "বুকিং"} {summary.reference}
                </h1>
                <span className={`rounded-full px-2.5 py-1 font-display text-xs font-bold ${STATUS_TONE[summary.status]}`}>
                    {t(BOOKING_STATUS_LABEL[summary.status], locale)}
                </span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
                {summary.projectNames.join(" · ") || "—"}
            </p>

            {/* The headline figures, before any of the detail. */}
            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-stone-200 bg-white p-5 sm:grid-cols-4">
                <Figure
                    label={en ? "Invested" : "বিনিয়োগ"}
                    value={formatBdt(summary.totalInvested, locale)}
                    strong
                />
                <Figure label={en ? "Units" : "ইউনিট"} value={String(summary.totalUnits)} />
                <Figure
                    label={en ? "Expected return" : "প্রত্যাশিত ফেরত"}
                    value={
                        summary.expectedReturnMax > 0
                            ? `${formatBdt(Math.round(summary.expectedReturnMin), locale)} – ${formatBdt(Math.round(summary.expectedReturnMax), locale)}`
                            : "—"
                    }
                />
                <Figure
                    label={en ? "Expected gain" : "প্রত্যাশিত মুনাফা"}
                    value={
                        summary.expectedReturnMax > 0
                            ? `+ ${formatBdt(Math.round(summary.expectedReturnMax - summary.totalInvested), locale)}`
                            : "—"
                    }
                    tone="positive"
                />
            </dl>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
                <div className="space-y-6">
                    <BookingProgress
                        locale={locale}
                        status={summary.status}
                        proofSubmitted={summary.proofSubmitted}
                        placedAt={summary.placedAt}
                        maturityDate={summary.maturityDate}
                    />

                    <Card className="p-5">
                        <dl className="space-y-3 text-sm">
                            <Row
                                label={en ? "Placed" : "বুকিংয়ের তারিখ"}
                                value={
                                    (summary.placedAt
                                        ? formatDate(summary.placedAt.slice(0, 10), locale)
                                        : null) ?? "—"
                                }
                            />
                            <Row
                                label={en ? "Matures" : "মেয়াদপূর্তি"}
                                value={
                                    summary.maturityDate
                                        ? (formatDate(summary.maturityDate, locale) ?? "—")
                                        : en
                                          ? "After payment"
                                          : "পরিশোধের পর"
                                }
                            />
                            <Row label={en ? "Reference" : "রেফারেন্স"} value={summary.reference} />
                        </dl>

                        {/* Quoting the reference is the difference between a
                            useful support email and a slow one, so it is
                            pre-filled rather than left to be copied. */}
                        <a
                            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                                (en ? "Booking " : "বুকিং ") + summary.reference,
                            )}`}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 px-4 py-2.5 font-display text-sm font-semibold text-stone-800 hover:border-brand-strong hover:text-brand-strong"
                        >
                            <Icon name="mail" size={16} />
                            {en ? "Email support about this booking" : "এই বুকিং নিয়ে সহায়তা চান"}
                        </a>
                    </Card>

                    <Card className="p-5">
                        <PartnerList
                            locale={locale}
                            partners={summary.partners}
                            tentative={awaitingPayment}
                        />
                    </Card>
                </div>

                <div>
                    {awaitingPayment ? (
                        <>
                            <Note tone="info" icon="info" className="mb-6">
                                {en
                                    ? "Complete your payment and upload the receipt within 3 days, or the units are released back to the project."
                                    : "৩ দিনের মধ্যে পরিশোধ সম্পন্ন করে রসিদ আপলোড করুন, নইলে ইউনিটগুলো প্রকল্পে ফিরিয়ে দেওয়া হবে।"}
                            </Note>
                            <ProofOfPaymentForm
                                locale={locale}
                                bookingId={summary.id}
                                digigramBank={digigramBank}
                                userBanks={userBanks ?? []}
                            />
                            <CancelBookingButton locale={locale} bookingId={summary.id} />
                        </>
                    ) : (
                        <div className="space-y-6">
                            {/* The receipt already on file. A status that says "under
                                review" while showing nothing to review leaves the investor
                                unable to tell whether the right file even arrived. */}
                            {summary.proofSubmitted && (
                                <SubmittedProof locale={locale} bookingId={summary.id} />
                            )}

                        <Card className="p-6">
                            <h2 className="font-display text-lg font-bold text-stone-900">
                                {t(BOOKING_STATUS_LABEL[summary.status], locale)}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-stone-600">
                                {summary.status === "proof_submitted" &&
                                    (en
                                        ? "We have your receipt and are checking it against the incoming funds. Nothing more is needed from you."
                                        : "আমরা আপনার রসিদ পেয়েছি এবং আসা অর্থের সঙ্গে মিলিয়ে দেখছি। আপনার আর কিছু করার নেই।")}
                                {summary.status === "confirmed" &&
                                    (en
                                        ? "Your payment is confirmed and your units are secured. Your assigned Shathi partners are shown in the app."
                                        : "আপনার পেমেন্ট নিশ্চিত হয়েছে এবং ইউনিট সংরক্ষিত হয়েছে। নির্ধারিত সাথী অংশীদারদের অ্যাপে দেখা যাবে।")}
                                {summary.status === "denied" &&
                                    (en
                                        ? "We could not match this payment. Please contact support with your booking reference."
                                        : "এই পেমেন্টটি মেলানো যায়নি। বুকিং নম্বরসহ সহায়তা কেন্দ্রে যোগাযোগ করুন।")}
                                {summary.status === "cancelled" &&
                                    (en
                                        ? "This booking was cancelled and the units returned to the project."
                                        : "এই বুকিং বাতিল হয়েছে এবং ইউনিটগুলো প্রকল্পে ফেরত গেছে।")}
                                {summary.status === "unknown" &&
                                    (en
                                        ? "This booking is recorded. Check the Shathi app for the latest status."
                                        : "এই বুকিং নথিভুক্ত হয়েছে। সর্বশেষ অবস্থা জানতে সাথী অ্যাপ দেখুন।")}
                            </p>
                        </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="text-stone-500">{label}</dt>
            <dd className="text-end font-medium text-stone-900">{value}</dd>
        </div>
    );
}
