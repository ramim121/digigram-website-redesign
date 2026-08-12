import "server-only";

import { apiGet } from "@/lib/api/client";
import { s3Url } from "@/lib/api/config";
import { getSessionToken } from "@/lib/auth/session";
import { mapBookingStatus, type BookingStatus } from "@/lib/booking";

/**
 * Booking reads for the account area.
 *
 * All of these are user-specific, so they carry the session token and are never
 * cached.
 */

export type DigigramBank = {
    bankName: string;
    branchName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
};

/**
 * The account investors pay into.
 *
 * Read from `digigram_bank_info` rather than hardcoded. The mobile app
 * hardcodes it in `SubmitProofOfPayment.tsx`, which is how the app and the
 * database came to disagree — the table still held a United Commercial Bank
 * placeholder while the app showed Mutual Trust. Migration 003 corrected the
 * table; the website reads it so a future bank change is an UPDATE, not a
 * release.
 *
 * Returns null rather than a fallback: showing a *guessed* account number is
 * how money goes to the wrong place.
 */
export async function fetchDigigramBank(): Promise<DigigramBank | null> {
    const res = await apiGet<DigigramBank[] | DigigramBank>("digigram_bank_info", {
        revalidate: 300,
    });
    if (!res.ok || !res.data) return null;

    const row = Array.isArray(res.data) ? res.data[0] : res.data;
    if (!row?.accountNumber) return null;

    return {
        bankName: row.bankName ?? "",
        branchName: row.branchName ?? "",
        accountName: row.accountName ?? "",
        accountNumber: row.accountNumber,
        routingNumber: row.routingNumber ?? "",
    };
}

export type AssignedPartner = {
    id: number;
    name: string | null;
    role: string | null;
    location: string | null;
    /** The app renders this as an inclusion badge; kept for parity. */
    hasDisability: boolean;
    units: number;
    amount: number;
    /** Absolute S3 URL, or null when the partner has no photo on file. */
    image: string | null;
    bio: string | null;
    /** What they farm or make — "Goat, Cow", "Livestock". */
    interestedIn: string | null;
};

export type BookingSummary = {
    id: number;
    reference: string;
    status: BookingStatus;
    placedAt: string | null;
    projectNames: string[];
    totalUnits: number;
    totalInvested: number;
    /** Low and high ends of the projected return, in taka. Never a promise. */
    expectedReturnMin: number;
    expectedReturnMax: number;
    /** Latest end date across the booking's projects, or null before payment. */
    maturityDate: string | null;
    /** True once a receipt is on file and awaiting review. */
    proofSubmitted: boolean;
    /** The Shathi partners this booking is recorded against. */
    partners: AssignedPartner[];
};

/**
 * One row of `v2/investments/mine`.
 *
 * NOTE THE NESTING. That endpoint returns **investments**, each carrying the
 * booking it belongs to. The previous mapper expected the opposite — bookings
 * each carrying investments — so `ProjectInvestors` was always undefined and
 * every booking rendered with zero units, zero amount and no project name.
 * That is why the account page showed a list of references against BDT 0.
 */
type ApiInvestment = {
    idProjectInvestors?: number;
    unitPurchased?: number | string | null;
    investmentStatus?: string | null;
    investmentDate?: string | null;
    /** Computed by the API: investment date (or payment date) plus the tenure. */
    projectStartDate?: string | null;
    projectEndDate?: string | null;
    Project?: {
        idProjects?: number;
        projectName?: string | null;
        unitInvestmentValue?: string | number | null;
        returnRangeMin?: string | number | null;
        returnRangeMax?: string | number | null;
    } | null;
    ProjectInvestmentBooking?: {
        idProjectInvestmentBookings?: number;
        bookingId?: string | null;
        paymentConfirmationStatus?: string | null;
        /** A separate column: a cancelled booking keeps its payment status. */
        cancelled?: string | null;
        proofOfPayment?: string | null;
        createdAt?: string | null;
    } | null;
    ProjectPartnerInvestors?: {
        investedUnit?: number | string | null;
        ProjectPartner?: {
            idProjectPartners?: number;
            Project?: { projectName?: string | null } | null;
            User?: {
                fullName?: string | null;
                role?: string | null;
                location?: string | null;
                disability?: string | null;
                bio?: string | null;
                interestedIn?: string | null;
                ProfilePicture?: {
                    fileName?: string | null;
                    refType?: string | null;
                    refId?: number | null;
                } | null;
            } | null;
        } | null;
    }[];
};

/** Decimals arrive as strings; Number() first or `+` concatenates. */
const n = (value: unknown): number => Number(value ?? 0) || 0;

/**
 * A partner's photo.
 *
 * Same key rule as everywhere else: the prefix is the file row's `refType` and
 * `profile-picture` nests by `refId`. Guessing a flat `profile/` path is what
 * made every project image 404 before.
 */
function partnerPhoto(file: { fileName?: string | null; refType?: string | null; refId?: number | null } | null | undefined): string | null {
    if (!file?.fileName) return null;
    const type = file.refType?.trim() || "profile-picture";
    return s3Url(file.refId != null ? `${type}/${file.refId}` : type, file.fileName);
}

/**
 * Folds the flat investment list into one entry per booking.
 *
 * Money is derived, not read: there is no amount column on either table. The
 * booking total is units x the project's unit value, and the projected return
 * applies the project's own min/max percentages to that — matching BR-06.
 */
function groupByBooking(rows: ApiInvestment[]): BookingSummary[] {
    const byReference = new Map<string, BookingSummary>();

    for (const row of rows) {
        const booking = row.ProjectInvestmentBooking;
        if (!booking) continue;

        const reference = booking.bookingId ?? String(booking.idProjectInvestmentBookings ?? "");
        if (!reference) continue;

        const units = n(row.unitPurchased);
        const unitValue = n(row.Project?.unitInvestmentValue);
        const amount = units * unitValue;

        let entry = byReference.get(reference);
        if (!entry) {
            entry = {
                id: Number(booking.idProjectInvestmentBookings ?? 0),
                reference,
                status:
                    booking.cancelled === "yes"
                        ? "cancelled"
                        : mapBookingStatus(booking.paymentConfirmationStatus),
                placedAt: booking.createdAt ?? null,
                projectNames: [],
                totalUnits: 0,
                totalInvested: 0,
                expectedReturnMin: 0,
                expectedReturnMax: 0,
                maturityDate: null,
                proofSubmitted: Boolean(booking.proofOfPayment),
                partners: [],
            };
            byReference.set(reference, entry);
        }

        entry.totalUnits += units;
        entry.totalInvested += amount;
        entry.expectedReturnMin += amount * (1 + n(row.Project?.returnRangeMin) / 100);
        entry.expectedReturnMax += amount * (1 + n(row.Project?.returnRangeMax) / 100);

        const name = row.Project?.projectName ?? row.ProjectPartnerInvestors?.[0]?.ProjectPartner?.Project?.projectName;
        if (name && !entry.projectNames.includes(name)) entry.projectNames.push(name);

        // A booking spanning projects of different lengths matures when the
        // last one does.
        if (row.projectEndDate && (!entry.maturityDate || row.projectEndDate > entry.maturityDate)) {
            entry.maturityDate = row.projectEndDate;
        }

        for (const link of row.ProjectPartnerInvestors ?? []) {
            const partner = link.ProjectPartner;
            if (!partner?.idProjectPartners) continue;
            if (entry.partners.some((p) => p.id === partner.idProjectPartners)) continue;
            entry.partners.push({
                id: partner.idProjectPartners,
                name: partner.User?.fullName ?? null,
                role: partner.User?.role ?? null,
                location: partner.User?.location ?? null,
                hasDisability: partner.User?.disability === "yes",
                units: n(link.investedUnit),
                // No amount column on the allocation either; derive it the same way.
                amount: n(link.investedUnit) * unitValue,
                image: partnerPhoto(partner.User?.ProfilePicture),
                bio: partner.User?.bio ?? null,
                interestedIn: partner.User?.interestedIn ?? null,
            });
        }
    }

    // Newest first, matching the app's My Investment ordering.
    return [...byReference.values()].sort((a, b) => (b.placedAt ?? "").localeCompare(a.placedAt ?? ""));
}

/**
 * The signed-in investor's bookings.
 *
 * `v2/investments/mine` takes the user from the token — added in Phase A2 —
 * rather than from the URL, which is what the original
 * `investors/invested-projects/{id}` does.
 */
export async function fetchMyBookings(): Promise<BookingSummary[] | null> {
    const token = await getSessionToken();
    if (!token) return null;

    const res = await apiGet<ApiInvestment[]>("v2/investments/mine", { token, revalidate: 0 });
    if (!res.ok || !Array.isArray(res.data)) return null;

    return groupByBooking(res.data);
}

/**
 * One booking, in full.
 *
 * Uses the ownership-checked `v2/web/bookings/{id}`. The original
 * `bookings/details/{id}` is unauthenticated and takes the id straight from the
 * URL, so the website must never call it.
 */
export async function fetchBooking(id: number): Promise<{ raw: unknown; summary: BookingSummary } | null> {
    const token = await getSessionToken();
    if (!token) return null;

    /*
     * Derived from the same user-scoped list the account page uses, rather than
     * from `v2/web/bookings/{id}`.
     *
     * That route returns the opposite nesting — a booking carrying investments,
     * where `mine` returns investments carrying a booking — so it needed its own
     * mapper. Two mappers over two shapes is how the list came to show BDT 0
     * while the detail page looked right: only one of them was ever corrected.
     * One shape, one mapper, no divergence.
     *
     * `mine` derives the caller from the token, so this is still ownership-safe:
     * somebody else's booking id simply is not in the list.
     */
    const res = await apiGet<ApiInvestment[]>("v2/investments/mine", { token, revalidate: 0 });
    if (!res.ok || !Array.isArray(res.data)) return null;

    const summary = groupByBooking(res.data).find((b) => b.id === id);
    if (!summary) return null;

    const raw = res.data.filter((r) => r.ProjectInvestmentBooking?.idProjectInvestmentBookings === id);
    return { raw, summary };
}
