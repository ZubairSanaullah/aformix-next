"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { WorkspaceButton } from "@/components/workspace/ui";

export interface ProjectPaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ProjectPaginationProps {
    pagination: ProjectPaginationData;
}

/**
 * Thin wrapper around the backend's pagination envelope
 * (getProjects() -> { page, limit, total, totalPages }). Does not
 * implement client-side pagination — every page change is a fresh
 * server request via the "page" URL param, per spec section 11.
 */
export default function ProjectPagination({
    pagination,
}: ProjectPaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { page, limit, total, totalPages } = pagination;

    if (total === 0) {
        return null;
    }

    function goToPage(nextPage: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(nextPage));
        router.push(`${pathname}?${params.toString()}`);
    }

    const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
    const rangeEnd = Math.min(page * limit, total);

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--workspace-border)] px-4 py-3 sm:flex-row">
            <p className="text-[11px] text-[var(--workspace-text-muted)]">
                Showing{" "}
                <span className="font-medium text-[var(--workspace-text)]">
                    {rangeStart}–{rangeEnd}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[var(--workspace-text)]">
                    {total}
                </span>{" "}
                projects
            </p>

            <div className="flex items-center gap-2">
                <WorkspaceButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                </WorkspaceButton>

                <span className="px-1 text-[11px] text-[var(--workspace-text-muted)]">
                    Page {page} of {Math.max(totalPages, 1)}
                </span>

                <WorkspaceButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                </WorkspaceButton>
            </div>
        </div>
    );
}
