import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/booking/CheckoutForm";
import { fetchProjectPartners } from "@/lib/projectPartners.server";
import { BookingGate } from "@/components/auth/BookingGate";
import { getSessionUser, bookingBlockers } from "@/lib/auth/session";
import { allProjectSlugs, fetchProject } from "@/lib/projects.server";
import { buildMetadata } from "@/lib/seo";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Invest entry point — deliberately a stub.
 *
 * The booking and payment flow is out of scope for v1 and will be designed
 * separately from the app screens. This page exists so the journey has a real
 * destination, the auth gate is exercised, and a visitor who reaches it is told
 * plainly what happens next instead of hitting a dead link.
 */

/** Reads the session, so it must be rendered per request, never prerendered. */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await allProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  const project = await fetchProject(slug);

  return buildMetadata({
    locale,
    path: routes.invest(slug),
    title:
      locale === "en"
        ? `Invest in ${project ? t(project.title, "en") : "this project"}`
        : `${project ? t(project.title, "bn") : "এই প্রকল্পে"} বিনিয়োগ`,
    description:
      locale === "en"
        ? "Complete your investment in the Shathi app while the web booking flow is being finalised."
        : "ওয়েব বুকিং প্রক্রিয়া চূড়ান্ত হওয়া পর্যন্ত সাথী অ্যাপে আপনার বিনিয়োগ সম্পন্ন করুন।",
    noindex: true,
  });
}

export default async function InvestPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const project = await fetchProject(slug);
  if (!project) notFound();

  // Eligibility is decided on the server. A signed-out or unverified visitor
  // never receives the booking UI at all, so there is nothing to bypass from
  // the browser — the backend re-checks on submission regardless.
  const user = await getSessionUser();
  if (!user || bookingBlockers(user).length > 0) {
    return (
      <div className="container-page py-12 lg:py-16">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900">
          {t(project.title, locale)}
        </h1>
        <div className="mt-6 max-w-2xl">
          {/* Signing in from here returns here, not to the account page —
              the visitor was part-way through investing in this project. */}
          <BookingGate
            locale={locale}
            user={user}
            returnTo={localePath(locale, routes.invest(slug))}
          />
        </div>
      </div>
    );
  }

  // A booking must be recorded against at least one assigned partner, so an
  // unassigned project cannot be booked — saying so beats a validation error
  // after the visitor has chosen a quantity.
  const partners = await fetchProjectPartners(Number(project.id));

  return (
    <div className="container-page py-12 lg:py-16">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900">
        {locale === "en" ? "Confirm your investment" : "আপনার বিনিয়োগ নিশ্চিত করুন"}
      </h1>
      {/* Was `max-w-xl`, which put the whole checkout in a 36rem column and
          left two thirds of a desktop screen empty while the partner list
          stacked below the fold. CheckoutForm lays itself out in two columns
          now; this only stops it running the full width of a wide monitor. */}
      <div className="mt-8 max-w-5xl">
        <CheckoutForm
          locale={locale}
          idProjects={Number(project.id)}
          slug={slug}
          title={t(project.title, locale)}
          unitValue={project.unitAmountBdt}
          unitsRemaining={project.unitsRemaining}
          maxPerInvestor={0}
          partners={partners}
        />
      </div>
    </div>
  );
}
