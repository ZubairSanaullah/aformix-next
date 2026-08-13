import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import { getArticles } from "@/lib/services/knowledge-articles";
import { getCategories } from "@/lib/services/knowledge-categories";
import { getKnowledgeBaseStats } from "@/lib/services/knowledge-stats";
import { articleListQuerySchema } from "@/lib/validations/knowledge-base";

import KnowledgeStatsCards from "@/components/workspace/knowledge/KnowledgeStatsCards";
import KnowledgeFilters from "@/components/workspace/knowledge/KnowledgeFilters";
import KnowledgeArticleTable from "@/components/workspace/knowledge/KnowledgeArticleTable";
import KnowledgePagination from "@/components/workspace/knowledge/KnowledgePagination";

export const metadata = {
    title: "Knowledge Base — Aformix Workspace",
};

interface KnowledgeDashboardPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function KnowledgeDashboardPage({
    searchParams,
}: KnowledgeDashboardPageProps) {
    // Admin-only, mirroring the API boundary rule from 15.5.
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }

        throw error;
    }

    const rawParams = await searchParams;

    const normalizedParams: Record<string, string> = {};

    for (const [key, value] of Object.entries(rawParams)) {
        if (typeof value === "string") {
            normalizedParams[key] = value;
        } else if (Array.isArray(value) && value.length > 0) {
            normalizedParams[key] = value[0];
        }
    }

    const parsedQuery = articleListQuerySchema.safeParse(normalizedParams);

    // Fall back to defaults rather than erroring the whole page on a bad
    // querystring (e.g. an old bookmark with a stale filter value).
    const query = parsedQuery.success
        ? parsedQuery.data
        : articleListQuerySchema.parse({});

    const [articlesResult, categoriesResult, stats] = await Promise.all([
        getArticles(query),
        getCategories({
            page: 1,
            limit: 100,
            includeDeleted: false,
            sortBy: "sortOrder",
            sortOrder: "asc",
        }),
        getKnowledgeBaseStats(),
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-[var(--workspace-text)]">
                        Knowledge Base
                    </h1>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Manage your documentation, guides, and help
                        articles.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/workspace/knowledge/categories"
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3.5 text-xs font-medium text-[var(--workspace-text)] shadow-[var(--workspace-shadow-sm)] transition-colors hover:bg-[var(--workspace-background)]"
                    >
                        Manage Categories
                    </Link>

                    <Link
                        href="/workspace/knowledge/articles/new"
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--workspace-primary)] px-3.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[var(--workspace-primary-hover)]"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        New Article
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <KnowledgeStatsCards stats={stats} />

            {/* Filters */}
            <KnowledgeFilters categories={categoriesResult.categories} />

            {/* Article table */}
            <KnowledgeArticleTable articles={articlesResult.articles} />

            {/* Pagination */}
            <KnowledgePagination pagination={articlesResult.pagination} />
        </div>
    );
}
