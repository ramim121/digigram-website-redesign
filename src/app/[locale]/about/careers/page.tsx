import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card, Badge, Note } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { isLocale, localePath, t, type Bi, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  return buildMetadata({
    locale,
    path: routes.careers,
    title: locale === "en" ? "Careers" : "ক্যারিয়ার",
    description:
      locale === "en"
        ? "Field operations, supply chain, engineering and impact roles at DigiGram Ventures in Dhaka and Chattogram."
        : "ঢাকা ও চট্টগ্রামে ডিজিগ্রাম ভেঞ্চারসে মাঠ পরিচালনা, সরবরাহ চেইন, প্রকৌশল ও ইমপ্যাক্ট বিভাগে পদ।",
  });
}

/**
 * Roles are illustrative of the functions the company actually runs, and are
 * marked as such — the client has not supplied a live vacancy list. Replace
 * `openRoles` when hiring opens; the page needs no other change.
 */
const openRoles: {
  title: Bi;
  team: Bi;
  location: Bi;
  type: Bi;
  summary: Bi;
  icon: IconName;
}[] = [
  {
    icon: "sprout",
    title: { en: "Field Officer — Livestock", bn: "মাঠ কর্মকর্তা — পশুসম্পদ" },
    team: { en: "Field operations", bn: "মাঠ পরিচালনা" },
    location: { en: "Rangunia, Chattogram", bn: "রাঙ্গুনিয়া, চট্টগ্রাম" },
    type: { en: "Full time", bn: "পূর্ণকালীন" },
    summary: {
      en: "Verify enterprise profiles, run weekly growth checks against the project SOP, and support cooperative members through a production cycle.",
      bn: "উদ্যোগ প্রোফাইল যাচাই করা, প্রকল্প এসওপি অনুযায়ী সাপ্তাহিক বৃদ্ধি পরীক্ষা এবং উৎপাদন চক্র জুড়ে সমবায় সদস্যদের সহায়তা করা।",
    },
  },
  {
    icon: "truck",
    title: { en: "Supply Chain Coordinator", bn: "সরবরাহ চেইন সমন্বয়ক" },
    team: { en: "Supply", bn: "সরবরাহ" },
    location: { en: "Dhaka", bn: "ঢাকা" },
    type: { en: "Full time", bn: "পূর্ণকালীন" },
    summary: {
      en: "Aggregate cooperative-level demand, plan feed dispatch and hold delivery performance to a standard farmers can rely on.",
      bn: "সমবায় পর্যায়ের চাহিদা একত্র করা, ফিড পাঠানোর পরিকল্পনা এবং কৃষকের ভরসাযোগ্য মানে সরবরাহ কর্মক্ষমতা ধরে রাখা।",
    },
  },
  {
    icon: "layers",
    title: { en: "Product Engineer — Shathi Sheba", bn: "প্রোডাক্ট ইঞ্জিনিয়ার — সাথী সেবা" },
    team: { en: "Technology", bn: "প্রযুক্তি" },
    location: { en: "Dhaka · Hybrid", bn: "ঢাকা · হাইব্রিড" },
    type: { en: "Full time", bn: "পূর্ণকালীন" },
    summary: {
      en: "Build offline-tolerant, Bangla-first mobile experiences for low-end devices, and the workflow behind the Rural Enterprise Passport.",
      bn: "স্বল্পক্ষমতার ডিভাইসের জন্য অফলাইন-সহনশীল, বাংলা-প্রথম মোবাইল অভিজ্ঞতা এবং রুরাল এন্টারপ্রাইজ পাসপোর্টের পেছনের কর্মপ্রবাহ তৈরি করা।",
    },
  },
  {
    icon: "bar-chart",
    title: { en: "Impact & MEL Associate", bn: "ইমপ্যাক্ট ও এমইএল অ্যাসোসিয়েট" },
    team: { en: "Impact", bn: "ইমপ্যাক্ট" },
    location: { en: "Dhaka", bn: "ঢাকা" },
    type: { en: "Full time", bn: "পূর্ণকালীন" },
    summary: {
      en: "Run the household baseline, keep the measurement framework honest, and produce reporting that survives an investor's questions.",
      bn: "পারিবারিক ভিত্তিরেখা পরিচালনা, পরিমাপ কাঠামোকে সৎ রাখা এবং বিনিয়োগকারীর প্রশ্নের মুখেও টিকে থাকা প্রতিবেদন তৈরি করা।",
    },
  },
];

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: en ? "Home" : "হোম", path: routes.home },
            { name: en ? "About" : "আমাদের সম্পর্কে", path: routes.about },
            { name: en ? "Careers" : "ক্যারিয়ার", path: routes.careers },
          ],
          locale,
        )}
      />

      <PageHero
        locale={locale}
        crumbs={[
          { label: en ? "About" : "আমাদের সম্পর্কে", href: localePath(locale, routes.about) },
          { label: en ? "Careers" : "ক্যারিয়ার" },
        ]}
        eyebrow={en ? "Careers" : "ক্যারিয়ার"}
        title={en ? "Work where the work happens" : "যেখানে কাজ হয়, সেখানেই কাজ করুন"}
        lead={
          en
            ? "Most of what we do is decided in a courtyard in Rangunia, not in a meeting room in Dhaka. We hire people who are comfortable with that."
            : "আমাদের বেশিরভাগ সিদ্ধান্ত হয় রাঙ্গুনিয়ার কোনো উঠানে, ঢাকার সভাকক্ষে নয়। আমরা এমন মানুষ নিই যাঁরা এতে স্বচ্ছন্দ।"
        }
        image="/assets/photos/field-visit.webp"
      />

      <Section tone="page">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Open roles" : "খোলা পদ"}
            title={en ? "Where we are hiring" : "আমরা যেখানে নিয়োগ দিচ্ছি"}
          />

          <Note tone="info" icon="info" className="mt-8">
            {en
              ? "These are the functions we hire into. Live vacancies and closing dates will be listed here — until then, send a speculative application and tell us which of these fits you."
              : "এই বিভাগগুলোতেই আমরা নিয়োগ দিই। চলমান শূন্যপদ ও আবেদনের শেষ তারিখ এখানে থাকবে — ততদিন আগ্রহ জানিয়ে আবেদন পাঠান এবং কোন পদটি আপনার সঙ্গে মেলে জানান।"}
          </Note>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {openRoles.map((role) => (
              <Card key={role.title.en} className="flex h-full flex-col p-7">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                    <Icon name={role.icon} size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg leading-snug font-bold text-stone-900">
                      {t(role.title, locale)}
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">{t(role.team, locale)}</p>
                  </div>
                </div>

                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-stone-600">
                  {t(role.summary, locale)}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge tone="muted" icon="map-pin">
                    {t(role.location, locale)}
                  </Badge>
                  <Badge tone="muted" icon="clock">
                    {t(role.type, locale)}
                  </Badge>
                </div>

                <ButtonLink
                  href={`mailto:${site.email}?subject=${encodeURIComponent(t(role.title, "en"))}`}
                  external
                  variant="secondary"
                  className="mt-6"
                  icon="arrow-right"
                >
                  {en ? "Apply by email" : "ইমেইলে আবেদন"}
                </ButtonLink>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "How we work" : "আমরা যেভাবে কাজ করি"}
            title={en ? "What to expect" : "কী আশা করবেন"}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: { en: "Field first", bn: "মাঠই প্রথম" },
                body: {
                  en: "Everyone spends time in the field, whatever the role. A product decision made without seeing a cooperative meeting is a guess.",
                  bn: "পদ যাই হোক, সবাইকে মাঠে সময় দিতে হয়। সমবায়ের সভা না দেখে নেওয়া পণ্য সিদ্ধান্ত নিছক আন্দাজ।",
                },
              },
              {
                title: { en: "Bangla first", bn: "বাংলাই প্রথম" },
                body: {
                  en: "Our users read Bangla on a low-end phone with poor signal. If it does not work there, it does not work.",
                  bn: "আমাদের ব্যবহারকারীরা দুর্বল নেটওয়ার্কে স্বল্পক্ষমতার ফোনে বাংলা পড়েন। সেখানে কাজ না করলে সেটি কাজ করে না।",
                },
              },
              {
                title: { en: "Evidence over assertion", bn: "দাবি নয়, প্রমাণ" },
                body: {
                  en: "We publish a mechanism next to every number. If we cannot show how a figure was produced, we do not use it.",
                  bn: "প্রতিটি সংখ্যার পাশে আমরা তার প্রক্রিয়া প্রকাশ করি। কোনো সংখ্যা কীভাবে এল দেখাতে না পারলে আমরা তা ব্যবহার করি না।",
                },
              },
            ].map((value) => (
              <Card key={value.title.en} className="p-7">
                <h3 className="font-display text-lg font-bold text-stone-900">
                  {t(value.title, locale)}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                  {t(value.body, locale)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand
        locale={locale}
        title={en ? "Nothing here fits, but you want in?" : "কোনোটাই মিলছে না, তবু যোগ দিতে চান?"}
        lead={
          en
            ? "Tell us what you would do here and why. We read every one."
            : "আপনি এখানে কী করতেন এবং কেন, লিখে জানান। আমরা প্রতিটি আবেদন পড়ি।"
        }
        primary={{ href: routes.contact, label: en ? "Get in touch" : "যোগাযোগ করুন" }}
        secondary={{ href: routes.about, label: en ? "About us" : "আমাদের সম্পর্কে" }}
      />
    </>
  );
}
