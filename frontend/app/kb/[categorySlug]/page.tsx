import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getCategoryBySlug } from "@/lib/services/knowledge-categories";
import { getArticles } from "@/lib/services/knowledge-articles";
import { resolveCategoryIcon } from "@/lib/kb/icons";
import { getSiteUrl } from "@/lib/kb/site";
import { buildBreadcrumbJsonLd } from "@/lib/kb/structured-data";

import KBBreadcrumbs from "@/components/kb/KBBreadcrumbs";
import KBArticleList from "@/components/kb/KBArticleList";
import KBPagination from "@/components/kb/KBPagination";
import JsonLd from "@/components/kb/JsonLd";

interface CategoryPageProps {
    params: Promise<{ categorySlug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PAGE_SIZE = 9;

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { categorySlug } = await params;
    const category = await getCategoryBySlug(categorySlug);

    if (!category || category.deletedAt) {
        return { title: "Category not found" };
    }

    const url = `${getSiteUrl()}/kb/${category.slug}`;
    const description =
        category.description ??
        `Browse ${category.name} articles in the Aformix Knowledge Base.`;

    return {
        title: category.name,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: category.name,
            description,
            url,
            type: "website",
        },
        twitter: {
            card: "summary",
            title: category.name,
            description,
        },
    };
}

export default async function CategoryPage({
    params,
    searchParams,
}: CategoryPageProps) {
    const { categorySlug } = await params;
    const rawParams = await searchParams;

    const page = Math.max(
        1,
        Number(
            typeof rawParams.page === "string" ? rawParams.page : "1"
        ) || 1
    );

    const category = await getCategoryBySlug(categorySlug);

    if (!category || category.deletedAt) {
        notFound();
    }

    const { articles, pagination } = await getArticles({
        categoryId: category.id,
        status: "PUBLISHED",
        visibility: "PUBLIC",
        includeDeleted: false,
        page,
        limit: PAGE_SIZE,
        sortBy: "publishedAt",
        sortOrder: "desc",
    });

    const Icon = resolveCategoryIcon(category.icon);
    const siteUrl = getSiteUrl();

    return (
        <div className="section-padding mx-auto max-w-5xl px-6">
            <JsonLd
                data={buildBreadcrumbJsonLd([
                    { name: "Knowledge Base", url: `${siteUrl}/kb` },
                    {
                        name: category.name,
                        url: `${siteUrl}/kb/${category.slug}`,
                    },
                ])}
            />

            <KBBreadcrumbs
                items={[
                    { label: "Knowledge Base", href: "/kb" },
                    { label: category.name },
                ]}
            />

            <div className="mt-6 flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Icon className="h-6 w-6" />
                </span>

                <div>
                    <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
                        {category.name}
                    </h1>

                    {category.description && (
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-10">
                <KBArticleList
                    articles={articles}
                    emptyMessage="No published articles in this category yet."
                />
            </div>

            <div className="mt-10">
                <KBPagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                />
            </div>
        </div>
    );
}
