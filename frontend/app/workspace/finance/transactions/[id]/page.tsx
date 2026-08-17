import Link from "next/link";
import { ArrowLeft, Archive, RotateCcw, Trash2 } from "lucide-react";

import {
    WorkspaceCard,
    WorkspaceAlert,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import FinanceTransactionForm from "@/components/workspace/finance/FinanceTransactionForm";
import FinanceTransactionDetailActions from "@/components/workspace/finance/FinanceTransactionDetailActions";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { getFinanceTransactionById } from "@/lib/services/finance-transactions";
import { getFinanceCategories } from "@/lib/services/finance-categories";
import { getCRMCompaniesForFilter } from "@/lib/services/crm";

interface TransactionDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TransactionDetailPage({
    params,
}: TransactionDetailPageProps) {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/workspace/finance/transactions"
                            className="inline-flex items-center text-sm font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </div>

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to view transactions."
                            : "Only administrators can access the Finance module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    const { id } = await params;

    const [transaction, categories, companies] = await Promise.all([
        getFinanceTransactionById(id),
        getFinanceCategories({
            page: 1,
            limit: 100,
            includeDeleted: false,
            sortBy: "sortOrder",
            sortOrder: "asc",
        }),
        getCRMCompaniesForFilter(),
    ]);

    if (!transaction) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/workspace/finance/transactions"
                        className="inline-flex items-center text-sm font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </div>

                <WorkspaceAlert variant="danger" title="Not found">
                    The transaction you're looking for doesn't exist or has been
                    deleted.
                </WorkspaceAlert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title={transaction.reference || "Untitled Transaction"}
                description="View and edit transaction details."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Finance", href: "/workspace/finance" },
                    { label: "Transactions", href: "/workspace/finance/transactions" },
                    { label: "Detail" },
                ]}
                actions={
                    <FinanceTransactionDetailActions
                        transactionId={transaction.id}
                        transactionStatus={transaction.status}
                    />
                }
            />

            {/* Transaction Overview */}
            <div className="grid gap-4 sm:grid-cols-4">
                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Type
                        </p>
                        <p className="text-sm font-semibold text-[var(--workspace-text)]">
                            {transaction.type}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Status
                        </p>
                        <p className="text-sm font-semibold text-[var(--workspace-text)]">
                            {transaction.status.replace(/_/g, " ")}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Currency
                        </p>
                        <p className="text-sm font-semibold text-[var(--workspace-text)]">
                            {transaction.currency}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Amount
                        </p>
                        <p
                            className={`text-sm font-semibold ${
                                transaction.type === "INCOME"
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                            }`}
                        >
                            {transaction.type === "INCOME" ? "+" : "−"}
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: transaction.currency,
                            }).format(
                                typeof transaction.amount === "string"
                                    ? parseFloat(transaction.amount)
                                    : transaction.amount instanceof Date
                                      ? 0
                                      : Number(transaction.amount)
                            )}
                        </p>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Edit Form */}
            <WorkspaceCard>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-base font-semibold text-[var(--workspace-text)]">
                            Transaction Details
                        </h2>
                        <p className="mt-1 text-sm text-[var(--workspace-text-muted)]">
                            Update the transaction information below.
                        </p>
                    </div>

                    <FinanceTransactionForm
                        transaction={transaction}
                        categories={categories.categories}
                        companies={companies}
                        mode="edit"
                    />
                </div>
            </WorkspaceCard>
        </div>
    );
}
