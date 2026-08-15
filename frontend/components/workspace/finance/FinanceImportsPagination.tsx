"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface FinanceImportsPaginationProps {
    pagination: PaginationData;
}

export default function FinanceImportsPagination({
    pagination,
}: FinanceImportsPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(newPage));
        router.push(`?${params.toString()}`);
    };

    if (pagination.totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between border-t border-[var(--workspace-border)] px-4 py-3">
            <div className="text-xs text-[var(--workspace-text-muted)]">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="
            inline-flex
            items-center
            justify-center
            h-8
            w-8
            rounded-lg
            border
            border-[var(--workspace-border)]
            bg-[var(--workspace-background)]
            text-[var(--workspace-text)]
            transition-colors
            hover:bg-[var(--workspace-card-background)]
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="
            inline-flex
            items-center
            justify-center
            h-8
            w-8
            rounded-lg
            border
            border-[var(--workspace-border)]
            bg-[var(--workspace-background)]
            text-[var(--workspace-text)]
            transition-colors
            hover:bg-[var(--workspace-card-background)]
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
