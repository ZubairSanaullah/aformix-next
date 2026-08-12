import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* SEO Constants                                                              */
/* -------------------------------------------------------------------------- */

export const seoRobotsIndexValues = [
    "INDEX",
    "NOINDEX",
] as const;

export const seoRobotsFollowValues = [
    "FOLLOW",
    "NOFOLLOW",
] as const;

export type SEORobotsIndex =
    (typeof seoRobotsIndexValues)[number];

export type SEORobotsFollow =
    (typeof seoRobotsFollowValues)[number];

export const SEO_LIMITS = {
    title: {
        min: 10,
        recommendedMin: 30,
        recommendedMax: 60,
        max: 120,
    },

    description: {
        min: 50,
        recommendedMin: 120,
        recommendedMax: 160,
        max: 320,
    },

    keywords: {
        max: 20,
        itemMax: 100,
    },

    path: {
        max: 500,
    },

    canonicalUrl: {
        max: 2048,
    },

    ogTitle: {
        max: 120,
    },

    ogDescription: {
        max: 320,
    },

    ogImage: {
        max: 2048,
    },

    twitterHandle: {
        max: 100,
    },
} as const;

/* -------------------------------------------------------------------------- */
/* Shared Normalization Helpers                                               */
/* -------------------------------------------------------------------------- */

/**
 * Normalize an optional nullable string.
 *
 * Empty strings are converted to null so downstream services
 * receive predictable values.
 */
const normalizeNullableString = (
    value: string | null | undefined
): string | null | undefined => {
    if (value === undefined || value === null) {
        return value;
    }

    const normalized = value.trim();

    return normalized === "" ? null : normalized;
};

/**
 * Normalize an optional nullable string schema.
 */
const optionalNullableString = z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform(normalizeNullableString);

/**
 * Normalize an SEO page path.
 *
 * Rules:
 * - leading/trailing whitespace is removed
 * - path must begin with /
 * - repeated trailing slashes are removed
 * - the root path remains /
 * - spaces are not allowed
 */
const normalizeSEOPagePath = (
    value: string
): string => {
    const normalized = value.trim();

    if (normalized === "/") {
        return "/";
    }

    return normalized.replace(/\/+$/, "");
};

/* -------------------------------------------------------------------------- */
/* Canonical URL                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Canonical URL validation.
 *
 * Only HTTP and HTTPS URLs are accepted.
 */
const canonicalUrlSchema = z
    .string()
    .trim()
    .max(
        SEO_LIMITS.canonicalUrl.max,
        `Canonical URL must be ${SEO_LIMITS.canonicalUrl.max} characters or fewer`
    )
    .url("Canonical URL must be a valid URL")
    .refine(
        (value) => /^https?:\/\//i.test(value),
        "Canonical URL must use HTTP or HTTPS"
    )
    .nullable()
    .optional()
    .transform(normalizeNullableString);

/* -------------------------------------------------------------------------- */
/* SEO Title                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * SEO title validation.
 *
 * Recommended length is intentionally not enforced here.
 * The analyzer handles SEO recommendations separately.
 */
const seoTitleSchema = z
    .string()
    .trim()
    .max(
        SEO_LIMITS.title.max,
        `SEO title must be ${SEO_LIMITS.title.max} characters or fewer`
    )
    .nullable()
    .optional()
    .transform(normalizeNullableString);

/* -------------------------------------------------------------------------- */
/* SEO Description                                                            */
/* -------------------------------------------------------------------------- */

/**
 * SEO description validation.
 *
 * Recommended length is intentionally not enforced here.
 */
const seoDescriptionSchema = z
    .string()
    .trim()
    .max(
        SEO_LIMITS.description.max,
        `SEO description must be ${SEO_LIMITS.description.max} characters or fewer`
    )
    .nullable()
    .optional()
    .transform(normalizeNullableString);

/* -------------------------------------------------------------------------- */
/* Open Graph                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Open Graph title validation.
 */
const ogTitleSchema = z
    .string()
    .trim()
    .max(
        SEO_LIMITS.ogTitle.max,
        `Open Graph title must be ${SEO_LIMITS.ogTitle.max} characters or fewer`
    )
    .nullable()
    .optional()
    .transform(normalizeNullableString);

/**
 * Open Graph description validation.
 */
const ogDescriptionSchema = z
    .string()
    .trim()
    .max(
        SEO_LIMITS.ogDescription.max,
        `Open Graph description must be ${SEO_LIMITS.ogDescription.max} characters or fewer`
    )
    .nullable()
    .optional()
    .transform(normalizeNullableString);

/**
 * Open Graph image validation.
 *
 * Supports:
 * - absolute HTTP/HTTPS URLs
 * - application-relative paths such as /og-image.png
 */
const ogImageSchema = z
    .string()
    .trim()
    .max(
        SEO_LIMITS.ogImage.max,
        `Open Graph image must be ${SEO_LIMITS.ogImage.max} characters or fewer`
    )
    .refine(
        (value) => {
            if (value.startsWith("/")) {
                return true;
            }

            return /^https?:\/\//i.test(value);
        },
        "Open Graph image must be an absolute HTTP/HTTPS URL or an application-relative path"
    )
    .nullable()
    .optional()
    .transform(normalizeNullableString);

/* -------------------------------------------------------------------------- */
/* Twitter/X Handle                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Twitter/X handle validation.
 *
 * Accepted examples:
 * - @aformix
 * - aformix
 * - @aformixtech
 * - aformixtech
 */
const twitterHandleSchema = z
    .string()
    .trim()
    .max(
        SEO_LIMITS.twitterHandle.max,
        `Twitter/X handle must be ${SEO_LIMITS.twitterHandle.max} characters or fewer`
    )
    .refine(
        (value) =>
            /^@?[A-Za-z0-9_]+$/.test(value),
        "Twitter/X handle may only contain letters, numbers, underscores, and an optional @ prefix"
    )
    .nullable()
    .optional()
    .transform(normalizeNullableString);

/* -------------------------------------------------------------------------- */
/* SEO Keywords                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Keyword list validation.
 *
 * SEOPage stores keywords as a String in Prisma.
 * The validation/API layer works with string[] for cleaner handling.
 *
 * The service layer is responsible for serializing the list.
 */
export const seoKeywordsSchema = z
    .array(
        z
            .string()
            .trim()
            .min(1, "Keyword cannot be empty")
            .max(
                SEO_LIMITS.keywords.itemMax,
                `Keyword must be ${SEO_LIMITS.keywords.itemMax} characters or fewer`
            )
    )
    .max(
        SEO_LIMITS.keywords.max,
        `You can specify up to ${SEO_LIMITS.keywords.max} keywords`
    )
    .default([])
    .transform((keywords) => {
        const normalizedKeywords = keywords
            .map((keyword) => keyword.trim())
            .filter(Boolean);

        return [
            ...new Set(normalizedKeywords),
        ];
    });

/* -------------------------------------------------------------------------- */
/* SEO Settings                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Complete SEO settings validation schema.
 *
 * Matches the current Prisma SEOSettings model:
 *
 * - siteTitle
 * - siteDescription
 * - canonicalUrl
 * - defaultOgImage
 * - twitterHandle
 * - defaultRobotsIndex
 * - defaultRobotsFollow
 */
export const seoSettingsSchema = z.object({
    siteTitle: seoTitleSchema,

    siteDescription: seoDescriptionSchema,

    canonicalUrl: canonicalUrlSchema,

    defaultOgImage: ogImageSchema,

    twitterHandle: twitterHandleSchema,

    defaultRobotsIndex: z
        .enum(seoRobotsIndexValues)
        .default("INDEX"),

    defaultRobotsFollow: z
        .enum(seoRobotsFollowValues)
        .default("FOLLOW"),
});

/**
 * Partial schema used when updating existing SEO settings.
 */
export const seoSettingsUpdateSchema =
    seoSettingsSchema.partial();

/**
 * Inferred SEO settings input type.
 */
export type SEOSettingsInput = z.infer<
    typeof seoSettingsSchema
>;

/**
 * Inferred SEO settings update type.
 */
export type SEOSettingsUpdateInput =
    z.infer<typeof seoSettingsUpdateSchema>;

/* -------------------------------------------------------------------------- */
/* SEO Page                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * SEO page path validation.
 *
 * Paths are stored independently from the public domain.
 *
 * Examples:
 * - /
 * - /about
 * - /services
 * - /blog
 * - /resources
 * - /resources/web-development
 */
export const seoPagePathSchema = z
    .string()
    .trim()
    .min(1, "Page path is required")
    .max(
        SEO_LIMITS.path.max,
        `Page path must be ${SEO_LIMITS.path.max} characters or fewer`
    )
    .refine(
        (value) => value.startsWith("/"),
        "Page path must start with /"
    )
    .refine(
        (value) => !value.includes(" "),
        "Page path cannot contain spaces"
    )
    .transform(normalizeSEOPagePath);

/**
 * Complete SEO page validation schema.
 *
 * Matches the current Prisma SEOPage model:
 *
 * - path
 * - title
 * - description
 * - keywords
 * - canonical
 * - noIndex
 * - noFollow
 * - ogTitle
 * - ogDescription
 * - ogImage
 *
 * The API-facing field is canonicalUrl.
 * The service layer maps it to Prisma's canonical field.
 */
export const seoPageSchema = z.object({
    path: seoPagePathSchema,

    title: seoTitleSchema,

    description: seoDescriptionSchema,

    keywords: seoKeywordsSchema,

    canonicalUrl: canonicalUrlSchema,

    noIndex: z
        .boolean()
        .default(false),

    noFollow: z
        .boolean()
        .default(false),

    ogTitle: ogTitleSchema,

    ogDescription: ogDescriptionSchema,

    ogImage: ogImageSchema,
});

/**
 * SEO page update schema.
 *
 * All fields are optional when updating an existing page.
 */
export const seoPageUpdateSchema =
    seoPageSchema.partial();

/**
 * Inferred SEO page input type.
 */
export type SEOPageInput = z.infer<
    typeof seoPageSchema
>;

/**
 * Inferred SEO page update type.
 */
export type SEOPageUpdateInput =
    z.infer<typeof seoPageUpdateSchema>;

/* -------------------------------------------------------------------------- */
/* Blog SEO                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Blog SEO validation.
 *
 * This mirrors the existing Post SEO fields.
 *
 * No additional Prisma SEO model is introduced for blog posts.
 */
export const blogSEOSchema = z.object({
    seoTitle: seoTitleSchema,

    seoDescription: seoDescriptionSchema,

    seoKeywords: z
        .array(
            z
                .string()
                .trim()
                .min(1, "Keyword cannot be empty")
                .max(
                    SEO_LIMITS.keywords.itemMax,
                    `Keyword must be ${SEO_LIMITS.keywords.itemMax} characters or fewer`
                )
        )
        .max(
            SEO_LIMITS.keywords.max,
            `You can specify up to ${SEO_LIMITS.keywords.max} keywords`
        )
        .default([])
        .transform((keywords) => {
            const normalizedKeywords =
                keywords
                    .map((keyword) =>
                        keyword.trim()
                    )
                    .filter(Boolean);

            return [
                ...new Set(normalizedKeywords),
            ];
        }),
});

export const blogSEOUpdateSchema =
    blogSEOSchema.partial();

export type BlogSEOInput = z.infer<
    typeof blogSEOSchema
>;

export type BlogSEOUpdateInput =
    z.infer<typeof blogSEOUpdateSchema>;

/* -------------------------------------------------------------------------- */
/* SEO Analysis Input                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Input used by the SEO analysis engine.
 *
 * The analyzer is intentionally independent from
 * database IDs and persistence.
 */
export const seoAnalysisSchema = z.object({
    title: z
        .string()
        .trim()
        .default(""),

    description: z
        .string()
        .trim()
        .default(""),

    content: z
        .string()
        .default(""),

    canonicalUrl: canonicalUrlSchema,

    noIndex: z
        .boolean()
        .default(false),

    noFollow: z
        .boolean()
        .default(false),

    ogTitle: ogTitleSchema,

    ogDescription: ogDescriptionSchema,

    ogImage: ogImageSchema,
});

export type SEOAnalysisInput = z.infer<
    typeof seoAnalysisSchema
>;

/* -------------------------------------------------------------------------- */
/* SEO Recommendation Types                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Severity used by the SEO analyzer.
 */
export type SEORecommendationSeverity =
    | "CRITICAL"
    | "WARNING"
    | "SUCCESS";

/**
 * Individual SEO analyzer recommendation.
 */
export interface SEORecommendation {
    key: string;

    severity: SEORecommendationSeverity;

    title: string;

    message: string;
}

/**
 * Complete SEO analysis result.
 */
export interface SEOAnalysisResult {
    score: number;

    recommendations: SEORecommendation[];
}

/* -------------------------------------------------------------------------- */
/* SEO Validation Helpers                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Convert API/UI robots values into Prisma-compatible booleans.
 */
export function robotsValuesToBooleans(
    index: SEORobotsIndex,
    follow: SEORobotsFollow
) {
    return {
        index: index === "INDEX",
        follow: follow === "FOLLOW",
    };
}

/**
 * Convert Prisma-compatible robots booleans into API/UI values.
 */
export function robotsBooleansToValues(
    index: boolean,
    follow: boolean
) {
    return {
        index: index ? "INDEX" : "NOINDEX",
        follow: follow ? "FOLLOW" : "NOFOLLOW",
    } satisfies {
        index: SEORobotsIndex;
        follow: SEORobotsFollow;
    };
}

/**
 * Serialize keyword arrays for the current Prisma String field.
 */
export function serializeSEOKeywords(
    keywords: string[]
): string | null {
    const normalized = [
        ...new Set(
            keywords
                .map((keyword) => keyword.trim())
                .filter(Boolean)
        ),
    ];

    if (normalized.length === 0) {
        return null;
    }

    return normalized.join(", ");
}

/**
 * Deserialize the current Prisma keyword String field
 * into an array.
 *
 * Supports comma-separated keyword storage.
 */
export function deserializeSEOKeywords(
    keywords: string | null | undefined
): string[] {
    if (!keywords?.trim()) {
        return [];
    }

    return [
        ...new Set(
            keywords
                .split(",")
                .map((keyword) => keyword.trim())
                .filter(Boolean)
        ),
    ].slice(0, SEO_LIMITS.keywords.max);
}