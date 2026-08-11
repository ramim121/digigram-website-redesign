import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { ShareRow } from "@/components/projects/ShareRow";
import { CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchArticle, fetchArticles, allArticleSlugs } from "@/lib/content.server";
import { BLOG_FALLBACK_IMAGE, categoryLabel, readingLabel } from "@/lib/blog";
import { absolute, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDate, isLocale, localePath, t, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";

export async function generateStaticParams() {
  return (await allArticleSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  const post = await fetchArticle(slug);
  if (!post) return {};

  return buildMetadata({
    locale,
    path: routes.post(slug),
    title: t(post.title, locale),
    description: t(post.excerpt, locale),
    image: post.image ?? BLOG_FALLBACK_IMAGE,
    type: "article",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const post = await fetchArticle(slug);
  if (!post) notFound();

  const { data: allPosts } = await fetchArticles();
  const more = allPosts.filter((item) => item.slug !== slug).slice(0, 2);
  const url = absolute(localePath(locale, routes.post(slug)));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            [
              { name: en ? "Home" : "হোম", path: routes.home },
              { name: en ? "Blog" : "ব্লগ", path: routes.blog },
              { name: t(post.title, locale), path: routes.post(slug) },
            ],
            locale,
          ),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: t(post.title, locale),
            description: t(post.excerpt, locale),
            image: absolute(post.image ?? BLOG_FALLBACK_IMAGE),
            datePublished: post.date,
            dateModified: post.date,
            author: { "@type": "Organization", name: site.legalName, url: site.url },
            publisher: { "@id": `${site.url}/#organization` },
            mainEntityOfPage: url,
          },
        ]}
      />

      <article>
        <header className="bg-teal-900 pt-28 pb-16 lg:pt-40 lg:pb-20">
          <div className="container-prose">
            <nav
              aria-label={en ? "Breadcrumb" : "ব্রেডক্রাম্ব"}
              className="flex items-center gap-1.5 font-display text-xs font-semibold tracking-widest text-white/60 uppercase"
            >
              <Link href={localePath(locale, routes.blog)} className="hover:text-white">
                {en ? "Blog" : "ব্লগ"}
              </Link>
              <Icon name="chevron-right" size={13} className="opacity-50" />
              <span className="text-brand-accent">{categoryLabel(post, locale)}</span>
            </nav>

            <h1 className="mt-5 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance text-white lg:text-5xl">
              {t(post.title, locale)}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/80">{t(post.excerpt, locale)}</p>
            <p className="mt-6 text-sm text-white/60">
              {post.author && `${t(post.author, locale)} · `}
              {post.date && `${formatDate(post.date, locale)} · `}
              {readingLabel(post, locale)}
            </p>
          </div>
        </header>

        <div className="container-prose -mt-8 lg:-mt-10">
          <div className="overflow-hidden rounded-lg">
            <Image
              src={post.image ?? BLOG_FALLBACK_IMAGE}
              alt=""
              width={1200}
              height={675}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        <Section tone="page">
          <div className="container-prose">
            <div
              className="prose-rich text-[17px] leading-relaxed text-stone-700"
              dangerouslySetInnerHTML={{ __html: t(post.bodyHtml, locale) }}
            />

            <div className="mt-12 border-t border-stone-200 pt-8">
              <ShareRow url={url} title={t(post.title, locale)} locale={locale} />
            </div>
          </div>
        </Section>
      </article>

      {more.length > 0 && (
        <Section tone="surface">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold tracking-tight text-stone-900">
              {en ? "Keep reading" : "আরও পড়ুন"}
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {more.map((item) => (
                <Card key={item.slug} className="group relative flex gap-5 p-5" interactive>
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-stone-100">
                    <Image src={item.image ?? BLOG_FALLBACK_IMAGE} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold tracking-wide text-brand-strong uppercase">
                      {categoryLabel(item, locale)}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg leading-snug font-bold text-stone-900">
                      <Link
                        href={localePath(locale, routes.post(item.slug))}
                        className="after:absolute after:inset-0"
                      >
                        {t(item.title, locale)}
                      </Link>
                    </h3>
                    <p className="mt-2 text-xs text-stone-400">
                      {item.date ? formatDate(item.date, locale) : readingLabel(item, locale)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaBand locale={locale} />
    </>
  );
}
