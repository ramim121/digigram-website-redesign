"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/auth/session";
import { Card, Note, StatBlock } from "@/components/ui/Primitives";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Icon } from "@/components/ui/Icon";
import { localePath, formatBdt, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";
import { useLoginHref } from "@/lib/auth/useLoginHref";

/**
 * "My investments" — a stub, and honest about it.
 *
 * The tab structure and empty states are real so the page can be wired to the
 * portfolio API without a redesign. It shows zeroes rather than invented
 * holdings: a demo account with fictional returns would be misleading.
 */
export function AccountStub({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const router = useRouter();
  const { user, ready, signOut } = useSession();
  const loginHref = useLoginHref(locale);

  useEffect(() => {
    if (ready && !user) router.replace(loginHref);
  }, [ready, user, router, loginHref]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 pt-24">
        <p className="text-sm text-stone-500">{en ? "Loading…" : "লোড হচ্ছে…"}</p>
      </div>
    );
  }

  const empty = (label: string, body: string) => (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white px-8 py-14 text-center">
      <Icon name="wallet" size={28} className="mx-auto text-stone-300" />
      <h3 className="mt-4 font-display text-lg font-bold text-stone-900">{label}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[15px] text-stone-600">{body}</p>
      <ButtonLink href={localePath(locale, routes.projects)} className="mt-6" icon="arrow-right">
        {en ? "Browse open projects" : "চলমান প্রকল্প দেখুন"}
      </ButtonLink>
    </div>
  );

  return (
    <div className="bg-stone-50 pt-28 pb-20 lg:pt-36">
      <div className="container-page">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="eyebrow">{en ? "My account" : "আমার অ্যাকাউন্ট"}</p>
            <h1 className="mt-3 font-display text-3xl leading-tight font-extrabold tracking-tight text-stone-900 lg:text-4xl">
              {en ? `Assalamu Alaikum, ${user.name}` : `আসসালামু আলাইকুম, ${user.name}`}
            </h1>
            <p className="mt-2 text-stone-600">
              {user.phone}
              {user.district ? ` · ${user.district}` : ""}
            </p>
          </div>
          <div className="flex gap-3">
            <ButtonLink href={localePath(locale, routes.registerProfile)} variant="secondary">
              {en ? "Edit profile" : "প্রোফাইল সম্পাদনা"}
            </ButtonLink>
            <Button
              variant="ghost"
              onClick={() => {
                signOut();
                router.push(localePath(locale, routes.home));
              }}
            >
              {en ? "Log out" : "লগ আউট"}
            </Button>
          </div>
        </div>

        <Card className="mt-9 grid gap-8 p-8 sm:grid-cols-3">
          <StatBlock
            size="sm"
            value={formatBdt(0, locale, { variant: "data" })}
            label={en ? "Active investment" : "চলমান বিনিয়োগ"}
          />
          <StatBlock
            size="sm"
            value={formatBdt(0, locale, { variant: "data" })}
            label={en ? "Matured" : "মেয়াদপূর্ণ"}
          />
          <StatBlock
            size="sm"
            value={formatBdt(0, locale, { variant: "data" })}
            label={en ? "Total returns received" : "প্রাপ্ত মোট রিটার্ন"}
          />
        </Card>

        <div className="mt-10">
          <Tabs
            items={[
              {
                id: "active",
                label: en ? "Active" : "চলমান",
                content: empty(
                  en ? "No active investments yet" : "এখনো কোনো চলমান বিনিয়োগ নেই",
                  en
                    ? "When you fund a project, its progress, milestones and monthly reports appear here."
                    : "কোনো প্রকল্পে অর্থায়ন করলে তার অগ্রগতি, মাইলফলক ও মাসিক প্রতিবেদন এখানে দেখা যাবে।",
                ),
              },
              {
                id: "matured",
                label: en ? "Matured" : "মেয়াদপূর্ণ",
                content: empty(
                  en ? "Nothing has matured yet" : "এখনো কিছু মেয়াদপূর্ণ হয়নি",
                  en
                    ? "Completed cycles and the returns paid on them will be listed here."
                    : "সম্পন্ন চক্র ও তাতে পরিশোধিত রিটার্ন এখানে তালিকাভুক্ত হবে।",
                ),
              },
              {
                id: "documents",
                label: en ? "Documents" : "নথিপত্র",
                content: empty(
                  en ? "No documents yet" : "এখনো কোনো নথি নেই",
                  en
                    ? "Investment agreements, statements and payout receipts will be downloadable here."
                    : "বিনিয়োগ চুক্তি, স্টেটমেন্ট ও পরিশোধের রসিদ এখান থেকে ডাউনলোড করা যাবে।",
                ),
              },
            ]}
          />
        </div>

        <Note tone="info" icon="info" className="mt-10">
          {en ? (
            <>
              Portfolio data is not connected yet. Investments made in the Shathi app are visible
              there in the meantime.{" "}
              <Link href={localePath(locale, routes.contact)} className="font-semibold underline">
                Contact us
              </Link>{" "}
              for a statement.
            </>
          ) : (
            <>
              পোর্টফোলিও তথ্য এখনো সংযুক্ত হয়নি। ততদিন সাথী অ্যাপে করা বিনিয়োগ সেখানেই দেখা যাবে।
              স্টেটমেন্টের জন্য{" "}
              <Link href={localePath(locale, routes.contact)} className="font-semibold underline">
                যোগাযোগ করুন
              </Link>
              ।
            </>
          )}
        </Note>
      </div>
    </div>
  );
}
