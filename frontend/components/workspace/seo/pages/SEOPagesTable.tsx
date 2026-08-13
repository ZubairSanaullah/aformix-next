"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, ChevronLeft, ChevronRight, Pencil, Search } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceInput from "@/components/workspace/ui/WorkspaceInput";

import SEORobotsBadges from "@/components/workspace/seo/shared/SEORobotsBadges";
import { getScoreColorVar } from "@/components/workspace/seo/shared/seo-score-display";
import DeleteSEOPageButton from "./DeleteSEOPageButton";
import SEOPagesEmptyState from "./SEOPagesEmptyState";

export interface SEOPageListItem {
    id: string;
    path: string;
    title: string | null;
    description: string | null;
    noIndex: boolean;
    noFollow: boolean;
    score: number;
    criticalCount: number;
}

interface SEOPagesTableProps {
    initialPages: SEOPageListItem[];
}

const PAGE_SIZE = 10;

export default function SEOPagesTable({
    initialPages,
}: SEOPagesTableProps) {
    const [pages, setPages] = useState(initialPages);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const filteredPages = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return pages;
        }

        return pages.filter((item) => {
            return (
                item.path.toLowerCase().includes(normalizedQuery) ||
                item.title?.toLowerCase().includes(normalizedQuery) ||
                item.description?.toLowerCase().includes(normalizedQuery)
            );
        });
    }, [pages, query]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredPages.length / PAGE_SIZE)
    );

    const currentPage = Math.min(page, totalPages);

    const paginatedPages = filteredPages.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    function handleQueryChange(value: string) {
        setQuery(value);
        setPage(1);
    }

    function handleDeleted(pageId: string) {
        setPages((current) => current.filter((item) => item.id !== pageId));
    }

    if (pages.length === 0) {
        return <SEOPagesEmptyState variant="no-pages" />;
    }

    return (
        <div className="space-y-4">
            <WorkspaceCard padding="sm" className="flex items-center gap-2">
                <Search className="h-4 w-4 shrink-0 text-[var(--workspace-text-subtle)]" />

                <WorkspaceInput
                    placeholder="Search by path, title, or description..."
                    value={query}
                    onChange={(event) => handleQueryChange(event.target.value)}
                    className="border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
            </WorkspaceCard>

            {filteredPages.length === 0 ? (
                <SEOPagesEmptyState variant="no-results" query={query} />
            ) : (
                <WorkspaceCard padding="none" className="overflow-hidden">
                    <ul className="divide-y divide-[var(--workspace-border)]">
                        {paginatedPages.map((item) => (
                            <li
                                key={item.id}
                                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="truncate text-sm font-medium text-[var(--workspace-text)]">
                                            {item.title || item.path}
                                        </p>

                                        {item.criticalCount > 0 && (
                                            <span className="inline-flex items-center rounded-full bg-[var(--workspace-danger)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--workspace-danger)]">
                                                {item.criticalCount} critical
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-subtle)]">
                                        {item.path}
                                    </p>

                                    {item.description && (
                                        <p className="mt-1 line-clamp-1 text-xs text-[var(--workspace-text-muted)]">
                                            {item.description}
                                        </p>
                                    )}

                                    <SEORobotsBadges
                                        noIndex={item.noIndex}
                                        noFollow={item.noFollow}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                                    <span
                                        className="text-sm font-semibold"
                                        style={{
                                            color: `var(${getScoreColorVar(item.score)})`,
                                        }}
                                    >
                                        {item.score}
                                        <span className="text-[var(--workspace-text-subtle)]">
                                            /100
                                        </span>
                                    </span>

                                    <Link href={`/workspace/seo/pages/${item.id}/analysis`}>
                                        <WorkspaceButton
                                            variant="ghost"
                                            size="sm"
                                            aria-label={`View analysis for ${item.path}`}
                                        >
                                            <BarChart3 className="h-3.5 w-3.5" />
                                        </WorkspaceButton>
                                    </Link>

                                    <Link href={`/workspace/seo/pages/${item.id}/edit`}>
                                        <WorkspaceButton
                                            variant="secondary"
                                            size="sm"
                                            aria-label={`Edit ${item.path}`}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Edit
                                        </WorkspaceButton>
                                    </Link>

                                    <DeleteSEOPageButton
                                        pageId={item.id}
                                        pagePath={item.path}
                                        onDeleted={handleDeleted}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </WorkspaceCard>
            )}

            {filteredPages.length > PAGE_SIZE && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Page {currentPage} of {totalPages}
                    </p>

                    <div className="flex items-center gap-2">
                        <WorkspaceButton
                            variant="secondary"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setPage((current) => Math.max(1, current - 1))
                            }
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Prev
                        </WorkspaceButton>

                        <WorkspaceButton
                            variant="secondary"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setPage((current) =>
                                    Math.min(totalPages, current + 1)
                                )
                            }
                        >
                            Next
                            <ChevronRight className="h-3.5 w-3.5" />
                        </WorkspaceButton>
                    </div>
                </div>
            )}
        </div>
    );
}
