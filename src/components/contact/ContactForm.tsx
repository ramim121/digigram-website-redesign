"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Note } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TextField, SelectField, TextAreaField, CheckboxField } from "@/components/ui/Field";
import { t, type Bi, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * Contact form with real states: idle, submitting, error and success.
 *
 * The current site reloads the page on submit and gives no confirmation; this
 * one posts in place and replaces the form with a success panel. Labels are
 * real <label> elements, not placeholders, and validation is inline.
 *
 * `?topic=partner` / `?topic=feed` deep-links preselect the enquiry type, so
 * the CTAs on the product pages land somewhere useful.
 */

const TOPICS: { value: string; label: Bi }[] = [
  { value: "investor", label: { en: "I want to invest", bn: "আমি বিনিয়োগ করতে চাই" } },
  { value: "farmer", label: { en: "I am a farmer or producer", bn: "আমি একজন কৃষক বা উৎপাদক" } },
  { value: "partner", label: { en: "Bank, MFI or institutional partner", bn: "ব্যাংক, এমএফআই বা প্রাতিষ্ঠানিক অংশীদার" } },
  { value: "buyer", label: { en: "B2B buyer or supplier", bn: "বিটুবি ক্রেতা বা সরবরাহকারী" } },
  { value: "feed", label: { en: "Shadhin Cattle Feed enquiry", bn: "স্বাধীন গো-খাদ্য সংক্রান্ত" } },
  { value: "press", label: { en: "Press or media", bn: "সংবাদমাধ্যম" } },
  { value: "other", label: { en: "Something else", bn: "অন্য কিছু" } },
];

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const params = useSearchParams();
  const presetTopic = params.get("topic") ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    topic: TOPICS.some((topic) => topic.value === presetTopic) ? presetTopic : "",
    subject: "",
    message: "",
    consent: false,
  });

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2)
      next.name = en ? "Please enter your name." : "আপনার নাম লিখুন।";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = en ? "Enter a valid email address." : "সঠিক ইমেইল ঠিকানা দিন।";
    if (values.phone && !/^[\d\s+-]{6,}$/.test(values.phone))
      next.phone = en ? "Enter a valid phone number." : "সঠিক ফোন নম্বর দিন।";
    if (!values.topic) next.topic = en ? "Choose an option." : "একটি বিকল্প বাছুন।";
    if (values.message.trim().length < 10)
      next.message = en ? "Tell us a little more (10 characters minimum)." : "একটু বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)।";
    if (!values.consent)
      next.consent = en ? "Please accept the privacy notice." : "গোপনীয়তা নোটিশে সম্মতি দিন।";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      /**
       * The live endpoint validates with Joi `{ name, email, subject, message }`
       * and rejects unknown keys, so `phone`, `topic` and `locale` cannot be
       * sent as separate fields — they are folded into `subject` and `message`
       * instead. Move them to real columns once the API accepts them.
       */
      const topicLabel = TOPICS.find((entry) => entry.value === values.topic);
      const subject =
        values.subject.trim() ||
        (topicLabel ? t(topicLabel.label, "en") : en ? "Website enquiry" : "ওয়েবসাইট থেকে জিজ্ঞাসা");

      const message = [
        values.message,
        "",
        "---",
        `Enquiry type: ${topicLabel ? t(topicLabel.label, "en") : values.topic}`,
        values.phone ? `Phone: ${values.phone}` : null,
        `Submitted from: digigramventures.com (${locale})`,
      ]
        .filter((line) => line !== null)
        .join("\n");

      const response = await fetch(site.contactApi, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: values.name, email: values.email, subject, message }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Card className="p-8 text-center lg:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-bg text-success">
          <Icon name="check" size={28} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold text-stone-900">
          {en ? "Message sent" : "বার্তা পাঠানো হয়েছে"}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-stone-600">
          {en
            ? "Thank you. A member of the team will reply within two working days. For anything urgent, call the helpline."
            : "ধন্যবাদ। দুই কর্মদিবসের মধ্যে দলের একজন সদস্য উত্তর দেবেন। জরুরি প্রয়োজনে হেল্পলাইনে কল করুন।"}
        </p>
        <a
          href={site.helplineHref}
          className="mt-6 inline-flex items-center gap-2 font-display font-semibold text-brand-strong"
        >
          <Icon name="phone" size={17} />
          {site.helpline}
        </a>
      </Card>
    );
  }

  return (
    <Card className="p-7 lg:p-9">
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="name"
            label={en ? "Full name" : "পুরো নাম"}
            autoComplete="name"
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            error={errors.name}
            required
          />
          <TextField
            id="email"
            label={en ? "Email" : "ইমেইল"}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            error={errors.email}
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="phone"
            label={en ? "Phone (optional)" : "ফোন (ঐচ্ছিক)"}
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
            error={errors.phone}
          />
          <SelectField
            id="topic"
            label={en ? "I am…" : "আমি…"}
            value={values.topic}
            onChange={(event) => set("topic", event.target.value)}
            error={errors.topic}
            required
          >
            <option value="">{en ? "Choose one" : "একটি বাছুন"}</option>
            {TOPICS.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {t(topic.label, locale)}
              </option>
            ))}
          </SelectField>
        </div>

        <TextField
          id="subject"
          label={en ? "Subject (optional)" : "বিষয় (ঐচ্ছিক)"}
          value={values.subject}
          onChange={(event) => set("subject", event.target.value)}
        />

        <TextAreaField
          id="message"
          label={en ? "Message" : "বার্তা"}
          value={values.message}
          onChange={(event) => set("message", event.target.value)}
          error={errors.message}
          required
        />

        <CheckboxField
          id="privacy"
          checked={values.consent}
          onChange={(event) => set("consent", event.target.checked)}
          error={errors.consent}
          label={
            en
              ? "I agree that DigiGram Ventures may store and use these details to respond to my enquiry."
              : "আমি সম্মত যে ডিজিগ্রাম ভেঞ্চারস আমার জিজ্ঞাসার উত্তর দিতে এই তথ্য সংরক্ষণ ও ব্যবহার করতে পারে।"
          }
        />

        {status === "error" && (
          <Note tone="warn" icon="alert-triangle">
            {en ? (
              <>
                We couldn&apos;t send that just now. Please try again, or email{" "}
                <a href={`mailto:${site.email}`} className="font-semibold underline">
                  {site.email}
                </a>
                .
              </>
            ) : (
              <>
                এই মুহূর্তে পাঠানো যায়নি। আবার চেষ্টা করুন, অথবা{" "}
                <a href={`mailto:${site.email}`} className="font-semibold underline">
                  {site.email}
                </a>{" "}
                ঠিকানায় ইমেইল করুন।
              </>
            )}
          </Note>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          icon="arrow-right"
          disabled={status === "submitting"}
        >
          {status === "submitting"
            ? en
              ? "Sending…"
              : "পাঠানো হচ্ছে…"
            : en
              ? "Send message"
              : "বার্তা পাঠান"}
        </Button>
      </form>
    </Card>
  );
}
