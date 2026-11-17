import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { legalUpdated, type LegalSection } from "@/content/legal";
import { formatDate, t, type Locale } from "@/lib/i18n";

/**
 * Shared frame for Terms and Privacy.
 *
 * THE DRAFT BANNER IS GONE, DELIBERATELY.
 * While the content was placeholder text, both pages carried a warning that it
 * was "a draft for legal review… not the final published policy". The content
 * is now derived from the documents DigiGram actually publishes, so the warning
 * would be untrue — and worse than untrue here: `/privacy` is the URL submitted
 * to Google Play for the Shathi app, and a policy that announces it is not
 * final is a plausible review rejection on its own.
 *
 * The "Last updated" date stays, because a policy without one is the other
 * thing reviewers flag.
 */
export function LegalPage({
  locale,
  title,
  crumb,
  intro,
  sections,
  updated = legalUpdated,
}: {
  locale: Locale;
  title: string;
  crumb: string;
  intro: string;
  sections: LegalSection[];
  /** ISO date for "Last updated". Defaults to the Terms date. */
  updated?: string;
}) {
  const en = locale === "en";

  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: crumb }]} title={title} lead={intro} />

      <Section tone="page">
        <div className="container-prose">
          <p className="text-sm text-stone-500">
            {en ? "Last updated: " : "সর্বশেষ হালনাগাদ: "}
            {formatDate(updated, locale)}
          </p>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.heading.en}>
                <h2 className="font-display text-xl font-bold text-stone-900">
                  {t(section.heading, locale)}
                </h2>
                <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-stone-700">
                  {section.body.map((paragraph, index) => (
                    <p key={index}>{t(paragraph, locale)}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
