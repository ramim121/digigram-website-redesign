import type { Metadata, Viewport } from "next";
import {
  Montserrat,
  Open_Sans,
  IBM_Plex_Mono,
  Anek_Bangla,
  Noto_Sans_Bengali,
} from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/auth/session";
import { getSessionUser } from "@/lib/auth/session";
import { s3Url } from "@/lib/api/config";
import { Analytics } from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { htmlLang, isLocale, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * Root layout.
 *
 * It lives under `[locale]` rather than at `app/` so that `<html lang>` is
 * correct per language without making any page dynamic — the locale comes from
 * the route segment, which is statically known for both `en` and `bn`.
 *
 * Fonts are self-hosted by `next/font`: no request to a third-party origin, one
 * preloaded woff2 per family, `display: swap` so text paints immediately on a
 * slow rural connection. Latin and Bangla families are both declared; which
 * pair is active is decided in `globals.css` by `[lang="bn"]`.
 */

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-open-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const anekBangla = Anek_Bangla({
  subsets: ["bengali"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-anek-bangla",
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-bengali",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#216559",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "DigiGram Ventures",
    template: "%s · DigiGram Ventures",
  },
  icons: {
    icon: [{ url: "/assets/brand/digigram-square-teal.png", type: "image/png" }],
    apple: "/assets/brand/digigram-square-teal.png",
  },
  formatDetection: { telephone: false },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  /**
   * Who is signed in, read from the httpOnly cookie on the server.
   *
   * Only a display name and an avatar URL are passed to the header — never the
   * token, and none of the identity fields the account pages use. Reading it
   * here rather than in client code is also what stops the header rendering a
   * "Log in" link for a split second before hydration corrects it.
   *
   * The cost is that every page becomes dynamic. That is already true of the
   * account area, and for the marketing pages the alternative — a cached header
   * showing the wrong person — is worse.
   */
  const user = await getSessionUser();
  const sessionUser = user
    ? {
        name: user.fullName?.trim() || user.phoneNumber || "Investor",
        image: s3Url("profile", user.profileImage),
      }
    : null;

  return (
    <html
      lang={htmlLang[locale]}
      suppressHydrationWarning
      className={`${montserrat.variable} ${openSans.variable} ${plexMono.variable} ${anekBangla.variable} ${notoBengali.variable}`}
    >
      <body>
        <JsonLd data={[organizationSchema(locale), websiteSchema(locale)]} />
        <SessionProvider>
          <Header locale={locale} sessionUser={sessionUser} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
