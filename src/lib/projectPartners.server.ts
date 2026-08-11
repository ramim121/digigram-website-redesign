import "server-only";

import { apiGet } from "@/lib/api/client";
import type { CheckoutPartner } from "@/components/booking/CheckoutForm";

/**
 * The Shathi partners assigned to a project.
 *
 * A booking must record which partners the money is against —
 * `bookings/create` requires at least one `idProjectPartners` per project — so
 * checkout cannot proceed without this list. The app labels these assignments
 * "tentative" and reassigns after payment, which is why the checkout screen
 * presents them as information rather than as a choice.
 *
 * `projects/project-partners/{id}` is public, so no token is sent.
 */

type ApiProjectPartner = {
    idProjectPartners?: number;
    partnerUnitCapacity?: number | null;
    User?: { fullName?: string | null; fullNameBn?: string | null } | null;
};

export async function fetchProjectPartners(idProjects: number): Promise<CheckoutPartner[]> {
    const res = await apiGet<ApiProjectPartner[]>(`projects/project-partners/${idProjects}`, {
        revalidate: 60,
    });
    if (!res.ok || !Array.isArray(res.data)) return [];

    return res.data
        .filter((row) => row.idProjectPartners)
        .map((row) => ({
            idProjectPartners: row.idProjectPartners as number,
            name: row.User?.fullName ?? null,
        }));
}
