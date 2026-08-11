/**
 * Raw shapes as the Shathi API actually returns them.
 *
 * These are transcribed from live responses, not from the design brief — the
 * brief's project contract differs from reality in several places. Two traps
 * worth stating up front, because both are easy to get wrong silently:
 *
 *   1. **Decimals arrive as strings.** `returnRangeMin: "6.00"`,
 *      `unitInvestmentValue: "30000.00"`, `totalRemainingUnits: "155"`. Doing
 *      arithmetic without parsing gives string concatenation, not a sum.
 *   2. **`description` is always null.** The admin's rich-text editor writes
 *      `summary`. Read `summary` for project body copy.
 *
 * The `*Bn` fields come from migration 002. They are optional here because a
 * backend that has not run the migration yet simply omits them.
 */

export type ApiFile = {
    idFiles: number;
    originalFileName: string | null;
    fileName: string | null;
    thumbnail: string | null;
    refType?: string | null;
    refId?: number | null;
};

export type ApiProjectCategory = {
    idProjectCategories: number;
    categoryName: string;
    categoryNameBn?: string | null;
    categoryImage: string | null;
};

export type ApiProjectProperty = {
    idProjectProperties: number;
    idProjects: number;
    cattleLiveWeightRate?: string | null;
    cattleInitialWeightMin?: string | null;
    cattleInitialWeightMax?: string | null;
    cattleFinalWeightMin?: string | null;
    cattleFinalWeightMax?: string | null;
};

/** Partner as exposed on the public project detail (post-allowlist: no phone number). */
export type ApiPartnerUser = {
    idUsers?: number;
    fullName: string | null;
    role: string | null;
    location: string | null;
    interestedIn: string | null;
    /** 'yes' | 'no'. The app renders this as an inclusion badge and filters on it. */
    disability: "yes" | "no" | null;
    joiningDate: string | null;
    age?: number | null;
    skills?: string | null;
    bio?: string | null;
    fullNameBn?: string | null;
    roleBn?: string | null;
    locationBn?: string | null;
    interestedInBn?: string | null;
    skillsBn?: string | null;
    bioBn?: string | null;
    ProfilePicture?: ApiFile | null;
};

export type ApiProjectPartner = {
    idProjectPartners: number;
    idProjects: number;
    idUsers: number;
    partnerUnitCapacity?: number | null;
    User?: ApiPartnerUser | null;
};

export type ApiProject = {
    idProjects: number;
    idProjectCategories: number;
    projectName: string;
    /** HTML. This is the body copy — `description` is dead. */
    summary: string | null;
    /** Always null in practice; images come through MainImage / FeaturedImages. */
    projectBanner: string | null;
    location: string | null;
    /** Decimal-as-string. */
    returnRangeMin: string | null;
    returnRangeMax: string | null;
    investmentType: "sustainable_return" | "fast_return";
    returnType: "variable" | "fixed";
    duration: number;
    tenure: "months" | "years";
    unitInvestmentValue: string | null;
    totalReturnMin: string | null;
    totalReturnMax: string | null;
    collectionStarts: string | null;
    collectionEnds: string | null;
    insurance: string | null;
    otherLocations: string | null;
    projectStatus:
        | "created"
        | "collection_started"
        | "collection_done"
        | "project_started"
        | "project_finished"
        | "fund_disbursed"
        | "closed"
        | "completed";
    showInUpcoming: "yes" | "no";
    projectType: "regular" | "special";
    totalAvailableUnits: number;
    investorUnitCapacity: number;
    /** Dead column — always null. Use `summary`. */
    description: string | null;
    /** Integer-as-string. */
    totalInvestedUnits?: string | number | null;
    totalRemainingUnits?: string | number | null;
    createdAt?: string;
    updatedAt?: string;

    projectNameBn?: string | null;
    summaryBn?: string | null;
    locationBn?: string | null;
    otherLocationsBn?: string | null;

    ProjectCategory?: ApiProjectCategory | null;
    ProjectProperty?: ApiProjectProperty | null;
    ProjectPartners?: ApiProjectPartner[];
    MainImage?: ApiFile | null;
    FeaturedImages?: ApiFile[];
};

export type ApiPartnership = {
    idPartnerships: number;
    name: string;
    nameBn?: string | null;
    image: string | null;
    priority: number;
};

export type ApiBlog = {
    idBlogs: number;
    heading: string;
    description: string;
    headingBn?: string | null;
    descriptionBn?: string | null;
    featuredImage: string | null;
    featuredImageThumb: string | null;
    writtenBy: number | string | null;
    writtenDate: string | null;
};

export type ApiTestimonial = {
    idInvestorTestimonials: number;
    name: string;
    nameBn?: string | null;
    image: string | null;
    /** Decimal-as-string in practice: `"4.00"`, not `4`. */
    rating: string | number | null;
    testimonial: string;
    testimonialBn?: string | null;
    priority: number;
};

export type ApiDigigramBank = {
    idDigigramBanks: number;
    bankName: string;
    branchName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
};

/* ------------------------------------------------------------- coercion -- */

/** Parse a decimal-as-string. Returns `fallback` for null, "" or garbage. */
export function num(value: string | number | null | undefined, fallback = 0): number {
    if (value === null || value === undefined || value === "") return fallback;
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

/** Normalise an empty string to null — the API uses "" where it means "unset". */
export function nullIfBlank(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}
