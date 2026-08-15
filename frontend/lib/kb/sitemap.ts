import type { MetadataRoute } from "next";

import { getArticles } from "@/lib/services/knowledge-articles";
import { getCategories } from "@/lib/services/knowledge-categories";
import { getSiteUrl } from "./site";

async function getAllPublicArticles() {
    const limit = 100;
    let page = 1;
    let totalPages = 1;

    const all: Awaited<ReturnType<typeof getArticles>>["articles"] = [];

    do {
        const result = await getArticles({
            status: "PUBLISHED",
            visibility: "PUBLIC",
            includeDeleted: false,
            page,
            limit,
            sortBy: "updatedAt",
            sortOrder: "desc",
        });

        all.push(...result.articles);
        totalPages = result.pagination.totalPages;
        page += 1;
    } while (page <= totalPages);

    return all;
}

/**
 * Returns sitemap entries for every public KB category + article.
 *
 * Import this into your project's existing app/sitemap.ts and spread it
 * into your existing entries array, e.g.:
 *
 *   import { getKbSitemapEntries } from "@/lib/kb/sitemap";
 *
 *   export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 *       return [
 *           ...yourExistingMarketingPages,
 *           ...yourExistingBlogPosts,
 *           ...(await getKbSitemapEntries()),
 *       ];
 *   }
 *
 * If you don't have an app/sitemap.ts yet, use the standalone
 * app/sitemap.ts included in this delivery as-is.
 */
export async function getKbSitemapEntries(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl();

    const [{ categories }, articles] = await Promise.all([
        getCategories({
            page: 1,
            limit: 200,
            includeDeleted: false,
            sortBy: "sortOrder",
            sortOrder: "asc",
        }),
        getAllPublicArticles(),
    ]);

    const categoryEntries: MetadataRoute.Sitemap = categories.map(
        (category) => ({
            url: `${siteUrl}/kb/${category.slug}`,
            lastModified: new Date(category.updatedAt),
            changeFrequency: "weekly",
            priority: 0.6,
        })
    );

    const articleEntries: MetadataRoute.Sitemap = articles
        .filter((article) => Boolean(article.category))
        .map((article) => ({
            url: `${siteUrl}/kb/${article.category!.slug}/${article.slug}`,
            lastModified: new Date(article.updatedAt),
            changeFrequency: "monthly",
            priority: article.featured ? 0.9 : 0.7,
        }));

    return [
        {
            url: `${siteUrl}/kb`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        ...categoryEntries,
        ...articleEntries,
    ];
}
