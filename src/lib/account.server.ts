import "server-only";

import { apiRequest } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

/**
 * Account-area reads that act on behalf of the signed-in user.
 *
 * Every call here sends the session token from the httpOnly cookie and is
 * uncacheable by construction (`revalidate: 0`, plus the client forces
 * `no-store` whenever a token is present). Caching one investor's payout
 * account and serving it to another is the failure mode being designed out.
 */

export type BankAccount = {
    id: number;
    bankName: string | null;
    branchName: string | null;
    accountHolderName: string | null;
    accountNumber: string | null;
    isDefault: boolean;
};

type ApiUserBank = {
    idUserBanks?: number;
    accountNumber?: string | null;
    accountHolderName?: string | null;
    default?: string | null;
    Bank?: { bankName?: string | null } | null;
    BankBranch?: { branchName?: string | null } | null;
};

/**
 * The user's payout accounts.
 *
 * Returns `null` — not `[]` — when the call fails, so the UI can tell "you have
 * no account on file" apart from "we could not check". Prompting someone to add
 * a second bank account because a request timed out would be worse than saying
 * nothing.
 */
export async function fetchBankAccounts(userId: number): Promise<BankAccount[] | null> {
    const token = await getSessionToken();
    if (!token) return null;

    const res = await apiRequest<ApiUserBank[] | ApiUserBank>(`user-bank/${userId}`, {
        token,
        revalidate: 0,
    });
    if (!res.ok || !res.data) return null;

    const rows = Array.isArray(res.data) ? res.data : [res.data];
    return rows.filter(Boolean).map((row) => ({
        id: Number(row.idUserBanks ?? 0),
        bankName: row.Bank?.bankName ?? null,
        branchName: row.BankBranch?.branchName ?? null,
        accountHolderName: row.accountHolderName ?? null,
        accountNumber: row.accountNumber ?? null,
        isDefault: row.default === "yes",
    }));
}

/**
 * Last four digits only.
 *
 * The full number is never rendered: this page is read over shoulders, screen-
 * shared and screenshotted, and the last four are enough for its only job —
 * letting someone confirm which of their accounts is on file.
 */
export function maskAccountNumber(value: string | null): string | null {
    if (!value) return null;
    const digits = value.replace(/\s+/g, "");
    if (digits.length <= 4) return digits;
    return `•••• ${digits.slice(-4)}`;
}
