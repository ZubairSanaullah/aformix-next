export interface SEOPreviewUrlParts {
    url: string;
    domain: string;
}

const FALLBACK_DOMAIN = "yoursite.com";

/**
 * Derive a display URL and domain for metadata previews.
 *
 * Pages/settings don't store a domain directly — only an optional
 * `canonicalUrl`. When present and parseable, use its hostname; otherwise
 * fall back to a generic placeholder domain plus the given path so the
 * preview still renders something reasonable.
 */
export function getSEOPreviewUrlParts(
    canonicalUrl: string,
    fallbackPath: string
): SEOPreviewUrlParts {
    const trimmed = canonicalUrl.trim();

    if (trimmed) {
        try {
            const parsed = new URL(trimmed);

            return {
                url: `${parsed.hostname}${parsed.pathname}`,
                domain: parsed.hostname,
            };
        } catch {
            // Not a valid absolute URL yet (e.g. still being typed) — fall
            // through to the placeholder below rather than showing an error.
        }
    }

    const path = fallbackPath.trim() || "/";

    return {
        url: `${FALLBACK_DOMAIN}${path}`,
        domain: FALLBACK_DOMAIN,
    };
}
