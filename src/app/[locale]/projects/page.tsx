import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Note } from "@/components/ui/Primitives";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchProjects, projectSummary } from "@/lib/projects.server";
import { fetchShebaProjects } from "@/lib/sheba.server";
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
    title: locale === "en" ? "Open projects" : "চলমান প্রকল্প",
    description:
      locale === "en"
        ? "Every open project across DigiGram, in one place. Invest in a Shathi production cycle with a stated unit price and return band, or join a Shathi Sheba partner project as a farmer, with a bank loan and a guaranteed buy-back."
        : "ডিজিগ্রামের সব চলমান প্রকল্প এক জায়গায়। সাথীর উৎপাদন চক্রে বিনিয়োগ করুন — নির্দিষ্ট ইউনিট মূল্য ও রিটার্ন পরিসরসহ, অথবা কৃষক হিসেবে সাথী সেবার পার্টনার প্রকল্পে যুক্ত হোন — ব্যাংক ঋণ ও নিশ্চিত বাই-ব্যাকসহ।",
    image: "/assets/photos/hero/projects-smallholding.webp",
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

  /*
   * Two independent backends, fetched together rather than in sequence: the
   * Sheba platform is a different service, and one slow call should not add its
   * latency to the other. Neither throws — a Sheba outage sets `unavailable`
   * and the page renders the investment half alone.
   */
  const [{ data: projects }, summary, sheba] = await Promise.all([
    fetchProjects(),
    projectSummary(),
    fetchShebaProjects(),
  ]);

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
        eyebrow={en ? "Shathi and Shathi Sheba" : "সাথী ও সাথী সেবা"}
        title={en ? "One cycle, two ways in" : "একটি চক্র, যুক্ত হওয়ার দুই পথ"}
        lead={
          en
            ? "Every open project across both products. Invest in a Shathi production cycle and take a share of what it earns, or join a Shathi Sheba partner project as a farmer — with inputs, a bank loan and a guaranteed buy-back behind you."
            : "দুই পণ্যের সব চলমান প্রকল্প এক জায়গায়। সাথীর উৎপাদন চক্রে বিনিয়োগ করে আয়ের ভাগ নিন, অথবা কৃষক হিসেবে সাথী সেবার পার্টনার প্রকল্পে যুক্ত হোন — উপকরণ, ব্যাংক ঋণ ও নিশ্চিত বাই-ব্যাক সঙ্গে নিয়ে।"
        }
        image="/assets/photos/hero/projects-smallholding.webp"
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
          {/* Only when there are any — a "0 partner projects" badge advertises
              an absence. */}
          {sheba.data.length > 0 && (
            <>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span>
                {formatNumber(sheba.data.length, locale)}{" "}
                {/* Singular guard: only one partner project is open today, and
                    "1 partner projects" in the hero is the kind of detail that
                    makes the rest of the page look unchecked. Bangla does not
                    inflect the noun here, so it needs no branch. */}
                {en
                  ? sheba.data.length === 1
                    ? "partner project"
                    : "partner projects"
                  : "পার্টনার প্রকল্প"}
              </span>
            </>
          )}
        </p>
      </PageHero>

      <Section tone="canvas">
        <div className="container-page">
          <Note tone="risk" icon="shield">
            {/* Scoped to the investment projects now that partner projects
                share the page: a farmer applying to a Sheba project is not
                putting capital at risk, and a blanket warning would say
                otherwise. */}
            {en
              ? "On Shathi investment projects: returns shown are estimated ranges based on the project's production plan and expected sale price. They are not guaranteed and your capital is at risk. Read the risk note on each project before investing."
              : "সাথী বিনিয়োগ প্রকল্পের ক্ষেত্রে: দেখানো রিটার্ন প্রকল্পের উৎপাদন পরিকল্পনা ও প্রত্যাশিত বিক্রয়মূল্যের ভিত্তিতে আনুমানিক পরিসর। এগুলো নিশ্চিত নয় এবং আপনার পুঁজি ঝুঁকিতে থাকে। বিনিয়োগের আগে প্রতিটি প্রকল্পের ঝুঁকি নোট পড়ুন।"}
          </Note>

          <ProjectExplorer
            projects={projects}
            shebaProjects={sheba.data}
            shebaStale={sheba.stale}
            locale={locale}
          />
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
