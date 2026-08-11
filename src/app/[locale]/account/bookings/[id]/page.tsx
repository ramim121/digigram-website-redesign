import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Card, Note } from "@/components/ui/Primitives";
import { ProofOfPaymentForm } from "@/components/booking/ProofOfPaymentForm";
import { CancelBookingButton } from "@/components/booking/CancelBookingButton";
import { fetchBankAccounts } from "@/lib/account.server";
import { getSessionUser } from "@/lib/auth/session";
import { fetchBooking, fetchDigigramBank } from "@/lib/bookings.server";
import { BOOKING_STATUS_LABEL } from "@/lib/booking";
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
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900">
                {en ? "Booking" : "বুকিং"} {summary.reference}
            </h1>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <Card className="h-fit p-6">
                    <dl className="space-y-3 text-sm">
                        <Row label={en ? "Status" : "অবস্থা"} value={t(BOOKING_STATUS_LABEL[summary.status], locale)} />
                        <Row
                            label={en ? "Placed" : "বুকিংয়ের তারিখ"}
                            value={
                                (summary.placedAt
                                    ? formatDate(summary.placedAt.slice(0, 10), locale)
                                    : null) ?? "—"
                            }
                        />
                        <Row
                            label={en ? "Projects" : "প্রকল্প"}
                            value={summary.projectNames.join(", ") || "—"}
                        />
                        <Row label={en ? "Units" : "ইউনিট"} value={String(summary.totalUnits)} />
                        <Row
                            label={en ? "Amount payable" : "প্রদেয় পরিমাণ"}
                            value={formatBdt(summary.totalInvested, locale)}
                        />
                    </dl>

                    {summary.partners.length > 0 && (
                        <div className="mt-6 border-t border-stone-200 pt-5">
                            <h2 className="font-display text-sm font-bold text-stone-900">
                                {en ? "Assigned Shathi partners" : "নির্ধারিত সাথী অংশীদার"}
                            </h2>
                            <ul className="mt-3 space-y-3">
                                {summary.partners.map((partner) => (
                                    <li key={partner.id} className="text-sm">
                                        <p className="font-display font-semibold text-stone-900">
                                            {partner.name ?? (en ? "Shathi partner" : "সাথী অংশীদার")}
                                            {partner.hasDisability && (
                                                <span className="ms-2 rounded bg-brand-canvas px-2 py-0.5 text-xs font-bold text-brand-strong">
                                                    {en ? "Person with disability" : "প্রতিবন্ধী ব্যক্তি"}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-stone-600">
                                            {[partner.role, partner.location].filter(Boolean).join(" · ")}
                                        </p>
                                        <p className="text-stone-500">
                                            {en
                                                ? `${partner.units} unit${partner.units === 1 ? "" : "s"} · ${formatBdt(partner.amount, locale)}`
                                                : `${partner.units} ইউনিট · ${formatBdt(partner.amount, locale)}`}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            {awaitingPayment && (
                                <p className="mt-4 text-xs text-stone-500">
                                    {en
                                        ? "These assignments are tentative until your payment is confirmed; partners are finalised then, based on availability."
                                        : "পেমেন্ট নিশ্চিত না হওয়া পর্যন্ত এই নির্ধারণ অস্থায়ী; তখন প্রাপ্যতা অনুযায়ী অংশীদার চূড়ান্ত করা হয়।"}
                                </p>
                            )}
                        </div>
                    )}
                </Card>

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
