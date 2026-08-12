import type { Metadata } from "next";

import type {
    SEOPageInput,
    SEOSettingsInput,
} from "@/lib/validations/seo";

export type SEOPageMetadataInput = SEOPageInput & {
    canonical?: string | null;
    keywords?: string[] | string | null;
};

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface SEOMetadataInput {
    settings?: SEOSettingsInput | null;
    page?: SEOPageMetadataInput | null;
    fallbackTitle?: string;
    fallbackDescription?: string;
    fallbackCanonicalUrl?: string;
    fallbackOgImage?: string;
}

export interface SEOMetadataOptions {
    siteUrl?: string;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_TITLE = "Aformix";

const DEFAULT_DESCRIPTION =
    "Aformix helps businesses manage their digital work, content, clients, and growth from one modern workspace.";

const DEFAULT_ROBOTS_INDEX = true;
const DEFAULT_ROBOTS_FOLLOW = true;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Returns the first non-empty string value.
 */
function firstNonEmpty(
    ...values: Array<string | null | undefined>
): string | undefined {
    for (const value of values) {
        if (typeof value !== "string") {
            continue;
        }

        const trimmed = value.trim();

        if (trimmed) {
            return trimmed;
        }
    }

    return undefined;
}

/**
 * Removes trailing slashes from a site URL.
 */
function normalizeSiteUrl(
    value?: string,
): string | undefined {
    if (!value) {
        return undefined;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return undefined;
    }

    return trimmed.replace(/\/+$/, "");
}

/**
 * Converts a relative URL into an absolute URL when a site URL
 * is available.
 */
function resolveUrl(
    value: string | null | undefined,
    siteUrl?: string,
): string | undefined {
    const url = firstNonEmpty(value);

    if (!url) {
        return undefined;
    }

    if (/^https?:\/\//i.test(url)) {
        return url;
    }

    if (!url.startsWith("/")) {
        return undefined;
    }

    const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

    if (!normalizedSiteUrl) {
        return url;
    }

    return `${normalizedSiteUrl}${url}`;
}

/**
 * Creates a canonical URL for a page path.
 */
function buildCanonicalUrl(
    path: string | undefined,
    siteUrl?: string,
): string | undefined {
    if (!path) {
        return undefined;
    }

    const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

    if (!normalizedSiteUrl) {
        return path;
    }

    const normalizedPath = path.startsWith("/")
        ? path
        : `/${path}`;

    return `${normalizedSiteUrl}${normalizedPath}`;
}

/**
 * Converts an SEO keyword string into a metadata keyword array.
 *
 * The database/service layer may store keywords as a comma-separated
 * string, while Next.js metadata expects an array.
 */
function parseKeywords(
    keywords?: string | null,
): string[] | undefined {
    if (!keywords) {
        return undefined;
    }

    const parsed = keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

    return parsed.length > 0 ? parsed : undefined;
}

function normalizePageKeywords(
    keywords?: string[] | string | null,
): string[] | undefined {
    if (!keywords) {
        return undefined;
    }

    if (Array.isArray(keywords)) {
        const normalized = keywords
            .map((keyword) => keyword.trim())
            .filter(Boolean);

        return normalized.length > 0 ? normalized : undefined;
    }

    return parseKeywords(keywords);
}

/* -------------------------------------------------------------------------- */
/* Public Metadata Builder                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Builds Next.js Metadata from global SEO settings and page-level SEO data.
 *
 * Page-level values take precedence over global settings.
 * Global settings act as fallbacks.
 */
export function buildSEOMetadata(
    input: SEOMetadataInput = {},
    options: SEOMetadataOptions = {},
): Metadata {
    const {
        settings,
        page,
        fallbackTitle = DEFAULT_TITLE,
        fallbackDescription = DEFAULT_DESCRIPTION,
        fallbackCanonicalUrl,
        fallbackOgImage,
    } = input;

    const siteUrl =
        normalizeSiteUrl(options.siteUrl) ??
        normalizeSiteUrl(
            settings?.canonicalUrl ?? undefined,
        );

    const title =
        firstNonEmpty(
            page?.title,
            settings?.siteTitle,
            fallbackTitle,
        ) ?? DEFAULT_TITLE;

    const description =
        firstNonEmpty(
            page?.description,
            settings?.siteDescription,
            fallbackDescription,
        ) ?? DEFAULT_DESCRIPTION;

    const canonical =
        resolveUrl(
            page?.canonical ?? page?.canonicalUrl,
            siteUrl,
        ) ??
        resolveUrl(
            settings?.canonicalUrl,
            siteUrl,
        ) ??
        resolveUrl(
            fallbackCanonicalUrl,
            siteUrl,
        );

    const ogTitle =
        firstNonEmpty(
            page?.ogTitle,
            page?.title,
            settings?.siteTitle,
            fallbackTitle,
        ) ?? DEFAULT_TITLE;

    const ogDescription =
        firstNonEmpty(
            page?.ogDescription,
            page?.description,
            settings?.siteDescription,
            fallbackDescription,
        ) ?? DEFAULT_DESCRIPTION;

    const ogImage =
        resolveUrl(
            page?.ogImage,
            siteUrl,
        ) ??
        resolveUrl(
            settings?.defaultOgImage,
            siteUrl,
        ) ??
        resolveUrl(
            fallbackOgImage,
            siteUrl,
        );

    const keywords =
        normalizePageKeywords(page?.keywords);

    const robotsIndex =
        page?.noIndex === true
            ? false
            : settings?.defaultRobotsIndex === "INDEX"
                ? true
                : settings?.defaultRobotsIndex === "NOINDEX"
                    ? false
                    : DEFAULT_ROBOTS_INDEX;

    const robotsFollow =
        page?.noFollow === true
            ? false
            : settings?.defaultRobotsFollow === "FOLLOW"
                ? true
                : settings?.defaultRobotsFollow === "NOFOLLOW"
                    ? false
                    : DEFAULT_ROBOTS_FOLLOW;

    const metadata: Metadata = {
        title,
        description,

        ...(keywords
            ? {
                  keywords,
              }
            : {}),

        robots: {
            index: robotsIndex,
            follow: robotsFollow,
        },

        openGraph: {
            title: ogTitle,
            description: ogDescription,
            type: "website",
            ...(canonical
                ? {
                      url: canonical,
                  }
                : {}),
            ...(ogImage
                ? {
                      images: [
                          {
                              url: ogImage,
                              alt: ogTitle,
                          },
                      ],
                  }
                : {}),
        },

        twitter: {
            card: ogImage
                ? "summary_large_image"
                : "summary",
            title: ogTitle,
            description: ogDescription,
            ...(ogImage
                ? {
                      images: [ogImage],
                  }
                : {}),
        },

        ...(canonical
            ? {
                  alternates: {
                      canonical,
                  },
              }
            : {}),
    };

    return metadata;
}

/* -------------------------------------------------------------------------- */
/* Page Metadata Builder                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Builds metadata specifically for a configured SEO page.
 *
 * This helper is useful inside Next.js route/page `generateMetadata`
 * implementations.
 */
export function buildSEOPageMetadata(
    page: SEOPageInput | null | undefined,
    settings?: SEOSettingsInput | null,
    options?: SEOMetadataOptions,
): Metadata {
    return buildSEOMetadata(
        {
            page,
            settings,
        },
        options,
    );
}

/* -------------------------------------------------------------------------- */
/* Default Metadata                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Returns the application's default SEO metadata.
 *
 * Useful as a safe fallback when no database SEO configuration exists.
 */
export function getDefaultSEOMetadata(
    options?: SEOMetadataOptions,
): Metadata {
    return buildSEOMetadata(
        {
            fallbackTitle: DEFAULT_TITLE,
            fallbackDescription: DEFAULT_DESCRIPTION,
        },
        options,
    );
}

/* -------------------------------------------------------------------------- */
/* Robots Utilities                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Builds a robots configuration from SEO page settings.
 *
 * Page-level noIndex/noFollow flags override global defaults.
 */
export function buildSEORobots(
    page?: Pick<
        SEOPageInput,
        "noIndex" | "noFollow"
    > | null,
    settings?: Pick<
        SEOSettingsInput,
        "defaultRobotsIndex" | "defaultRobotsFollow"
    > | null,
): Metadata["robots"] {
    const index =
        page?.noIndex === true
            ? false
            : settings?.defaultRobotsIndex === "INDEX"
                ? true
                : settings?.defaultRobotsIndex === "NOINDEX"
                    ? false
                    : DEFAULT_ROBOTS_INDEX;

    const follow =
        page?.noFollow === true
            ? false
            : settings?.defaultRobotsFollow === "FOLLOW"
                ? true
                : settings?.defaultRobotsFollow === "NOFOLLOW"
                    ? false
                    : DEFAULT_ROBOTS_FOLLOW;

    return {
        index,
        follow,
    };
}

/* -------------------------------------------------------------------------- */
/* Open Graph Utilities                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Builds Open Graph metadata independently of the complete metadata object.
 *
 * Useful when a consumer needs to extend or merge the generated metadata.
 */
export function buildSEOOpenGraph(
    input: SEOMetadataInput = {},
    options: SEOMetadataOptions = {},
): NonNullable<Metadata["openGraph"]> {
    const {
        settings,
        page,
        fallbackTitle = DEFAULT_TITLE,
        fallbackDescription = DEFAULT_DESCRIPTION,
        fallbackOgImage,
    } = input;

    const siteUrl = normalizeSiteUrl(options.siteUrl);

    const title =
        firstNonEmpty(
            page?.ogTitle,
            page?.title,
            settings?.siteTitle,
            fallbackTitle,
        ) ?? DEFAULT_TITLE;

    const description =
        firstNonEmpty(
            page?.ogDescription,
            page?.description,
            settings?.siteDescription,
            fallbackDescription,
        ) ?? DEFAULT_DESCRIPTION;

    const image =
        resolveUrl(
            page?.ogImage,
            siteUrl,
        ) ??
        resolveUrl(
            settings?.defaultOgImage,
            siteUrl,
        ) ??
        resolveUrl(
            fallbackOgImage,
            siteUrl,
        );

    return {
        title,
        description,
        type: "website",
        ...(image
            ? {
                  images: [
                      {
                          url: image,
                          alt: title,
                      },
                  ],
              }
            : {}),
    };
}

/* -------------------------------------------------------------------------- */
/* Twitter Utilities                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Builds Twitter card metadata.
 */
export function buildSEOTwitter(
    input: SEOMetadataInput = {},
    options: SEOMetadataOptions = {},
): NonNullable<Metadata["twitter"]> {
    const {
        settings,
        page,
        fallbackTitle = DEFAULT_TITLE,
        fallbackDescription = DEFAULT_DESCRIPTION,
        fallbackOgImage,
    } = input;

    const siteUrl = normalizeSiteUrl(options.siteUrl);

    const title =
        firstNonEmpty(
            page?.ogTitle,
            page?.title,
            settings?.siteTitle,
            fallbackTitle,
        ) ?? DEFAULT_TITLE;

    const description =
        firstNonEmpty(
            page?.ogDescription,
            page?.description,
            settings?.siteDescription,
            fallbackDescription,
        ) ?? DEFAULT_DESCRIPTION;

    const image =
        resolveUrl(
            page?.ogImage,
            siteUrl,
        ) ??
        resolveUrl(
            settings?.defaultOgImage,
            siteUrl,
        ) ??
        resolveUrl(
            fallbackOgImage,
            siteUrl,
        );

    return {
        card: image
            ? "summary_large_image"
            : "summary",
        title,
        description,
        ...(image
            ? {
                  images: [image],
              }
            : {}),
    };
}