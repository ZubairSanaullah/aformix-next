"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { WorkspaceCard } from "@/components/workspace/ui";

interface FinanceCategoryFiltersProps {}

export default function FinanceCategoryFilters({}: FinanceCategoryFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get("search") || "";
    const currentType = searchParams.get("type") || "";

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const handleClearFilters = () => {
        router.push("/workspace/finance/categories");
    };

    const hasActiveFilters = currentSearch || currentType;

    return (
        <WorkspaceCard padding="md">
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--workspace-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search categories by name or description..."
                        value={currentSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              pl-10
              pr-4
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                </div>

                {/* Type Filter */}
                <select
                    value={currentType}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                >
                    <option value="">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="ALL">Both (Income & Expense)</option>
                </select>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleClearFilters}
                            className="
              inline-flex
              items-center
              gap-1
              text-xs
              font-medium
              text-[var(--workspace-primary)]
              transition-colors
              hover:opacity-80
            "
                        >
                            <X className="h-3 w-3" />
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </WorkspaceCard>
    );
}
