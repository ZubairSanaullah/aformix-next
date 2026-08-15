"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface FinanceTransactionPaginationProps {
    pagination: PaginationData;
}

export default function FinanceTransactionPagination({
    pagination,
}: FinanceTransactionPaginationProps) {
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

    const pages = [];
    const maxPagesToShow = 5;
    const halfPage = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, pagination.page - halfPage);
    let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
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

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-card-background)]"
                        >
                            1
                        </button>
                        {startPage > 2 && (
                            <span className="text-xs text-[var(--workspace-text-muted)]">
                                ...
                            </span>
                        )}
                    </>
                )}

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`
              inline-flex
              items-center
              justify-center
              h-8
              w-8
              rounded-lg
              border
              text-xs
              font-medium
              transition-colors
              ${
                  page === pagination.page
                      ? "bg-[var(--workspace-primary)] text-white border-[var(--workspace-primary)]"
                      : "border-[var(--workspace-border)] bg-[var(--workspace-background)] text-[var(--workspace-text)] hover:bg-[var(--workspace-card-background)]"
              }
            `}
                    >
                        {page}
                    </button>
                ))}

                {endPage < pagination.totalPages && (
                    <>
                        {endPage < pagination.totalPages - 1 && (
                            <span className="text-xs text-[var(--workspace-text-muted)]">
                                ...
                            </span>
                        )}
                        <button
                            onClick={() => handlePageChange(pagination.totalPages)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-card-background)]"
                        >
                            {pagination.totalPages}
                        </button>
                    </>
                )}

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
