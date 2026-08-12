import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type {
    SEOPageInput,
    SEOPageUpdateInput,
    SEOSettingsInput,
    SEOSettingsUpdateInput,
} from "@/lib/validations/seo";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface GetSEOPagesOptions {
    search?: string;
    noIndex?: boolean;
    noFollow?: boolean;
}

export interface SEOPageWithData {
    id: string;
    path: string;
    title: string | null;
    description: string | null;
    keywords: string | null;
    canonical: string | null;
    noIndex: boolean;
    noFollow: boolean;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    createdAt: Date;
    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/* Shared Prisma Helpers                                                      */
/* -------------------------------------------------------------------------- */

const seoPageSelect = {
    id: true,
    path: true,
    title: true,
    description: true,
    keywords: true,
    canonical: true,
    noIndex: true,
    noFollow: true,
    ogTitle: true,
    ogDescription: true,
    ogImage: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.SEOPageSelect;

const seoSettingsSelect = {
    id: true,
    siteTitle: true,
    siteDescription: true,
    canonicalUrl: true,
    defaultOgImage: true,
    twitterHandle: true,
    defaultRobotsIndex: true,
    defaultRobotsFollow: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.SEOSettingsSelect;

/* -------------------------------------------------------------------------- */
/* SEO Settings                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Get the global SEO settings.
 *
 * SEO settings are treated as a singleton configuration.
 * If no settings record exists yet, this function returns null.
 */
export async function getSEOSettings() {
    return prisma.sEOSettings.findFirst({
        orderBy: {
            createdAt: "asc",
        },
        select: seoSettingsSelect,
    });
}

/**
 * Get the global SEO settings and create the default record when
 * none exists.
 *
 * This is useful for the Workspace SEO settings page because the
 * UI can always receive a settings object.
 */
export async function getOrCreateSEOSettings() {
    const existingSettings = await getSEOSettings();

    if (existingSettings) {
        return existingSettings;
    }

    return prisma.sEOSettings.create({
        data: {
            defaultRobotsIndex: true,
            defaultRobotsFollow: true,
        },
        select: seoSettingsSelect,
    });
}

/**
 * Update global SEO settings.
 *
 * The API layer should validate the incoming data before calling
 * this service.
 */
export async function updateSEOSettings(
    data: SEOSettingsUpdateInput
) {
    const existingSettings = await getSEOSettings();

    if (existingSettings) {
        return prisma.sEOSettings.update({
            where: {
                id: existingSettings.id,
            },
            data: {
                siteTitle:
                    data.siteTitle !== undefined
                        ? data.siteTitle
                        : undefined,

                siteDescription:
                    data.siteDescription !== undefined
                        ? data.siteDescription
                        : undefined,

                canonicalUrl:
                    data.canonicalUrl !== undefined
                        ? data.canonicalUrl
                        : undefined,

                defaultOgImage:
                    data.defaultOgImage !== undefined
                        ? data.defaultOgImage
                        : undefined,

                defaultRobotsIndex:
                    data.defaultRobotsIndex !== undefined
                        ? data.defaultRobotsIndex === "INDEX"
                        : undefined,

                defaultRobotsFollow:
                    data.defaultRobotsFollow !== undefined
                        ? data.defaultRobotsFollow === "FOLLOW"
                        : undefined,
            },
            select: seoSettingsSelect,
        });
    }

    return prisma.sEOSettings.create({
        data: {
            siteTitle: data.siteTitle ?? null,
            siteDescription: data.siteDescription ?? null,
            canonicalUrl: data.canonicalUrl ?? null,
            defaultOgImage: data.defaultOgImage ?? null,
            defaultRobotsIndex:
                data.defaultRobotsIndex !== undefined
                    ? data.defaultRobotsIndex === "INDEX"
                    : true,
            defaultRobotsFollow:
                data.defaultRobotsFollow !== undefined
                    ? data.defaultRobotsFollow === "FOLLOW"
                    : true,
        },
        select: seoSettingsSelect,
    });
}

/* -------------------------------------------------------------------------- */
/* SEO Pages                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get all SEO-managed pages.
 *
 * Supports:
 * - text search
 * - noIndex filtering
 * - noFollow filtering
 */
export async function getSEOPages(
    options: GetSEOPagesOptions = {}
) {
    const {
        search,
        noIndex,
        noFollow,
    } = options;

    const where: Prisma.SEOPageWhereInput = {};

    if (search?.trim()) {
        const searchTerm = search.trim();

        where.OR = [
            {
                path: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                title: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                keywords: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
        ];
    }

    if (noIndex !== undefined) {
        where.noIndex = noIndex;
    }

    if (noFollow !== undefined) {
        where.noFollow = noFollow;
    }

    return prisma.sEOPage.findMany({
        where,
        select: seoPageSelect,
        orderBy: {
            path: "asc",
        },
    });
}

/**
 * Get a single SEO page by ID.
 */
export async function getSEOPageById(
    id: string
) {
    if (!id?.trim()) {
        return null;
    }

    return prisma.sEOPage.findUnique({
        where: {
            id,
        },
        select: seoPageSelect,
    });
}

/**
 * Get a single SEO page by public route/path.
 *
 * Example:
 *
 * /
 * /about
 * /services
 * /contact
 */
export async function getSEOPageByPath(
    path: string
) {
    const normalizedPath = normalizeSEOPath(path);

    return prisma.sEOPage.findUnique({
        where: {
            path: normalizedPath,
        },
        select: seoPageSelect,
    });
}

/**
 * Create a new SEO page.
 */
export async function createSEOPage(
    data: SEOPageInput
) {
    const normalizedPath = normalizeSEOPath(data.path);

    return prisma.sEOPage.create({
        data: {
            path: normalizedPath,
            title: data.title ?? null,
            description: data.description ?? null,
            keywords: normalizeKeywords(data.keywords),
            canonical: data.canonicalUrl ?? null,
            noIndex: data.noIndex ?? false,
            noFollow: data.noFollow ?? false,
            ogTitle: data.ogTitle ?? null,
            ogDescription: data.ogDescription ?? null,
            ogImage: data.ogImage ?? null,
        },
        select: seoPageSelect,
    });
}

/**
 * Update an existing SEO page.
 */
export async function updateSEOPage(
    id: string,
    data: SEOPageUpdateInput
) {
    const updateData: Prisma.SEOPageUpdateInput = {
        title:
            data.title !== undefined
                ? data.title
                : undefined,

        description:
            data.description !== undefined
                ? data.description
                : undefined,

        keywords:
            data.keywords !== undefined
                ? normalizeKeywords(data.keywords)
                : undefined,

        canonical:
            data.canonicalUrl !== undefined
                ? data.canonicalUrl
                : undefined,

        noIndex:
            data.noIndex !== undefined
                ? data.noIndex
                : undefined,

        noFollow:
            data.noFollow !== undefined
                ? data.noFollow
                : undefined,

        ogTitle:
            data.ogTitle !== undefined
                ? data.ogTitle
                : undefined,

        ogDescription:
            data.ogDescription !== undefined
                ? data.ogDescription
                : undefined,

        ogImage:
            data.ogImage !== undefined
                ? data.ogImage
                : undefined,
    };

    if (data.path !== undefined) {
        updateData.path = normalizeSEOPath(
            data.path
        );
    }

    return prisma.sEOPage.update({
        where: {
            id,
        },
        data: updateData,
        select: seoPageSelect,
    });
}

/**
 * Delete an SEO page.
 */
export async function deleteSEOPage(
    id: string
) {
    return prisma.sEOPage.delete({
        where: {
            id,
        },
        select: {
            id: true,
            path: true,
        },
    });
}

/* -------------------------------------------------------------------------- */
/* SEO Page Upsert                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Create or update SEO metadata for a route.
 *
 * This is particularly useful when integrating SEO management
 * with existing application routes.
 */
export async function upsertSEOPage(
    data: SEOPageInput
) {
    const normalizedPath = normalizeSEOPath(data.path);

    return prisma.sEOPage.upsert({
        where: {
            path: normalizedPath,
        },
        create: {
            path: normalizedPath,
            title: data.title ?? null,
            description: data.description ?? null,
            keywords: normalizeKeywords(data.keywords),
            canonical: data.canonicalUrl ?? null,
            noIndex: data.noIndex ?? false,
            noFollow: data.noFollow ?? false,
            ogTitle: data.ogTitle ?? null,
            ogDescription: data.ogDescription ?? null,
            ogImage: data.ogImage ?? null,
        },
        update: {
            title: data.title ?? null,
            description: data.description ?? null,
            keywords: normalizeKeywords(data.keywords),
            canonical: data.canonicalUrl ?? null,
            noIndex: data.noIndex ?? false,
            noFollow: data.noFollow ?? false,
            ogTitle: data.ogTitle ?? null,
            ogDescription: data.ogDescription ?? null,
            ogImage: data.ogImage ?? null,
        },
        select: seoPageSelect,
    });
}

/* -------------------------------------------------------------------------- */
/* SEO Dashboard Data                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Return aggregated SEO information for the future SEO dashboard.
 *
 * The actual SEO scoring engine will be introduced in Phase 12.9.
 * This function currently provides database-level health metrics.
 */
export async function getSEODashboardStats() {
    const [
        totalPages,
        noIndexPages,
        noFollowPages,
        pagesWithoutTitle,
        pagesWithoutDescription,
        pagesWithoutCanonical,
    ] = await Promise.all([
        prisma.sEOPage.count(),

        prisma.sEOPage.count({
            where: {
                noIndex: true,
            },
        }),

        prisma.sEOPage.count({
            where: {
                noFollow: true,
            },
        }),

        prisma.sEOPage.count({
            where: {
                OR: [
                    {
                        title: null,
                    },
                    {
                        title: "",
                    },
                ],
            },
        }),

        prisma.sEOPage.count({
            where: {
                OR: [
                    {
                        description: null,
                    },
                    {
                        description: "",
                    },
                ],
            },
        }),

        prisma.sEOPage.count({
            where: {
                OR: [
                    {
                        canonical: null,
                    },
                    {
                        canonical: "",
                    },
                ],
            },
        }),
    ]);

    return {
        totalPages,
        noIndexPages,
        noFollowPages,
        pagesWithoutTitle,
        pagesWithoutDescription,
        pagesWithoutCanonical,
    };
}

/* -------------------------------------------------------------------------- */
/* Blog SEO                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get published blog posts for centralized SEO management.
 *
 * Existing Post SEO fields are reused rather than duplicated.
 */
export async function getBlogSEOData() {
    return prisma.post.findMany({
        where: {
            status: "PUBLISHED",
            deletedAt: null,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            seoTitle: true,
            seoDescription: true,
            seoKeywords: true,
            featuredImage: true,
            updatedAt: true,
            publishedAt: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
}

/**
 * Get SEO data for one blog post.
 */
export async function getBlogSEOById(
    id: string
) {
    return prisma.post.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            excerpt: true,
            seoTitle: true,
            seoDescription: true,
            seoKeywords: true,
            featuredImage: true,
            status: true,
            updatedAt: true,
            publishedAt: true,
        },
    });
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Normalize public route paths.
 *
 * Examples:
 *
 * ""          -> "/"
 * "/"         -> "/"
 * "/about/"   -> "/about"
 * "about"     -> "/about"
 */
export function normalizeSEOPath(
    path: string
): string {
    const trimmedPath = path.trim();

    if (!trimmedPath || trimmedPath === "/") {
        return "/";
    }

    const withLeadingSlash = trimmedPath.startsWith("/")
        ? trimmedPath
        : `/${trimmedPath}`;

    return withLeadingSlash.length > 1
        ? withLeadingSlash.replace(/\/+$/, "")
        : "/";
}

/**
 * Convert keyword arrays from the validation layer into the
 * comma-separated string used by the current Prisma model.
 */
export function normalizeKeywords(
    keywords?: string[] | null
): string | null {
    if (!keywords || keywords.length === 0) {
        return null;
    }

    const normalized = [
        ...new Set(
            keywords
                .map((keyword) => keyword.trim())
                .filter(Boolean)
        ),
    ];

    return normalized.length > 0
        ? normalized.join(", ")
        : null;
}