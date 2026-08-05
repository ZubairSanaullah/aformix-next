"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
}

export default function Pagination({
    page,
    pageSize,
    total,
}: PaginationProps) {
    const searchParams = useSearchParams();

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    if (totalPages <= 1) {
        return null;
    }

    function buildUrl(nextPage: number) {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", String(nextPage));

        return `/workspace/blog?${params.toString()}`;
    }

    return (
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div className="text-sm text-muted-foreground">
                Showing page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong> ({total} posts)
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href={buildUrl(Math.max(1, page - 1))}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${page === 1
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-accent"
                        }`}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Link>

                <Link
                    href={buildUrl(Math.min(totalPages, page + 1))}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${page === totalPages
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-accent"
                        }`}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}