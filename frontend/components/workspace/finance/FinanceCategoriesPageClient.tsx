"use client";

import { useRouter } from "next/navigation";

import { WorkspaceCard } from "@/components/workspace/ui";

import FinanceCategoryFilters from "./FinanceCategoryFilters";
import FinanceCategoryTable from "./FinanceCategoryTable";
import FinanceCategoryPagination from "./FinanceCategoryPagination";

import type { FinanceCategory } from "@prisma/client";

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface FinanceCategoriesPageClientProps {
    categories: FinanceCategory[];
    pagination: PaginationData;
    hasActiveFilters: boolean;
}

export default function FinanceCategoriesPageClient({
    categories,
    pagination,
    hasActiveFilters,
}: FinanceCategoriesPageClientProps) {
    const router = useRouter();

    return (
        <div className="space-y-4">
            <FinanceCategoryFilters />

            <WorkspaceCard padding="none">
                <div className="p-4">
                    <FinanceCategoryTable
                        categories={categories}
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={() =>
                            router.push("/workspace/finance/categories")
                        }
                    />
                </div>

                <FinanceCategoryPagination pagination={pagination} />
            </WorkspaceCard>
        </div>
    );
}
