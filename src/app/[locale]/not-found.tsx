import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/lib/site";

/**
 * 404.
 *
 * This file sits inside `[locale]` because that segment is the root layout —
 * a not-found at `app/` would have no <html> to render into. It is rendered
 * for both locales, so the copy is bilingual on the same page rather than
 * guessing which language the visitor wanted.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-5 py-32">
      <div className="w-full max-w-xl text-center">
        <Image
          src="/assets/brand/empty-state.png"
          alt=""
          width={260}
          height={260}
          className="mx-auto h-40 w-auto"
        />

        <p className="mt-8 font-mono text-sm font-bold text-stone-400">404</p>

        <h1 className="mt-3 font-display text-3xl leading-tight font-extrabold tracking-tight text-stone-900 lg:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-stone-600">
          The link may be old, or the project may have closed. Everything open is on the projects
          page.
        </p>

        <p lang="bn" className="mt-5 border-t border-stone-200 pt-5 text-[15px] leading-relaxed text-stone-600">
          পাতাটি খুঁজে পাওয়া যায়নি। লিংকটি পুরোনো হতে পারে, অথবা প্রকল্পটি শেষ হয়ে থাকতে পারে। চলমান
          সবকিছু প্রকল্প পাতায় আছে।
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href={routes.projects} icon="arrow-right" size="lg">
            See open projects
          </ButtonLink>
          <ButtonLink href={routes.home} variant="secondary" size="lg">
            Go home
          </ButtonLink>
        </div>

        <p className="mt-8 text-sm text-stone-500">
          <Link href={routes.contact} className="font-semibold text-brand-strong hover:underline">
            Contact us
          </Link>{" "}
          if you followed a link from somewhere and it should have worked.
        </p>
      </div>
    </div>
  );
}
