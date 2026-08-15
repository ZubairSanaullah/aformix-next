"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { WorkspaceCard } from "@/components/workspace/ui";

import FinanceTransactionFilters from "./FinanceTransactionFilters";
import FinanceTransactionTable from "./FinanceTransactionTable";
import FinanceTransactionPagination from "./FinanceTransactionPagination";

interface Company {
    id: string;
    name: string;
}

interface CategorySummary {
    id: string;
    name: string;
    slug: string;
    type?: string;
}

interface Transaction {
    id: string;
    reference: string | null;
    amount: any;
    type: string;
    status: string;
    transactionDate: Date;
    dueDate: Date | null;
    paidAt: Date | null;
    category?: CategorySummary | null;
    company?: Company | null;
}

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface FinanceTransactionsPageClientProps {
    transactions: Transaction[];
    pagination: PaginationData;
    categories: CategorySummary[];
    companies: Company[];
    hasActiveFilters: boolean;
}

export default function FinanceTransactionsPageClient({
    transactions,
    pagination,
    categories,
    companies,
    hasActiveFilters,
}: FinanceTransactionsPageClientProps) {
    const router = useRouter();

    return (
        <div className="space-y-4">
            <FinanceTransactionFilters
                categories={categories}
                companies={companies}
            />

            <WorkspaceCard padding="none">
                <div className="p-4">
                    <FinanceTransactionTable
                        transactions={transactions}
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={() =>
                            router.push("/workspace/finance/transactions")
                        }
                    />
                </div>

                <FinanceTransactionPagination pagination={pagination} />
            </WorkspaceCard>
        </div>
    );
}
