import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Note } from "@/components/ui/Primitives";
import { legalUpdated, type LegalSection } from "@/content/legal";
import { formatDate, t, type Locale } from "@/lib/i18n";

/**
 * Shared frame for Terms and Privacy.
 *
 * The draft banner is deliberately part of the component, not the page: it
 * cannot be forgotten on one page and shown on the other, and it disappears
 * from both the moment the reviewed text is dropped in.
 */
export function LegalPage({
  locale,
  title,
  crumb,
  intro,
  sections,
}: {
  locale: Locale;
  title: string;
  crumb: string;
  intro: string;
  sections: LegalSection[];
}) {
  const en = locale === "en";

  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: crumb }]} title={title} lead={intro} />

      <Section tone="page">
        <div className="container-prose">
          <Note tone="warn" icon="alert-triangle">
            {en
              ? "Draft for legal review. This text was prepared to match how the service actually works and has not yet been approved by counsel. It is not the final published policy."
              : "আইনি পর্যালোচনার জন্য খসড়া। সেবাটি বাস্তবে যেভাবে চলে তার সঙ্গে মিলিয়ে এই লেখা তৈরি হয়েছে এবং এখনো আইনজীবীর অনুমোদন পায়নি। এটি চূড়ান্ত প্রকাশিত নীতি নয়।"}
          </Note>

          <p className="mt-6 text-sm text-stone-500">
            {en ? "Last updated: " : "সর্বশেষ হালনাগাদ: "}
            {formatDate(legalUpdated, locale)}
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
