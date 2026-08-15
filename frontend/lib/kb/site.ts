/**
 * Central source of truth for the KB's public base URL — used for
 * canonical URLs, OpenGraph og:url, and sitemap <loc> entries.
 *
 * Set NEXT_PUBLIC_SITE_URL in your environment, e.g.:
 *   NEXT_PUBLIC_SITE_URL=https://aformix.com
 *
 * Falls back to a placeholder so nothing crashes in local dev if it's
 * unset, but production SEO will be wrong (canonical/OG URLs pointing at
 * the placeholder domain) until this env var is actually set.
 */
export function getSiteUrl(): string {
    const url = process.env.NEXT_PUBLIC_SITE_URL;

    if (!url) {
        return "https://aformix.com";
    }

    return url.replace(/\/+$/, "");
}
