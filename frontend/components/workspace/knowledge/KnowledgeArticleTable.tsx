import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

import {
    WorkspaceEmptyState,
    WorkspaceTable,
    WorkspaceTableBody,
    WorkspaceTableCell,
    WorkspaceTableHead,
    WorkspaceTableHeader,
    WorkspaceTableRow,
} from "@/components/workspace/ui";

import KnowledgeStatusBadge from "./KnowledgeStatusBadge";
import KnowledgeVisibilityBadge from "./KnowledgeVisibilityBadge";
import KnowledgeArticleActions from "./KnowledgeArticleActions";
import type { KnowledgeArticleListItem } from "./types";

interface KnowledgeArticleTableProps {
    articles: KnowledgeArticleListItem[];
}

function formatDate(date: string | Date | null) {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function KnowledgeArticleTable({
    articles,
}: KnowledgeArticleTableProps) {
    if (!articles.length) {
        return (
            <WorkspaceEmptyState
                title="No articles found"
                description="No articles match your current filters. Create an article or adjust your search criteria."
            />
        );
    }

    return (
        <WorkspaceTable>
            <WorkspaceTableHeader>
                <WorkspaceTableRow>
                    <WorkspaceTableHead>Article</WorkspaceTableHead>
                    <WorkspaceTableHead>Category</WorkspaceTableHead>
                    <WorkspaceTableHead>Status</WorkspaceTableHead>
                    <WorkspaceTableHead>Visibility</WorkspaceTableHead>
                    <WorkspaceTableHead>Author</WorkspaceTableHead>
                    <WorkspaceTableHead>Updated</WorkspaceTableHead>
                    <WorkspaceTableHead>Actions</WorkspaceTableHead>
                </WorkspaceTableRow>
            </WorkspaceTableHeader>

            <WorkspaceTableBody>
                {articles.map((article) => (
                    <WorkspaceTableRow key={article.id}>
                        {/* Article */}
                        <WorkspaceTableCell>
                            <div className="min-w-[240px]">
                                <Link
                                    href={`/workspace/knowledge/articles/${article.id}`}
                                    className="group flex items-start gap-2.5"
                                >
                                    <span className="min-w-0">
                                        <span className="flex items-center gap-1.5">
                                            <span className="block truncate text-xs font-semibold text-[var(--workspace-text)] transition-colors group-hover:text-[var(--workspace-primary)]">
                                                {article.title}
                                            </span>

                                            {article.featured && (
                                                <Star
                                                    className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400"
                                                    aria-label="Featured"
                                                />
                                            )}
                                        </span>

                                        {article.excerpt && (
                                            <span className="mt-1 block line-clamp-1 text-[10px] leading-4 text-[var(--workspace-text-subtle)]">
                                                {article.excerpt}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            </div>
                        </WorkspaceTableCell>

                        {/* Category */}
                        <WorkspaceTableCell>
                            <span className="text-xs text-[var(--workspace-text-muted)]">
                                {article.category?.name ?? "Uncategorized"}
                            </span>
                        </WorkspaceTableCell>

                        {/* Status */}
                        <WorkspaceTableCell>
                            <KnowledgeStatusBadge status={article.status} />
                        </WorkspaceTableCell>

                        {/* Visibility */}
                        <WorkspaceTableCell>
                            <KnowledgeVisibilityBadge
                                visibility={article.visibility}
                            />
                        </WorkspaceTableCell>

                        {/* Author */}
                        <WorkspaceTableCell>
                            <span className="block min-w-[120px] truncate text-xs text-[var(--workspace-text-muted)]">
                                {article.author?.name ||
                                    article.author?.email ||
                                    "Unknown"}
                            </span>
                        </WorkspaceTableCell>

                        {/* Updated */}
                        <WorkspaceTableCell>
                            <span className="text-xs text-[var(--workspace-text-muted)]">
                                {formatDate(article.updatedAt)}
                            </span>
                        </WorkspaceTableCell>

                        {/* Actions */}
                        <WorkspaceTableCell>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/workspace/knowledge/articles/${article.id}`}
                                    aria-label={`View ${article.title}`}
                                    title="View article"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                >
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>

                                <KnowledgeArticleActions
                                    articleId={article.id}
                                    articleTitle={article.title}
                                    isDeleted={Boolean(article.deletedAt)}
                                />
                            </div>
                        </WorkspaceTableCell>
                    </WorkspaceTableRow>
                ))}
            </WorkspaceTableBody>
        </WorkspaceTable>
    );
}
