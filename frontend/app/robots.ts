import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/kb/site";

/**
 * ⚠️ SAME CHECK AS app/sitemap.ts: Next.js only uses ONE robots.ts per
 * route segment. If app/robots.ts already exists in your project, don't
 * overwrite it — instead merge the two rules below (disallow /workspace
 * and /api, allow /kb) into your existing rules array.
 *
 * Only use this file as-is if app/robots.ts doesn't exist yet.
 */
export default function robots(): MetadataRoute.Robots {
    const siteUrl = getSiteUrl();

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/kb",
                disallow: ["/workspace", "/api"],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
