import "server-only";

import { apiGet } from "@/lib/api/client";
import { s3Url } from "@/lib/api/config";
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
    /** Units already reserved against this partner, confirmed or not. */
    investorAlreadyBookedCount?: number | null;
    User?: {
        fullName?: string | null;
        fullNameBn?: string | null;
        ProfilePicture?: { fileName?: string | null; refType?: string | null; refId?: number | null } | null;
    } | null;
};

export async function fetchProjectPartners(idProjects: number): Promise<CheckoutPartner[]> {
    const res = await apiGet<ApiProjectPartner[]>(`projects/project-partners/${idProjects}`, {
        revalidate: 60,
    });
    if (!res.ok || !Array.isArray(res.data)) return [];

    return res.data
        .filter((row) => row.idProjectPartners)
        .map((row) => {
            const capacity = Number(row.partnerUnitCapacity ?? 0) || 0;
            const taken = Number(row.investorAlreadyBookedCount ?? 0) || 0;
            const photo = row.User?.ProfilePicture;

            return {
                idProjectPartners: row.idProjectPartners as number,
                name: row.User?.fullName ?? null,
                // Same key rule as everywhere else: refType is the prefix and
                // profile-picture nests by refId.
                image: photo?.fileName
                    ? s3Url(
                          photo.refId != null
                              ? `${photo.refType ?? "profile-picture"}/${photo.refId}`
                              : (photo.refType ?? "profile-picture"),
                          photo.fileName,
                      )
                    : null,
                capacity,
                // Never negative: a partner at or over capacity has none left.
                remaining: Math.max(0, capacity - taken),
            };
        });
}
