import type { Bi } from "@/lib/i18n";

/**
 * Booking types and payment-method rules. Client-safe — no backend imports —
 * so the checkout form and the server routes share one definition of what a
 * payment method requires.
 */

/** The API's own values. Do not localise these; they are sent over the wire. */
export type PaymentMethod = "beftn" | "npsb" | "rtgs" | "cash" | "cheque";

export type PaymentMethodSpec = {
    value: PaymentMethod;
    label: Bi;
    /** Bank transfers need the investor's own account on file. */
    needsUserBank: boolean;
    /** Cash and cheque are collected in person, so we need when and where. */
    needsCollection: boolean;
    /** Verbatim from the app, so both channels tell people the same thing. */
    steps: Bi[];
};

const DIGIGRAM = "Digigram Ventures Limited";

export const PAYMENT_METHODS: PaymentMethodSpec[] = [
    {
        value: "beftn",
        label: { en: "Fund transfer — BEFTN", bn: "ফান্ড ট্রান্সফার — বিইএফটিএন" },
        needsUserBank: true,
        needsCollection: false,
        steps: [
            {
                en: "Choose the BEFTN transfer option in your banking platform.",
                bn: "আপনার ব্যাংকিং প্ল্যাটফর্মে বিইএফটিএন ট্রান্সফার অপশনটি বেছে নিন।",
            },
            {
                en: `Add ${DIGIGRAM} as a beneficiary using the bank details above.`,
                bn: `উপরের ব্যাংক তথ্য ব্যবহার করে ${DIGIGRAM}-কে সুবিধাভোগী হিসেবে যোগ করুন।`,
            },
            {
                en: "Complete the transfer and save the confirmation receipt.",
                bn: "ট্রান্সফার সম্পন্ন করুন এবং নিশ্চিতকরণ রসিদটি সংরক্ষণ করুন।",
            },
            {
                en: "Upload the confirmation or screenshot below.",
                bn: "নিচে নিশ্চিতকরণ বা স্ক্রিনশট আপলোড করুন।",
            },
            {
                en: `${DIGIGRAM} will confirm the payment upon receipt of funds.`,
                bn: `অর্থ পাওয়ার পর ${DIGIGRAM} পেমেন্ট নিশ্চিত করবে।`,
            },
        ],
    },
    {
        value: "npsb",
        label: { en: "Fund transfer — NPSB", bn: "ফান্ড ট্রান্সফার — এনপিএসবি" },
        needsUserBank: true,
        needsCollection: false,
        steps: [
            {
                en: "Choose the NPSB transfer option in your banking platform.",
                bn: "আপনার ব্যাংকিং প্ল্যাটফর্মে এনপিএসবি ট্রান্সফার অপশনটি বেছে নিন।",
            },
            {
                en: `Add ${DIGIGRAM} as a beneficiary using the bank details above.`,
                bn: `উপরের ব্যাংক তথ্য ব্যবহার করে ${DIGIGRAM}-কে সুবিধাভোগী হিসেবে যোগ করুন।`,
            },
            {
                en: "Complete the transfer and save the confirmation receipt.",
                bn: "ট্রান্সফার সম্পন্ন করুন এবং নিশ্চিতকরণ রসিদটি সংরক্ষণ করুন।",
            },
            {
                en: "Upload the confirmation or screenshot below.",
                bn: "নিচে নিশ্চিতকরণ বা স্ক্রিনশট আপলোড করুন।",
            },
            {
                en: `${DIGIGRAM} will confirm the payment upon receipt of funds.`,
                bn: `অর্থ পাওয়ার পর ${DIGIGRAM} পেমেন্ট নিশ্চিত করবে।`,
            },
        ],
    },
    {
        value: "rtgs",
        label: { en: "Fund transfer — RTGS", bn: "ফান্ড ট্রান্সফার — আরটিজিএস" },
        needsUserBank: true,
        needsCollection: false,
        steps: [
            {
                en: "Choose the RTGS transfer option in your banking platform.",
                bn: "আপনার ব্যাংকিং প্ল্যাটফর্মে আরটিজিএস ট্রান্সফার অপশনটি বেছে নিন।",
            },
            {
                en: `Add ${DIGIGRAM} as a beneficiary using the bank details above.`,
                bn: `উপরের ব্যাংক তথ্য ব্যবহার করে ${DIGIGRAM}-কে সুবিধাভোগী হিসেবে যোগ করুন।`,
            },
            {
                en: "Complete the transfer and save the confirmation receipt.",
                bn: "ট্রান্সফার সম্পন্ন করুন এবং নিশ্চিতকরণ রসিদটি সংরক্ষণ করুন।",
            },
            {
                en: "Upload the confirmation or screenshot below.",
                bn: "নিচে নিশ্চিতকরণ বা স্ক্রিনশট আপলোড করুন।",
            },
            {
                en: `${DIGIGRAM} will confirm the payment upon receipt of funds.`,
                bn: `অর্থ পাওয়ার পর ${DIGIGRAM} পেমেন্ট নিশ্চিত করবে।`,
            },
        ],
    },
    {
        value: "cash",
        label: { en: "Cash deposit", bn: "নগদ জমা" },
        needsUserBank: false,
        needsCollection: true,
        steps: [
            {
                en: "Tell us when and where our representative should collect the cash.",
                bn: "আমাদের প্রতিনিধি কখন ও কোথায় নগদ সংগ্রহ করবেন তা জানান।",
            },
            {
                en: "Keep the amount ready at the agreed time.",
                bn: "নির্ধারিত সময়ে অর্থ প্রস্তুত রাখুন।",
            },
            {
                en: "Collect the money receipt from the representative.",
                bn: "প্রতিনিধির কাছ থেকে মানি রসিদ সংগ্রহ করুন।",
            },
            {
                en: "Upload a photo of that receipt below.",
                bn: "নিচে সেই রসিদের একটি ছবি আপলোড করুন।",
            },
            {
                en: `${DIGIGRAM} will confirm the payment upon receipt of funds.`,
                bn: `অর্থ পাওয়ার পর ${DIGIGRAM} পেমেন্ট নিশ্চিত করবে।`,
            },
        ],
    },
    {
        value: "cheque",
        label: { en: "Cheque collection", bn: "চেক সংগ্রহ" },
        needsUserBank: false,
        needsCollection: true,
        steps: [
            {
                en: `Write the cheque in favour of ${DIGIGRAM}.`,
                bn: `${DIGIGRAM}-এর অনুকূলে চেকটি লিখুন।`,
            },
            {
                en: "Tell us when and where our representative should collect it.",
                bn: "আমাদের প্রতিনিধি কখন ও কোথায় সেটি সংগ্রহ করবেন তা জানান।",
            },
            {
                en: "Hand the cheque over at the agreed time.",
                bn: "নির্ধারিত সময়ে চেকটি হস্তান্তর করুন।",
            },
            {
                en: "Upload a photo of the cheque below.",
                bn: "নিচে চেকটির একটি ছবি আপলোড করুন।",
            },
            {
                en: `${DIGIGRAM} will confirm the payment once the cheque clears.`,
                bn: `চেক ক্লিয়ার হলে ${DIGIGRAM} পেমেন্ট নিশ্চিত করবে।`,
            },
        ],
    },
];

export function paymentMethodSpec(value: string): PaymentMethodSpec | undefined {
    return PAYMENT_METHODS.find((method) => method.value === value);
}

/** JPEG and PNG only, enforced by the backend too. PDFs are rejected there. */
export const PROOF_ACCEPT = "image/jpeg,image/png";
export const PROOF_MAX_BYTES = 10 * 1024 * 1024;

/**
 * The backend wants `YYYY-MM-DD HH:mm:ss`, not an ISO string with a `T` and a
 * timezone — its Joi rule is a plain string pattern and an ISO value fails it.
 * `<input type="datetime-local">` gives `YYYY-MM-DDTHH:mm`, so the `T` becomes
 * a space and seconds are appended.
 */
export function toApiDateTime(datetimeLocal: string): string {
    if (!datetimeLocal) return "";
    const [date, time = "00:00"] = datetimeLocal.split("T");
    const withSeconds = time.length === 5 ? `${time}:00` : time;
    return `${date} ${withSeconds}`;
}

/* --------------------------------------------------------------- status -- */

export type BookingStatus =
    | "pending"
    | "proof_submitted"
    | "confirmed"
    | "denied"
    | "cancelled"
    | "unknown";

/**
 * Maps the backend's `paymentConfirmationStatus` onto what the site shows.
 *
 * `booked` and `pending` both mean "placed, nothing paid yet" — the site does
 * not distinguish them because the investor's next action is identical.
 */
export function mapBookingStatus(raw: string | null | undefined): BookingStatus {
    switch ((raw ?? "").toLowerCase()) {
        case "pending":
        case "booked":
            return "pending";
        // `uploaded` is what the backend actually writes when a receipt is
        // submitted — confirmed against live rows. `proof_submitted` and
        // `submitted` are kept as tolerated aliases.
        case "uploaded":
        case "proof_submitted":
        case "submitted":
            return "proof_submitted";
        case "confirmed":
        case "approved":
            return "confirmed";
        case "denied":
        case "rejected":
            return "denied";
        case "cancelled":
        case "canceled":
            return "cancelled";
        default:
            return "unknown";
    }
}

export const BOOKING_STATUS_LABEL: Record<BookingStatus, Bi> = {
    pending: { en: "Awaiting payment", bn: "পেমেন্টের অপেক্ষায়" },
    proof_submitted: { en: "Proof under review", bn: "প্রমাণ পর্যালোচনায়" },
    confirmed: { en: "Confirmed", bn: "নিশ্চিত" },
    denied: { en: "Payment not accepted", bn: "পেমেন্ট গৃহীত হয়নি" },
    cancelled: { en: "Cancelled", bn: "বাতিল" },
    unknown: { en: "Booking placed", bn: "বুকিং সম্পন্ন" },
};
