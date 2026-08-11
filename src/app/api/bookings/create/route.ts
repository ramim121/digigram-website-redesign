import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

/**
 * POST { idProjects, units, partners[] } → place a booking.
 *
 * Talks to `v2/web/bookings/create`, which enforces **both** eligibility rules
 * (verified contact and verified NID) before delegating to the shared booking
 * implementation. The original `bookings/create` has the NID check commented
 * out for the mobile app's sake, so the site must not call it directly — the
 * gate in the UI would then be advisory rather than enforced.
 *
 * The unit → partner split is decided here rather than in the browser: it
 * determines how much money each Shathi partner is recorded against, and a
 * number that a client can edit is a number that will be edited.
 */

type PartnerInput = { idProjectPartners: number };

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

    const idProjects = Number(body.idProjects);
    const units = Number(body.units);
    const unitValue = Number(body.unitValue);
    const partners = Array.isArray(body.partners) ? (body.partners as PartnerInput[]) : [];

    if (!Number.isInteger(idProjects) || idProjects <= 0) {
        return NextResponse.json({ ok: false, message: "Invalid project" }, { status: 400 });
    }
    if (!Number.isInteger(units) || units < 1) {
        return NextResponse.json({ ok: false, message: "Choose at least one unit." }, { status: 400 });
    }
    if (partners.length === 0) {
        return NextResponse.json(
            { ok: false, message: "This project has no partners assigned yet." },
            { status: 400 },
        );
    }
    if (!Number.isFinite(unitValue) || unitValue <= 0) {
        return NextResponse.json({ ok: false, message: "Invalid unit value" }, { status: 400 });
    }

    /**
     * Spread the units across the assigned partners as evenly as possible,
     * giving the remainder to the earliest partners. Every partner in the list
     * must receive at least one unit — the backend requires `investedUnit >= 1`
     * — so more partners than units means only the first `units` partners are
     * recorded.
     */
    const used = partners.slice(0, units);
    const base = Math.floor(units / used.length);
    const remainder = units % used.length;

    const projectPartners = used.map((partner, index) => {
        const investedUnit = base + (index < remainder ? 1 : 0);
        return {
            idProjectPartners: Number(partner.idProjectPartners),
            investedUnit,
            amountInvested: investedUnit * unitValue,
        };
    });

    const res = await apiRequest<unknown>("v2/web/bookings/create", {
        method: "POST",
        token,
        revalidate: 0,
        body: {
            // Date only; the backend stores it as the investment date.
            investmentDate: new Date().toISOString().slice(0, 10),
            projects: [{ idProjects, unitPurchased: units, projectPartners }],
        },
    });

    if (!res.ok) {
        return NextResponse.json(
            {
                ok: false,
                code: res.code ?? null,
                // The backend joins Joi messages with "<br>" for this route.
                message: res.error.replace(/\.\s*<br>\s*/g, ". "),
            },
            { status: res.status === 0 ? 503 : res.status },
        );
    }

    return NextResponse.json({ ok: true, data: res.data ?? null });
}
