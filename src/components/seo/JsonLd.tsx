import { serialiseJsonLd } from "@/lib/seo";

/** Renders a structured-data block. One place, so escaping is handled once. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialiseJsonLd(data) }}
    />
  );
}
