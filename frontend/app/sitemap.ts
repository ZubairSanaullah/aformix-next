import type { MetadataRoute } from "next";

import { getKbSitemapEntries } from "@/lib/kb/sitemap";

/**
 * ⚠️ CHECK BEFORE DROPPING THIS IN: Next.js only uses ONE sitemap.ts per
 * route segment. If app/sitemap.ts already exists in your project (very
 * possible, given you already have a Blog CMS with its own SEO setup),
 * do NOT overwrite it with this file — instead, import
 * getKbSitemapEntries() from lib/kb/sitemap.ts into your existing
 * sitemap.ts and spread it into your existing array. See the usage
 * example in that file's docblock.
 *
 * Only use this file as-is if app/sitemap.ts doesn't exist yet.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return getKbSitemapEntries();
}
