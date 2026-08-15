/**
 * Pulls the first <img src="..."> out of article HTML to use as an
 * OpenGraph fallback image, since createArticleSchema has no dedicated
 * featured-image field. A simple regex is enough here — this only needs
 * to run against already-admin-authored content at metadata-generation
 * time, not parse arbitrary untrusted HTML.
 *
 * Returns null if the article has no images, in which case the OG tags
 * simply omit an image (Open Graph is optional per-field; most platforms
 * fall back to a site-level default image if one is configured elsewhere).
 */
export function extractFirstImage(html: string): string | null {
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match?.[1] ?? null;
}
