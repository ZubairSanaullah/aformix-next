import Link from "next/link";
import { Plus } from "lucide-react";

import {
    WorkspaceAlert,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import FinanceTransactionsPageClient from "@/components/workspace/finance/FinanceTransactionsPageClient";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { getFinanceTransactions } from "@/lib/services/finance-transactions";
import { getFinanceCategories } from "@/lib/services/finance-categories";
import { getCRMCompaniesForFilter } from "@/lib/services/crm";

const VALID_SORT_FIELDS = [
    "transactionDate",
    "dueDate",
    "paidAt",
    "amount",
    "createdAt",
] as const;

interface TransactionsPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        type?: string;
        status?: string;
        categoryId?: string;
        companyId?: string;
        dateFrom?: string;
        dateTo?: string;
        sort?: string;
        order?: string;
    }>;
}

export default async function TransactionsPage({
    searchParams,
}: TransactionsPageProps) {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <WorkspacePageHeader
                        title="Transactions"
                        description="View and manage all financial transactions."
                    />

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to view Transactions."
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
    const type = params.type as "INCOME" | "EXPENSE" | undefined;
    const status =
        (params.status as
            | "PENDING"
            | "PARTIALLY_PAID"
            | "PAID"
            | "CANCELLED"
            | undefined) || undefined;
    const categoryId = params.categoryId || undefined;
    const companyId = params.companyId || undefined;
    const dateFrom = params.dateFrom ? new Date(params.dateFrom) : undefined;
    const dateTo = params.dateTo ? new Date(params.dateTo) : undefined;
    const sort = (VALID_SORT_FIELDS as readonly string[]).includes(
        params.sort ?? ""
    )
        ? (params.sort as (typeof VALID_SORT_FIELDS)[number])
        : "transactionDate";
    const order = params.order === "asc" ? "asc" : "desc";

    const [result, categories, companies] = await Promise.all([
        getFinanceTransactions({
            page,
            limit: 20,
            includeDeleted: false,
            search,
            type,
            status,
            categoryId,
            companyId,
            dateFrom,
            dateTo,
            sortBy: sort,
            sortOrder: order,
        }),

        getFinanceCategories({
            page: 1,
            limit: 100,
            includeDeleted: false,
            sortBy: "sortOrder",
            sortOrder: "asc",
        }),

        getCRMCompaniesForFilter(),
    ]);

    const hasActiveFilters = Boolean(
        search || type || status || categoryId || companyId || dateFrom || dateTo
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-medium text-[var(--workspace-primary)]">
                        FINANCE
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                        Transactions
                    </h1>

                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--workspace-text-muted)]">
                        Browse, search, and filter all financial transactions.
                    </p>
                </div>

                <Link
                    href="/workspace/finance/transactions/new"
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
                    New Transaction
                </Link>
            </div>

            <FinanceTransactionsPageClient
                transactions={result.transactions}
                pagination={result.pagination}
                categories={categories.categories}
                companies={companies}
                hasActiveFilters={hasActiveFilters}
            />
        </div>
    );
}
