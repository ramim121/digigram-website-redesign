import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Note } from "@/components/ui/Primitives";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchProjects, projectSummary } from "@/lib/projects.server";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatBdt, formatNumber, isLocale, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;

  return buildMetadata({
    locale,
    path: routes.projects,
    title: locale === "en" ? "Open investment projects" : "চলমান বিনিয়োগ প্রকল্প",
    description:
      locale === "en"
        ? "Browse open livestock, agriculture and agri-input projects in Bangladesh. Every project states its unit price, tenure, estimated return band and how many units remain."
        : "বাংলাদেশে চলমান পশুসম্পদ, কৃষি ও কৃষি উপকরণ প্রকল্প দেখুন। প্রতিটি প্রকল্পে থাকে ইউনিট মূল্য, মেয়াদ, প্রাক্কলিত রিটার্ন পরিসর ও কতটি ইউনিট বাকি।",
    image: "/assets/projects/cattle-grazing.jpg",
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const { data: projects } = await fetchProjects();
  const summary = await projectSummary();

  return (
    <div data-brand="shathi">
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: en ? "Home" : "হোম", path: routes.home },
            { name: en ? "Projects" : "প্রকল্প", path: routes.projects },
          ],
          locale,
        )}
      />

      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Projects" : "প্রকল্প" }]}
        eyebrow={en ? "Powered by Shathi" : "সাথী দ্বারা পরিচালিত"}
        title={en ? "Invest in a production cycle" : "একটি উৎপাদন চক্রে বিনিয়োগ করুন"}
        lead={
          en
            ? "Not a loan and not a donation. Each project funds one cycle of real production, with a stated unit price, a monitored process and an estimated return band."
            : "এটি ঋণও নয়, দানও নয়। প্রতিটি প্রকল্প বাস্তব উৎপাদনের একটি চক্রে অর্থায়ন করে — নির্দিষ্ট ইউনিট মূল্য, তদারকিকৃত প্রক্রিয়া ও প্রাক্কলিত রিটার্ন পরিসরসহ।"
        }
        image="/assets/projects/cattle-grazing.jpg"
      >
        <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-white/12 px-5 py-2.5 font-display text-sm font-semibold text-white ring-1 ring-white/20">
          <span>
            {formatNumber(summary.openCount, locale)}{" "}
            {en ? "open projects" : "চলমান প্রকল্প"}
          </span>
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <span>
            {formatBdt(summary.availableBdt, locale, { variant: "data" })}{" "}
            {en ? "available" : "উপলব্ধ"}
          </span>
        </p>
      </PageHero>

      <Section tone="canvas">
        <div className="container-page">
          <Note tone="risk" icon="shield">
            {en
              ? "Returns shown are estimated ranges based on the project's production plan and expected sale price. They are not guaranteed and your capital is at risk. Read the risk note on each project before investing."
              : "দেখানো রিটার্ন প্রকল্পের উৎপাদন পরিকল্পনা ও প্রত্যাশিত বিক্রয়মূল্যের ভিত্তিতে প্রাক্কলিত পরিসর। এগুলো নিশ্চিত নয় এবং আপনার পুঁজি ঝুঁকিতে থাকে। বিনিয়োগের আগে প্রতিটি প্রকল্পের ঝুঁকি নোট পড়ুন।"}
          </Note>

          <ProjectExplorer projects={projects} locale={locale} />
        </div>
      </Section>

      <CtaBand
        locale={locale}
        title={
          en
            ? "Not sure which project fits your goals?"
            : "কোন প্রকল্প আপনার লক্ষ্যের সঙ্গে মানানসই বুঝতে পারছেন না?"
        }
        lead={
          en
            ? "Tell us your budget and tenure and we'll point you at the right cycle."
            : "আপনার বাজেট ও মেয়াদ জানান, আমরা উপযুক্ত চক্রটি দেখিয়ে দেব।"
        }
        primary={{ href: routes.contact, label: en ? "Talk to us" : "কথা বলুন" }}
        secondary={{ href: routes.shathi, label: en ? "About Shathi" : "সাথী সম্পর্কে" }}
      />
    </div>
  );
}
