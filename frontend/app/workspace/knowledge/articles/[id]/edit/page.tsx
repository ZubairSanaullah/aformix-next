import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import { getArticleById } from "@/lib/services/knowledge-articles";
import { getCategories } from "@/lib/services/knowledge-categories";

import KnowledgeArticleForm from "@/components/workspace/knowledge/KnowledgeArticleForm";
import type { KnowledgeArticleDetail } from "@/components/workspace/knowledge/types";

interface EditKnowledgeArticlePageProps {
    params: Promise<{ id: string }>;
}

export const metadata = {
    title: "Edit Article — Knowledge Base — Aformix Workspace",
};

export default async function EditKnowledgeArticlePage({
    params,
}: EditKnowledgeArticlePageProps) {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }

        throw error;
    }

    const { id } = await params;

    const [article, categoriesResult] = await Promise.all([
        getArticleById(id, { includeDeleted: true }),
        getCategories({
            page: 1,
            limit: 100,
            includeDeleted: false,
            sortBy: "sortOrder",
            sortOrder: "asc",
        }),
    ]);

    if (!article) {
        notFound();
    }

    // Normalize whatever getArticleById() returns into the flat shape
    // KnowledgeArticleForm expects. If the service returns a `category`
    // relation object rather than a raw `categoryId`, fall back to its id.
    const formArticle: KnowledgeArticleDetail = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt ?? null,
        content: article.content,
        categoryId: article.categoryId ?? article.category?.id ?? "",
        status: article.status,
        visibility: article.visibility,
        featured: article.featured,
        sortOrder: article.sortOrder,
        publishedAt: article.publishedAt ?? null,
        metaTitle: article.metaTitle ?? null,
        metaDescription: article.metaDescription ?? null,
        canonicalUrl: article.canonicalUrl ?? null,
    };

    const isDeleted = Boolean(article.deletedAt);

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href={`/workspace/knowledge/articles/${article.id}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                >
                    <ArrowLeft className="h-3 w-3" />
                    {article.title}
                </Link>

                <h1 className="mt-2 text-xl font-semibold text-[var(--workspace-text)]">
                    Edit Article
                </h1>

                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    Update the content and settings for this article.
                </p>
            </div>

            {isDeleted && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-xs leading-5 text-amber-800">
                        This article is currently archived. Saving changes
                        here won&apos;t restore it — use the restore action
                        from the dashboard if you want it live again.
                    </p>
                </div>
            )}

            <KnowledgeArticleForm
                article={formArticle}
                categories={categoriesResult.categories}
            />
        </div>
    );
}
