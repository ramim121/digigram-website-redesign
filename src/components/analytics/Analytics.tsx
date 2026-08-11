import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Google Analytics 4.
 *
 * Loaded with `strategy="afterInteractive"` rather than the raw async snippet:
 * gtag.js is ~90 kB and this audience is on low-end phones over patchy mobile
 * data. Deferring it keeps it out of the critical path, so it cannot delay
 * first paint or Largest Contentful Paint.
 *
 * `anonymize_ip` is on, and the tag is skipped entirely outside production and
 * whenever `NEXT_PUBLIC_GA_ID` is blank — so local development and preview
 * deployments never pollute the property with test traffic.
 */
export function Analytics() {
  const id = site.gaMeasurementId;
  if (!id || process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
