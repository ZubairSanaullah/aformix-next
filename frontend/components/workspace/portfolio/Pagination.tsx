"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
}

export default function Pagination({ page, pageSize, total }: PaginationProps) {
    const searchParams = useSearchParams();

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    if (totalPages <= 1) {
        return null;
    }

    function buildUrl(nextPage: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(nextPage));

        const query = params.toString();
        return query ? `/workspace/portfolio?${query}` : "/workspace/portfolio";
    }

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
        <div className="flex flex-col gap-3 border-t border-[var(--workspace-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-[var(--workspace-text-muted)] sm:text-xs">
                Showing{" "}
                <span className="font-medium text-[var(--workspace-text)]">
                    {start}–{end}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[var(--workspace-text)]">
                    {total}
                </span>{" "}
                projects
            </p>

            <div className="flex items-center gap-1.5">
                <Link
                    href={buildUrl(Math.max(1, page - 1))}
                    aria-disabled={page === 1}
                    className={page === 1 ? "pointer-events-none opacity-40" : undefined}
                >
                    <WorkspaceButton variant="secondary" size="sm" disabled={page === 1}>
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                    </WorkspaceButton>
                </Link>

                <div className="flex h-8 items-center rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-[10px] font-medium text-[var(--workspace-text-muted)]">
                    {page} / {totalPages}
                </div>

                <Link
                    href={buildUrl(Math.min(totalPages, page + 1))}
                    aria-disabled={page === totalPages}
                    className={
                        page === totalPages ? "pointer-events-none opacity-40" : undefined
                    }
                >
                    <WorkspaceButton
                        variant="secondary"
                        size="sm"
                        disabled={page === totalPages}
                    >
                        Next
                        <ChevronRight className="h-3.5 w-3.5" />
                    </WorkspaceButton>
                </Link>
            </div>
        </div>
    );
}