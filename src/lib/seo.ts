import type { Metadata } from "next";
import { site } from "@/lib/site";
import { htmlLang, localePath, type Locale } from "@/lib/i18n";

/**
 * SEO helpers.
 *
 * Every page gets a canonical URL and a full set of `hreflang` alternates
 * (en-BD, bn-BD, x-default) pointing at real crawlable URLs — English at the
 * root, Bangla under /bn. That pairing is the single highest-value technical
 * SEO decision on a bilingual site: without it the two language versions
 * compete with each other instead of reinforcing each other.
 */

export function absolute(path: string): string {
  return new URL(path, site.url).toString();
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image = "/assets/photos/community-meeting.webp",
  type = "website",
  noindex,
  keywords,
}: {
  locale: Locale;
  /** Locale-free route, e.g. "/projects". */
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  keywords?: string[];
}): Metadata {
  const canonical = absolute(localePath(locale, path));

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        "en-BD": absolute(localePath("en", path)),
        "bn-BD": absolute(localePath("bn", path)),
        "x-default": absolute(localePath("en", path)),
      },
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      type,
      url: canonical,
      siteName: site.shortName,
      locale: htmlLang[locale].replace("-", "_"),
      alternateLocale: locale === "en" ? ["bn_BD"] : ["en_BD"],
      title,
      description,
      images: [{ url: absolute(image), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absolute(image)],
    },
  };
}

/* --------------------------------------------------------------- JSON-LD -- */

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.shortName,
    url: site.url,
    logo: absolute("/assets/brand/digigram-wordmark-teal.png"),
    description:
      locale === "en"
        ? "A for-profit impact enterprise in Bangladesh turning rural homes into micro-enterprises through inclusive finance, quality inputs, training and market access."
        : "বাংলাদেশের একটি মুনাফাভিত্তিক ইমপ্যাক্ট প্রতিষ্ঠান, যা অন্তর্ভুক্তিমূলক অর্থায়ন, মানসম্পন্ন উপকরণ, প্রশিক্ষণ ও বাজারে প্রবেশাধিকারের মাধ্যমে গ্রামীণ ঘরকে ক্ষুদ্র উদ্যোগে রূপান্তর করে।",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.helpline,
        email: site.email,
        contactType: "customer support",
        areaServed: "BD",
        availableLanguage: ["Bengali", "English"],
      },
    ],
    sameAs: [site.social.facebook, site.social.linkedin].filter(Boolean),
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.shortName,
    inLanguage: htmlLang[locale],
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(localePath(locale, item.path)),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Serialises a JSON-LD payload for injection.
 * `<` is escaped because it is the one character that can break out of a
 * <script> block. The component lives in `components/seo/JsonLd.tsx`.
 */
export function serialiseJsonLd(data: object | object[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
