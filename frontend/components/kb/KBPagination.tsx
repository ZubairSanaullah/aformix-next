"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface KBPaginationProps {
    page: number;
    totalPages: number;
}

export default function KBPagination({
    page,
    totalPages,
}: KBPaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) {
        return null;
    }

    function goToPage(nextPage: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(nextPage));
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center justify-center gap-3">
            <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="btn-outline flex items-center gap-1 !px-4 !py-2 !text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </button>

            <span className="text-xs text-[var(--color-text-muted)]">
                Page {page} of {totalPages}
            </span>

            <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="btn-outline flex items-center gap-1 !px-4 !py-2 !text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}
