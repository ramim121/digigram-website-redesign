import { NextResponse } from "next/server";
import { apiGet } from "@/lib/api/client";

/**
 * GET                 → the bank list
 * GET ?bank=<idBanks> → that bank's branches
 *
 * Both are public reference data on the backend (`banks/get_all_banks` and
 * `banks/{id}`), so no token is attached. They are proxied anyway to keep the
 * backend origin out of client JavaScript and to normalise two differently
 * shaped rows into one `{ id, name }` list the select boxes can use.
 *
 * Cached for an hour: the list of banks in Bangladesh does not change during a
 * form fill, and branch lists are long.
 */

type ApiBank = { idBanks?: number; bankName?: string | null; bankNameShort?: string | null };
type ApiBranch = { idBankBranches?: number; branchName?: string | null };

export async function GET(request: Request) {
    const bankId = new URL(request.url).searchParams.get("bank");

    if (bankId) {
        if (!/^\d+$/.test(bankId)) {
            return NextResponse.json({ ok: false, message: "Invalid bank" }, { status: 400 });
        }

        const res = await apiGet<ApiBranch[]>(`banks/${bankId}`, { revalidate: 3600 });
        if (!res.ok || !Array.isArray(res.data)) {
            return NextResponse.json({ ok: false, message: "Could not load branches" }, { status: 502 });
        }

        return NextResponse.json({
            ok: true,
            items: res.data
                .filter((row) => row.idBankBranches)
                .map((row) => ({ id: row.idBankBranches as number, name: row.branchName ?? "" })),
        });
    }

    const res = await apiGet<ApiBank[]>("banks/get_all_banks", { revalidate: 3600 });
    if (!res.ok || !Array.isArray(res.data)) {
        return NextResponse.json({ ok: false, message: "Could not load banks" }, { status: 502 });
    }

    return NextResponse.json({
        ok: true,
        items: res.data
            .filter((row) => row.idBanks)
            .map((row) => ({
                id: row.idBanks as number,
                // Some rows carry only the short name; prefer the full one.
                name: row.bankName || row.bankNameShort || "",
            })),
    });
}
