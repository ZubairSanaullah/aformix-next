import Link from "next/link";
import { Plus } from "lucide-react";

import {
    WorkspaceAlert,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import FinanceCategoriesPageClient from "@/components/workspace/finance/FinanceCategoriesPageClient";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { getFinanceCategories } from "@/lib/services/finance-categories";

const VALID_SORT_FIELDS = [
    "name",
    "type",
    "sortOrder",
    "createdAt",
    "updatedAt",
] as const;

interface CategoriesPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        type?: string;
        sort?: string;
        order?: string;
    }>;
}

export default async function CategoriesPage({
    searchParams,
}: CategoriesPageProps) {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <WorkspacePageHeader
                        title="Categories"
                        description="Manage financial transaction categories."
                    />

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to view Categories."
                            : "Only administrators can access the Finance module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    const params = await searchParams;

    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const search = params.search?.trim() || undefined;
    const type =
        (params.type as "INCOME" | "EXPENSE" | "ALL" | undefined) || undefined;
    const sort = (VALID_SORT_FIELDS as readonly string[]).includes(
        params.sort ?? ""
    )
        ? (params.sort as (typeof VALID_SORT_FIELDS)[number])
        : "sortOrder";
    const order = params.order === "asc" ? "asc" : "desc";

    const result = await getFinanceCategories({
        page,
        limit: 20,
        search,
        type,
        includeDeleted: false,
        sortBy: sort,
        sortOrder: order,
    });

    const hasActiveFilters = Boolean(search || type);

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Categories"
                description="Browse and manage financial transaction categories."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Finance", href: "/workspace/finance" },
                    { label: "Categories" },
                ]}
                actions={
                    <Link
                        href="/workspace/finance/categories/new"
                        className="
              inline-flex
              h-9
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[var(--workspace-primary)]
              px-3.5
              text-xs
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-150
              hover:opacity-90
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--workspace-background)]
            "
                    >
                        <Plus className="h-4 w-4" />
                        New Category
                    </Link>
                }
            />

            <FinanceCategoriesPageClient
                categories={result.categories}
                pagination={result.pagination}
                hasActiveFilters={hasActiveFilters}
            />
        </div>
    );
}
