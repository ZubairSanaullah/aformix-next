"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { WorkspaceCard } from "@/components/workspace/ui";


interface CategoryOption {
    id: string;
    name: string;
}

interface Company {
    id: string;
    name: string;
}

interface FinanceTransactionFiltersProps {
    categories: CategoryOption[];
    companies: Company[];
}

export default function FinanceTransactionFilters({
    categories,
    companies,
}: FinanceTransactionFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get("search") || "";
    const currentType = searchParams.get("type") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentCategory = searchParams.get("categoryId") || "";
    const currentCompany = searchParams.get("companyId") || "";

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

    const handleFilterChange = (
        key: string,
        value: string
    ) => {
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
        router.push("/workspace/finance/transactions");
    };

    const hasActiveFilters =
        currentSearch ||
        currentType ||
        currentStatus ||
        currentCategory ||
        currentCompany;

    return (
        <WorkspaceCard padding="md">
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--workspace-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search by reference, description, or invoice..."
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

                {/* Filters Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Type Filter */}
                    <select
                        value={currentType}
                        onChange={(e) => handleFilterChange("type", e.target.value)}
                        className="
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
                    </select>

                    {/* Status Filter */}
                    <select
                        value={currentStatus}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className="
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
                        <option value="">All Statuses</option>
                        <option value="PAID">Paid</option>
                        <option value="PENDING">Pending</option>
                        <option value="PARTIALLY_PAID">Partially Paid</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={currentCategory}
                        onChange={(e) =>
                            handleFilterChange("categoryId", e.target.value)
                        }
                        className="
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
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {/* Company Filter */}
                    <select
                        value={currentCompany}
                        onChange={(e) =>
                            handleFilterChange("companyId", e.target.value)
                        }
                        className="
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
                        <option value="">All Companies</option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>

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
