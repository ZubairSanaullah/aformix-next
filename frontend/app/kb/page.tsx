import type { Metadata } from "next";

import { getCategories } from "@/lib/services/knowledge-categories";
import { getArticles } from "@/lib/services/knowledge-articles";
import { getSiteUrl } from "@/lib/kb/site";
import { buildWebsiteSearchJsonLd } from "@/lib/kb/structured-data";

import KBSearchBar from "@/components/kb/KBSearchBar";
import KBCategoryGrid from "@/components/kb/KBCategoryGrid";
import KBArticleList from "@/components/kb/KBArticleList";
import KBPagination from "@/components/kb/KBPagination";
import JsonLd from "@/components/kb/JsonLd";

interface KBHomePageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PAGE_SIZE = 9;

export const metadata: Metadata = {
    alternates: { canonical: `${getSiteUrl()}/kb` },
};

export default async function KBHomePage({
    searchParams,
}: KBHomePageProps) {
    const rawParams = await searchParams;

    const search =
        typeof rawParams.search === "string" ? rawParams.search.trim() : "";

    const page = Math.max(
        1,
        Number(
            typeof rawParams.page === "string" ? rawParams.page : "1"
        ) || 1
    );

    /*
     * Public queries never go through requireAdmin() — they hit the
     * services directly with a fixed, non-negotiable filter:
     * PUBLISHED + PUBLIC + not deleted. This is the entire access-control
     * boundary for this route, since there's no session to check.
     */

    if (search) {
        const { articles, pagination } = await getArticles({
            search,
            status: "PUBLISHED",
            visibility: "PUBLIC",
            includeDeleted: false,
            page,
            limit: PAGE_SIZE,
            sortBy: "publishedAt",
            sortOrder: "desc",
        });

        return (
            <div className="section-padding mx-auto max-w-5xl px-6">
                <div className="mb-10">
                    <h1 className="heading-2">Search results</h1>

                    <div className="mx-auto mt-4 max-w-lg">
                        <KBSearchBar />
                    </div>

                    <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
                        {pagination.total}{" "}
                        {pagination.total === 1 ? "result" : "results"} for
                        &ldquo;{search}&rdquo;
                    </p>
                </div>

                <KBArticleList
                    articles={articles}
                    emptyMessage={`No articles matched "${search}". Try a different search term.`}
                />

                <div className="mt-10">
                    <KBPagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                    />
                </div>
            </div>
        );
    }

    const [{ categories }, { articles: featuredArticles }] =
        await Promise.all([
            getCategories({
                page: 1,
                limit: 50,
                includeDeleted: false,
                sortBy: "sortOrder",
                sortOrder: "asc",
            }),
            getArticles({
                status: "PUBLISHED",
                visibility: "PUBLIC",
                featured: true,
                includeDeleted: false,
                page: 1,
                limit: 6,
                sortBy: "publishedAt",
                sortOrder: "desc",
            }),
        ]);

    return (
        <>
            {/* Only on the browse view — a search-results page shouldn't
                also claim to be the sitelinks searchbox target. */}
            <JsonLd data={buildWebsiteSearchJsonLd()} />

            {/* Hero */}
            <section className="section-padding mx-auto max-w-3xl px-6 text-center">
                <h1 className="heading-1">
                    How can we <span className="gradient-text">help?</span>
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--color-text-muted)]">
                    Search our guides and documentation, or browse by
                    category below.
                </p>

                <div className="mx-auto mt-8 max-w-xl">
                    <KBSearchBar />
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="mx-auto max-w-5xl px-6 pb-16">
                    <h2 className="mb-6 text-xl font-bold text-[var(--color-text)]">
                        Browse by category
                    </h2>

                    <KBCategoryGrid categories={categories} />
                </section>
            )}

            {/* Featured */}
            {featuredArticles.length > 0 && (
                <section className="mx-auto max-w-5xl px-6 pb-24">
                    <h2 className="mb-6 text-xl font-bold text-[var(--color-text)]">
                        Featured articles
                    </h2>

                    <KBArticleList articles={featuredArticles} />
                </section>
            )}
        </>
    );
}
