import Image from "next/image";
import clsx from "clsx";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ShathiShebaLogo } from "@/components/brand/Logo";
import { shebaRails } from "@/content/sheba";
import { localePath, t, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * The Shathi Sheba band on the homepage.
 *
 * WHY IT IS HERE
 * The homepage told one story — invest in a Shathi project — and mentioned
 * Shathi Sheba once, inside a sentence about the product range. A reader could
 * scroll the entire page and not learn that DigiGram builds the software the
 * farmer side runs on. This band is the counterweight: a full-width section
 * that states what Shathi Sheba is, shows it running, and hands off to the
 * product page.
 *
 * WHY IT LOOKS DIFFERENT FROM EVERYTHING AROUND IT
 * It carries `data-brand="shathi-sheba"`, which swaps the token layer to wine,
 * and it sits on a solid `bg-brand-strong` rather than the tinted canvas the
 * Shathi projects band uses. That is deliberate contrast, not decoration: the
 * two bands are adjacent on the page, both are product bands, and if they
 * shared a treatment the reader would scroll past the second assuming it was
 * more of the first. Wine on dark also lets the app screenshots — which are
 * themselves wine-on-cream — sit in the section as artwork rather than as two
 * pale rectangles.
 *
 * The rails are the four in `content/sheba.ts`, the same four words as the
 * company pillars, because Shathi Sheba is the software under the model rather
 * than a second model competing with it.
 *
 * WHERE THE BAND STOPS.
 * It names the four rails and shows two screens, then hands off. The full
 * feature list lives once, on the product page, under "In the app" — an
 * earlier draft printed the same six capabilities in both places, which made
 * the product page read as a reprint of the homepage and gave a reader no
 * reason to click through. A homepage band should leave something behind it.
 */
export function ShebaBand({ locale }: { locale: Locale }) {
  const en = locale === "en";

  return (
    <section
      data-brand="shathi-sheba"
      id="shathi-sheba"
      className="section relative isolate overflow-hidden bg-brand-strong"
    >
      {/* A single soft wash off the top-right, so the flat brand fill has some
          depth behind the screenshots without costing an image request. */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 -z-10 size-[36rem] rounded-full bg-white/[0.07] blur-3xl"
      />

      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* ------------------------------------------------------ copy -- */}
          <div className="lg:col-span-6">
            <ShathiShebaLogo invert locale={locale} className="h-8" />

            <h2 className="mt-6 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-white lg:text-4xl">
              {en
                ? "The other side of the cycle now has software"
                : "চক্রের অন্য প্রান্তেও এখন সফটওয়্যার"}
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/80">
              {en
                ? "Investment reaches a farmer who is already commercially invisible — no credit record, no published price, no buyer on paper. Shathi Sheba is the app that changes that: it turns scattered field information into one verified enterprise profile a bank, a buyer and a project can all read."
                : "বিনিয়োগ পৌঁছায় এমন কৃষকের কাছে, যিনি বাণিজ্যিকভাবে ইতিমধ্যেই অদৃশ্য — ঋণের নথি নেই, প্রকাশিত দাম নেই, কাগজে ক্রেতা নেই। সাথী সেবা সেটাই বদলায়: ছড়িয়ে থাকা মাঠের তথ্যকে এটি একটি যাচাইকৃত উদ্যোগ প্রোফাইলে রূপ দেয়, যা ব্যাংক, ক্রেতা ও প্রকল্প — সবাই পড়তে পারে।"}
            </p>

            {/* Four rails as rows rather than a 2×2 of cards: at this width a
                card grid would set four equal boxes against the screenshots and
                fight them for attention. Rows read as a list and let the
                artwork hold the right-hand side.

                Title and one line only. The rails' `detail` field — what each
                one actually outputs — is what the products page prints, so the
                two pages form a ladder instead of repeating a paragraph
                verbatim two scrolls apart. */}
            <ul className="mt-9 space-y-3.5">
              {shebaRails.map((rail) => (
                <li key={rail.key} className="flex items-center gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/12 text-white ring-1 ring-white/15">
                    <Icon name={rail.icon} size={18} />
                  </span>
                  <p className="min-w-0 font-display text-[15px] font-bold text-white">
                    {t(rail.title, locale)}
                    <span className="mx-2 text-white/25" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-semibold text-white/70">{t(rail.line, locale)}</span>
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink
                href={localePath(locale, routes.shathiSheba)}
                variant="inverse"
                size="lg"
                icon="arrow-right"
              >
                {en ? "Explore Shathi Sheba" : "সাথী সেবা দেখুন"}
              </ButtonLink>
              <ButtonLink
                href={localePath(locale, routes.projects)}
                variant="secondary"
                size="lg"
                className="border-white/40 text-white hover:border-white/70 hover:bg-white/10"
              >
                {en ? "See partner projects" : "পার্টনার প্রকল্প দেখুন"}
              </ButtonLink>
            </div>
          </div>

          {/* ----------------------------------------------- screenshots -- */}
          {/*
            Two screens, offset, showing one continuous idea: the app prints the
            price before the farmer commits, then tracks the sale to payment.
            Chosen over a home screen because a home screen proves an app exists
            and these prove what it is *for*.

            `aria-hidden` on the wrapper with a single description below: two
            long Bangla alt texts read aloud in sequence is worse for a screen
            reader than one sentence that says what the pair demonstrates.
          */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto flex max-w-lg justify-center gap-4 sm:gap-6">
              <PhoneFrame
                src="/assets/app/sheba/sale-earnings.png"
                className="mt-10 w-1/2 max-w-[15rem]"
              />
              <PhoneFrame src="/assets/app/sheba/sale-progress.png" className="w-1/2 max-w-[15rem]" />
            </div>

            <p className="mt-7 text-center text-sm leading-relaxed text-white/55">
              {en
                ? "Left: every deduction and the net price per kilogram, shown before the farmer agrees to sell. Right: the same sale tracked through six verified steps to payment."
                : "বাঁয়ে: বিক্রিতে রাজি হওয়ার আগেই প্রতিটি কর্তন ও প্রতি কেজির নিট দাম। ডানে: একই বিক্রি ছয়টি যাচাইকৃত ধাপে পেমেন্ট পর্যন্ত।"}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/**
 * A screenshot in a phone-shaped frame.
 *
 * The captures are long scrolls cropped to roughly 1:2, so the frame fixes the
 * aspect and pins the image to the top: any future screenshot of a different
 * length then crops rather than distorting the frame or squashing the content.
 */
function PhoneFrame({ src, className }: { src: string; className?: string }) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-[1.75rem] bg-white shadow-2xl ring-1 ring-white/20",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        width={1080}
        height={2180}
        sizes="(min-width: 1024px) 240px, 45vw"
        className="h-auto w-full"
      />
    </div>
  );
}
