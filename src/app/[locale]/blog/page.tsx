import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchArticles } from "@/lib/content.server";
import { BLOG_FALLBACK_IMAGE, categoryLabel, readingLabel } from "@/lib/blog";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDate, isLocale, localePath, t, type Locale } from "@/lib/i18n";
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
    path: routes.blog,
    title: locale === "en" ? "News & insights" : "খবর ও বিশ্লেষণ",
    description:
      locale === "en"
        ? "How contract-farming returns are generated, why thin-file farmers cannot borrow, and what feed specifications mean for a household. Plain explanations of the rural economy in Bangladesh."
        : "চুক্তিভিত্তিক চাষে রিটার্ন কীভাবে তৈরি হয়, স্বল্প-তথ্য কৃষক কেন ঋণ পান না, আর ফিডের স্পেসিফিকেশন একটি পরিবারের জন্য কী অর্থ বহন করে। বাংলাদেশের গ্রামীণ অর্থনীতির সহজ ব্যাখ্যা।",
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";
  const { data: posts } = await fetchArticles();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: en ? "Home" : "হোম", path: routes.home },
            { name: en ? "Blog" : "ব্লগ", path: routes.blog },
          ],
          locale,
        )}
      />

      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Blog" : "ব্লগ" }]}
        eyebrow={en ? "News & insights" : "খবর ও বিশ্লেষণ"}
        title={en ? "How the model actually works" : "মডেলটি আসলে যেভাবে কাজ করে"}
        lead={
          en
            ? "Explanations, not announcements. Each post takes one question about rural finance or production and answers it properly."
            : "ঘোষণা নয়, ব্যাখ্যা। প্রতিটি লেখা গ্রামীণ অর্থায়ন বা উৎপাদন নিয়ে একটি প্রশ্ন নিয়ে তার যথাযথ উত্তর দেয়।"
        }
      />

      <Section tone="page">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 60}>
                <Card className="group relative flex h-full flex-col overflow-hidden" interactive>
                  <div className="relative aspect-video overflow-hidden bg-stone-100">
                    <Image
                      src={post.image ?? BLOG_FALLBACK_IMAGE}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 380px, 100vw"
                      className="object-cover transition-transform duration-500 ease-standard group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-display text-xs font-bold tracking-wide text-brand-strong uppercase">
                      {categoryLabel(post, locale)}
                    </p>
                    <h2 className="mt-2 font-display text-xl leading-snug font-bold text-stone-900">
                      <Link
                        href={localePath(locale, routes.post(post.slug))}
                        className="after:absolute after:inset-0"
                      >
                        {t(post.title, locale)}
                      </Link>
                    </h2>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stone-600">
                      {t(post.excerpt, locale)}
                    </p>
                    <p className="mt-5 text-xs text-stone-400">
                      {post.date && `${formatDate(post.date, locale)} · `}
                      {readingLabel(post, locale)}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
