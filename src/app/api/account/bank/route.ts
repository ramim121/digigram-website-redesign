import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

/**
 * POST { idBanks, idBankBranches, accountNumber, accountHolderName, makeDefault }
 * → add a payout account for the signed-in user.
 *
 * The backend takes the owner from the token, so an account cannot be attached
 * to somebody else.
 *
 * `default` is a required string of "yes"/"no" in the backend's Joi schema, not
 * a boolean — sending `true` fails validation with a message about the default
 * status being required, which reads like a missing field rather than a wrong
 * type. It is translated here so the browser can send an honest boolean.
 */
export async function POST(request: Request) {
    const token = await getSessionToken();
    if (!token) {
        return NextResponse.json({ ok: false, message: "Not signed in" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
    }

    const idBanks = Number(body.idBanks);
    const idBankBranches = Number(body.idBankBranches);
    const accountNumber = typeof body.accountNumber === "string" ? body.accountNumber.trim() : "";
    const accountHolderName =
        typeof body.accountHolderName === "string" ? body.accountHolderName.trim() : "";

    if (!idBanks || !idBankBranches) {
        return NextResponse.json(
            { ok: false, message: "Choose a bank and a branch." },
            { status: 400 },
        );
    }
    if (!accountNumber || !accountHolderName) {
        return NextResponse.json(
            { ok: false, message: "Account number and account holder name are required." },
            { status: 400 },
        );
    }

    const res = await apiRequest("banks/user-bank", {
        method: "POST",
        token,
        revalidate: 0,
        body: {
            idBanks,
            idBankBranches,
            accountNumber,
            accountHolderName,
            default: body.makeDefault === false ? "no" : "yes",
        },
    });

    if (!res.ok) {
        return NextResponse.json(
            { ok: false, message: res.error },
            { status: res.status === 0 ? 503 : res.status },
        );
    }

    return NextResponse.json({ ok: true });
}
