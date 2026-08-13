"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { KnowledgePaginationInfo } from "./types";

interface KnowledgePaginationProps {
    pagination: KnowledgePaginationInfo;
}

export default function KnowledgePagination({
    pagination,
}: KnowledgePaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { page, totalPages, total, limit } = pagination;

    function goToPage(nextPage: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(nextPage));
        router.push(`${pathname}?${params.toString()}`);
    }

    if (totalPages <= 1) {
        return (
            <p className="text-xs text-[var(--workspace-text-subtle)]">
                {total} {total === 1 ? "article" : "articles"} total
            </p>
        );
    }

    const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
    const rangeEnd = Math.min(page * limit, total);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--workspace-text-subtle)]">
                Showing {rangeStart}–{rangeEnd} of {total} articles
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2.5 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                </button>

                <span className="px-2 text-xs text-[var(--workspace-text-muted)]">
                    Page {page} of {totalPages}
                </span>

                <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2.5 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}
