import Link from "next/link";
import { DigiGramLogo, BrandDot } from "@/components/brand/Logo";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Icon } from "@/components/ui/Icon";
import { footerNav, legalNav, site } from "@/lib/site";
import { localePath, t, type Locale } from "@/lib/i18n";

/**
 * Dark teal footer with the line-art village motif at 6% opacity — the one
 * element of the current site worth keeping, redrawn cleanly.
 */
export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-teal-900 text-white/75">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-repeat-x opacity-[0.07]"
        style={{
          backgroundImage: "url(/assets/brand/village-motif.png)",
          backgroundSize: "auto 160px",
          backgroundPosition: "left bottom",
        }}
      />

      <div className="relative container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <DigiGramLogo variant="white" className="h-7 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              {locale === "en"
                ? "Turning rural homes into micro-enterprises through inclusive finance, quality inputs, training and market access."
                : "অন্তর্ভুক্তিমূলক অর্থায়ন, মানসম্পন্ন উপকরণ, প্রশিক্ষণ ও বাজারে প্রবেশাধিকারের মাধ্যমে গ্রামীণ ঘরকে ক্ষুদ্র উদ্যোগে রূপান্তর।"}
            </p>

            <div className="mt-6 flex items-center gap-2">
              <SocialLink href={site.social.facebook} icon="facebook" label="Facebook" />
              <SocialLink href={site.social.linkedin} icon="linkedin" label="LinkedIn" />
              <SocialLink href={`mailto:${site.email}`} icon="mail" label="Email" />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <StoreBadge
                href={site.app.playStore}
                top={locale === "en" ? "Get it on" : "পাওয়া যাচ্ছে"}
                name="Google Play"
              />
              <StoreBadge
                href={site.app.appStore}
                top={locale === "en" ? "Download on the" : "ডাউনলোড করুন"}
                name="App Store"
              />
            </div>
          </div>

          {/* Link columns */}
          {footerNav.map((column) => (
            <nav key={column.heading.en} className="lg:col-span-2" aria-label={t(column.heading, locale)}>
              <h2 className="font-display text-xs font-bold tracking-widest text-white uppercase">
                {t(column.heading, locale)}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localePath(locale, link.href)}
                      className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.brand && <BrandDot brand={link.brand} />}
                      {t(link.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="lg:col-span-4">
            <h2 className="font-display text-xs font-bold tracking-widest text-white uppercase">
              {locale === "en" ? "Contact" : "যোগাযোগ"}
            </h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-white/70">
              <p className="flex gap-2.5">
                <Icon name="map-pin" size={17} className="mt-0.5 shrink-0 text-white/45" />
                <span>
                  {site.address.street}, {site.address.locality}, {site.address.region}-
                  {site.address.postalCode}, Bangladesh
                </span>
              </p>
              <p className="flex gap-2.5">
                <Icon name="phone" size={17} className="mt-0.5 shrink-0 text-white/45" />
                <a href={site.helplineHref} className="hover:text-white">
                  {site.helpline}
                </a>
              </p>
              <p className="flex gap-2.5">
                <Icon name="mail" size={17} className="mt-0.5 shrink-0 text-white/45" />
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </p>
              <p className="flex gap-2.5">
                <Icon name="clock" size={17} className="mt-0.5 shrink-0 text-white/45" />
                <span>{t(site.officeHours, locale)}</span>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/12 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/55">
            © {year} {site.legalName}
            {locale === "en" ? " · All rights reserved." : " · সর্বস্বত্ব সংরক্ষিত।"}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {legalNav.map((link) => (
              <Link
                key={link.href}
                href={localePath(locale, link.href)}
                className="text-xs text-white/55 transition-colors hover:text-white"
              >
                {t(link.label, locale)}
              </Link>
            ))}
            <LanguageToggle locale={locale} invert />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: "facebook" | "linkedin" | "mail";
  label: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
    >
      <Icon name={icon} size={17} />
    </a>
  );
}

function StoreBadge({ href, top, name }: { href: string; top: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-md border border-white/20 px-3.5 py-2 transition-colors hover:border-white/45"
    >
      <Icon name="download" size={18} className="text-white/70" />
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] text-white/55">{top}</span>
        <span className="font-display text-[13px] font-bold text-white">{name}</span>
      </span>
    </a>
  );
}
