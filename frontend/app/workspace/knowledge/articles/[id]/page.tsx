import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Pencil, Star } from "lucide-react";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import { getArticleById } from "@/lib/services/knowledge-articles";

import { WorkspaceCard } from "@/components/workspace/ui";
import KnowledgeStatusBadge from "@/components/workspace/knowledge/KnowledgeStatusBadge";
import KnowledgeVisibilityBadge from "@/components/workspace/knowledge/KnowledgeVisibilityBadge";
import KnowledgeArticleActions from "@/components/workspace/knowledge/KnowledgeArticleActions";

// Reuses the same rendered-content styling as the editor (headings, lists,
// blockquotes, code blocks, images) without loading any editor JS.
import "@/components/workspace/editor/EditorStyles.css";

interface ArticleDetailPageProps {
    params: Promise<{ id: string }>;
}

function formatDateTime(date: string | Date | null) {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
}

export default async function ArticleDetailPage({
    params,
}: ArticleDetailPageProps) {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }

        throw error;
    }

    const { id } = await params;

    const article = await getArticleById(id, { includeDeleted: true });

    if (!article) {
        notFound();
    }

    const isDeleted = Boolean(article.deletedAt);

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Link
                href="/workspace/knowledge"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
            >
                <ArrowLeft className="h-3 w-3" />
                Knowledge Base
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-semibold text-[var(--workspace-text)]">
                            {article.title}
                        </h1>

                        {article.featured && (
                            <Star
                                className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
                                aria-label="Featured"
                            />
                        )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <KnowledgeStatusBadge status={article.status} />
                        <KnowledgeVisibilityBadge
                            visibility={article.visibility}
                        />

                        {isDeleted && (
                            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">
                                Archived
                            </span>
                        )}

                        {article.category && (
                            <span className="text-xs text-[var(--workspace-text-muted)]">
                                in {article.category.name}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <Link
                        href={`/workspace/knowledge/articles/${article.id}/edit`}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--workspace-primary)] px-3.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[var(--workspace-primary-hover)]"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </Link>

                    <KnowledgeArticleActions
                        articleId={article.id}
                        articleTitle={article.title}
                        isDeleted={isDeleted}
                    />
                </div>
            </div>

            {isDeleted && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-xs leading-5 text-amber-800">
                        This article is archived and hidden from the
                        default dashboard view. Use the restore action
                        above to bring it back.
                    </p>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Content */}
                <div className="lg:col-span-2">
                    <WorkspaceCard padding="lg">
                        {article.excerpt && (
                            <p className="mb-5 border-b border-[var(--workspace-border)] pb-5 text-sm italic leading-6 text-[var(--workspace-text-muted)]">
                                {article.excerpt}
                            </p>
                        )}

                        {/*
                          Content is authored exclusively by admins through
                          the TipTap editor (createArticleSchema requires
                          admin auth to write it). If this ever needs to
                          render on a public-facing page, run it through an
                          HTML sanitizer first — this admin-only preview
                          intentionally trusts the same content the author
                          just saved.
                        */}
                        <div
                            className="tiptap"
                            dangerouslySetInnerHTML={{
                                __html: article.content,
                            }}
                        />
                    </WorkspaceCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <WorkspaceCard padding="lg">
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                            Details
                        </h2>

                        <dl className="space-y-3 text-xs">
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[var(--workspace-text-muted)]">
                                    Slug
                                </dt>
                                <dd className="truncate font-mono text-[var(--workspace-text)]">
                                    {article.slug}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[var(--workspace-text-muted)]">
                                    Category
                                </dt>
                                <dd className="truncate text-[var(--workspace-text)]">
                                    {article.category?.name ??
                                        "Uncategorized"}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[var(--workspace-text-muted)]">
                                    Author
                                </dt>
                                <dd className="truncate text-[var(--workspace-text)]">
                                    {article.author?.name ||
                                        article.author?.email ||
                                        "Unknown"}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[var(--workspace-text-muted)]">
                                    Published
                                </dt>
                                <dd className="text-[var(--workspace-text)]">
                                    {formatDateTime(article.publishedAt)}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[var(--workspace-text-muted)]">
                                    Created
                                </dt>
                                <dd className="text-[var(--workspace-text)]">
                                    {formatDateTime(article.createdAt)}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[var(--workspace-text-muted)]">
                                    Last updated
                                </dt>
                                <dd className="text-[var(--workspace-text)]">
                                    {formatDateTime(article.updatedAt)}
                                </dd>
                            </div>
                        </dl>
                    </WorkspaceCard>

                    {(article.metaTitle ||
                        article.metaDescription ||
                        article.canonicalUrl) && (
                        <WorkspaceCard padding="lg">
                            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                SEO
                            </h2>

                            <dl className="space-y-3 text-xs">
                                {article.metaTitle && (
                                    <div>
                                        <dt className="text-[var(--workspace-text-muted)]">
                                            Meta title
                                        </dt>
                                        <dd className="mt-0.5 text-[var(--workspace-text)]">
                                            {article.metaTitle}
                                        </dd>
                                    </div>
                                )}

                                {article.metaDescription && (
                                    <div>
                                        <dt className="text-[var(--workspace-text-muted)]">
                                            Meta description
                                        </dt>
                                        <dd className="mt-0.5 leading-5 text-[var(--workspace-text)]">
                                            {article.metaDescription}
                                        </dd>
                                    </div>
                                )}

                                {article.canonicalUrl && (
                                    <div>
                                        <dt className="text-[var(--workspace-text-muted)]">
                                            Canonical URL
                                        </dt>
                                        <dd className="mt-0.5 truncate">
                                            <a
                                                href={article.canonicalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--workspace-primary)] hover:underline"
                                            >
                                                {article.canonicalUrl}
                                            </a>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </WorkspaceCard>
                    )}
                </div>
            </div>
        </div>
    );
}
