import type { Bi } from "@/lib/i18n";

/**
 * Single source of truth for company facts, routes and navigation.
 * Every claim here traces to the June 2026 email deck, the July 2026 overview
 * deck, or the live site. Anything unverified is marked TO_VERIFY in
 * `src/content/stats.ts` rather than being asserted quietly.
 */

export const site = {
  name: "DigiGram Ventures Ltd.",
  shortName: "DigiGram Ventures",
  tagline: { en: "Invest Now, Shape Tomorrow", bn: "আজ বিনিয়োগ করুন, আগামী গড়ুন" } as Bi,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://digigramventures.com",
  legalName: "DigiGram Ventures Ltd.",
  foundingLocation: "Dhaka, Bangladesh",
  address: {
    street: "Level 4, 27 Shaptak Square, Plot No. 380 (Old), 2 (New), Road No. 27 (Old), 16 (New)",
    locality: "Dhanmondi",
    region: "Dhaka",
    postalCode: "1205",
    country: "BD",
  },
  helpline: "+880 1761 720 230",
  helplineHref: "tel:+8801761720230",
  email: "info@digigramventures.com",
  officeHours: {
    en: "Sunday – Thursday, 9:00 – 18:00 (GMT+6)",
    bn: "রবিবার – বৃহস্পতিবার, সকাল ৯টা – সন্ধ্যা ৬টা (GMT+৬)",
  } as Bi,
  social: {
    facebook: "https://www.facebook.com/digigramventures",
    linkedin: "https://www.linkedin.com/company/digigram-ventures",
    youtube: "",
  },
  app: {
    playStore: "https://play.google.com/store/apps/details?id=com.digigramsaathi",
    appStore: "https://apps.apple.com/us/app/shathi/id6737144295",
    // Shathi Sheba is pre-launch; the listing does not exist yet. Anything
    // reading this must check for an empty string rather than render a badge
    // pointing at a 404.
    shebaPlayStore: "",
  },
  /** Google Analytics 4. Empty string disables the tag entirely. */
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID ?? "G-JLQYQDN2RZ",
  contactApi: "https://api.digigramventures.com/api/contact",
} as const;

/** Route table. Keep in sync with `src/app/[locale]/…`. */
export const routes = {
  home: "/",
  about: "/about",
  careers: "/about/careers",
  impact: "/impact",
  products: "/products",
  shathi: "/products/shathi",
  shathiSheba: "/products/shathi-sheba",
  shadhinFeed: "/products/shadhin-feed",
  projects: "/projects",
  project: (slug: string) => `/projects/${slug}`,
  invest: (slug: string) => `/projects/${slug}/invest`,
  blog: "/blog",
  post: (slug: string) => `/blog/${slug}`,
  contact: "/contact",
  login: "/login",
  otp: "/login/otp",
  registerProfile: "/register/profile",
  account: "/account",
  faq: "/faq",
  terms: "/terms",
  privacy: "/privacy",
  deleteAccount: "/delete-account",
} as const;

export type NavLink = {
  label: Bi;
  href: string;
  description?: Bi;
  /** Renders the item in a product brand colour inside the mega-menu. */
  brand?: "shathi" | "shathi-sheba" | "digigram";
};

export type NavItem = {
  label: Bi;
  href: string;
  children?: NavLink[];
  /** Two-column product panel vs. simple list. */
  layout?: "list" | "products";
};

/**
 * Primary navigation — four destinations, deliberately.
 *
 * It carried seven top-level items plus a six-entry About menu, and read as a
 * wall of similarly weighted words. Three changes:
 *
 *   - **Home is gone.** The logo is the home link on every site there is; the
 *     duplicate spent a slot for nothing.
 *   - **About lost its anchor list.** "Mission & Vision" and "Media & Awards"
 *     are sections of a page you are already scrolling; listing every anchor
 *     turns a menu into a table of contents.
 *   - **Contact moved to the utility area** beside Log in. It is an action, not
 *     a destination competing with Products and Impact.
 */
export const mainNav: NavItem[] = [
  {
    label: { en: "About Us", bn: "আমাদের সম্পর্কে" },
    href: routes.about,
    layout: "list",
    children: [
      { label: { en: "Who We Are", bn: "আমরা কারা" }, href: `${routes.about}#who-we-are` },
      {
        label: { en: "Meet the DigiGram Family", bn: "ডিজিগ্রাম পরিবার" },
        href: `${routes.about}#family`,
      },
      {
        label: { en: "Partners & Supporters", bn: "অংশীদার ও সহযোগী" },
        href: `${routes.about}#partners`,
      },
      { label: { en: "Careers", bn: "ক্যারিয়ার" }, href: routes.careers },
    ],
  },
  {
    label: { en: "Products", bn: "পণ্য ও সেবা" },
    href: routes.products,
    layout: "products",
    children: [
      {
        label: { en: "Shathi", bn: "সাথী" },
        href: routes.shathi,
        brand: "shathi",
        description: {
          en: "Invest in rural projects. Farmers get finance, inputs, training and a buyer.",
          bn: "গ্রামীণ প্রকল্পে বিনিয়োগ করুন। কৃষক পান অর্থ, উপকরণ, প্রশিক্ষণ ও নিশ্চিত বাজার।",
        },
      },
      {
        label: { en: "Shathi Sheba", bn: "সাথী সেবা" },
        href: routes.shathiSheba,
        brand: "shathi-sheba",
        description: {
          en: "The digital operating system for finance-ready, market-ready rural enterprises.",
          bn: "অর্থায়ন-প্রস্তুত ও বাজার-প্রস্তুত গ্রামীণ উদ্যোগের ডিজিটাল অপারেটিং সিস্টেম।",
        },
      },
      {
        label: { en: "Shadhin Cattle Feed", bn: "স্বাধীন গো-খাদ্য" },
        href: routes.shadhinFeed,
        brand: "digigram",
        description: {
          en: "DLS-compliant compound feed, validated at 900g average daily gain.",
          bn: "ডিএলএস-অনুমোদিত কম্পাউন্ড ফিড, দৈনিক ৯০০ গ্রাম ওজন বৃদ্ধিতে যাচাইকৃত।",
        },
      },
    ],
  },
  { label: { en: "Projects", bn: "প্রকল্প" }, href: routes.projects },
  { label: { en: "Impact", bn: "প্রভাব" }, href: routes.impact },
  { label: { en: "Blog", bn: "ব্লগ" }, href: routes.blog },
];

export const footerNav: { heading: Bi; links: NavLink[] }[] = [
  {
    heading: { en: "Explore", bn: "ঘুরে দেখুন" },
    links: [
      { label: { en: "Home", bn: "হোম" }, href: routes.home },
      { label: { en: "About Us", bn: "আমাদের সম্পর্কে" }, href: routes.about },
      { label: { en: "Projects", bn: "প্রকল্প" }, href: routes.projects },
      { label: { en: "Impact", bn: "প্রভাব" }, href: routes.impact },
      { label: { en: "Blog", bn: "ব্লগ" }, href: routes.blog },
      { label: { en: "Careers", bn: "ক্যারিয়ার" }, href: routes.careers },
      { label: { en: "Contact", bn: "যোগাযোগ" }, href: routes.contact },
    ],
  },
  {
    heading: { en: "Products", bn: "পণ্য ও সেবা" },
    links: [
      { label: { en: "Shathi", bn: "সাথী" }, href: routes.shathi, brand: "shathi" },
      {
        label: { en: "Shathi Sheba", bn: "সাথী সেবা" },
        href: routes.shathiSheba,
        brand: "shathi-sheba",
      },
      {
        label: { en: "Shadhin Cattle Feed", bn: "স্বাধীন গো-খাদ্য" },
        href: routes.shadhinFeed,
        brand: "digigram",
      },
      { label: { en: "All products", bn: "সব পণ্য" }, href: routes.products },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: { en: "Terms & Conditions", bn: "শর্তাবলি" }, href: routes.terms },
  { label: { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" }, href: routes.privacy },
  { label: { en: "FAQ", bn: "সাধারণ জিজ্ঞাসা" }, href: routes.faq },
  { label: { en: "Delete account", bn: "অ্যাকাউন্ট মুছুন" }, href: routes.deleteAccount },
];
