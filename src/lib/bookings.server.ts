import "server-only";

import { apiGet } from "@/lib/api/client";
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
};

export type BookingSummary = {
    id: number;
    reference: string;
    status: BookingStatus;
    placedAt: string | null;
    projectNames: string[];
    totalUnits: number;
    totalInvested: number;
    /** The Shathi partners this booking is recorded against. */
    partners: AssignedPartner[];
};

type ApiBooking = {
    idProjectInvestmentBookings?: number;
    bookingId?: string | null;
    paymentConfirmationStatus?: string | null;
    /** Separate column, not a status value — a cancelled booking keeps whatever
     *  payment status it had, so this must be checked independently. */
    cancelled?: string | null;
    createdAt?: string | null;
    ProjectInvestors?: {
        unitPurchased?: number | string | null;
        Project?: { projectName?: string | null; unitInvestmentValue?: string | number | null } | null;
        ProjectPartnerInvestors?: {
            investedUnit?: number | string | null;
            amountInvested?: number | string | null;
            ProjectPartner?: {
                idProjectPartners?: number;
                User?: {
                    fullName?: string | null;
                    role?: string | null;
                    location?: string | null;
                    disability?: string | null;
                } | null;
            } | null;
        }[];
    }[];
};

function toSummary(row: ApiBooking): BookingSummary {
    const investors = row.ProjectInvestors ?? [];

    let totalUnits = 0;
    let totalInvested = 0;
    const projectNames: string[] = [];
    const partners: AssignedPartner[] = [];

    for (const investor of investors) {
        const units = Number(investor.unitPurchased ?? 0) || 0;
        // Decimals arrive as strings from this API; Number() before arithmetic
        // or the additions become string concatenation.
        const unitValue = Number(investor.Project?.unitInvestmentValue ?? 0) || 0;
        totalUnits += units;
        totalInvested += units * unitValue;
        if (investor.Project?.projectName) projectNames.push(investor.Project.projectName);

        for (const link of investor.ProjectPartnerInvestors ?? []) {
            const partner = link.ProjectPartner;
            if (!partner?.idProjectPartners) continue;
            partners.push({
                id: partner.idProjectPartners,
                name: partner.User?.fullName ?? null,
                role: partner.User?.role ?? null,
                location: partner.User?.location ?? null,
                hasDisability: partner.User?.disability === 'yes',
                units: Number(link.investedUnit ?? 0) || 0,
                amount: Number(link.amountInvested ?? 0) || 0,
            });
        }
    }

    return {
        id: Number(row.idProjectInvestmentBookings ?? 0),
        // `bookingId` is the zero-padded human reference ("000158").
        reference: row.bookingId ?? String(row.idProjectInvestmentBookings ?? ""),
        status:
            row.cancelled === "yes"
                ? "cancelled"
                : mapBookingStatus(row.paymentConfirmationStatus),
        placedAt: row.createdAt ?? null,
        projectNames,
        totalUnits,
        totalInvested,
        partners,
    };
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

    const res = await apiGet<ApiBooking[]>("v2/investments/mine", { token, revalidate: 0 });
    if (!res.ok || !Array.isArray(res.data)) return null;

    return res.data.map(toSummary);
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

    const res = await apiGet<ApiBooking>(`v2/web/bookings/${id}`, { token, revalidate: 0 });
    if (!res.ok || !res.data) return null;

    return { raw: res.data, summary: toSummary(res.data) };
}
