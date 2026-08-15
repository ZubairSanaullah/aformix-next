"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Prisma } from "@prisma/client";

import { WorkspaceCard } from "@/components/workspace/ui";

interface RecentTransaction {
    id: string;
    reference: string | null;
    amount: Prisma.Decimal;
    type: string;
    status: string;
    transactionDate: Date;
}

interface FinanceRecentTransactionsProps {
    transactions: RecentTransaction[];
}

function formatCurrency(amount: Prisma.Decimal | string | number): string {
    const num =
        typeof amount === "string"
            ? parseFloat(amount)
            : amount instanceof Prisma.Decimal
              ? parseFloat(amount.toString())
              : amount;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function getStatusBadgeStyles(status: string): { bg: string; text: string } {
    const statusMap: Record<string, { bg: string; text: string }> = {
        PAID: {
            bg: "bg-emerald-50 dark:bg-emerald-950",
            text: "text-emerald-700 dark:text-emerald-300",
        },
        PENDING: {
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-700 dark:text-amber-300",
        },
        PARTIALLY_PAID: {
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-700 dark:text-blue-300",
        },
        CANCELLED: {
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-700 dark:text-red-300",
        },
    };

    return statusMap[status] || statusMap.PENDING;
}

function getTypeColor(type: string): string {
    return type === "INCOME" ? "text-emerald-600" : "text-rose-600";
}

export default function FinanceRecentTransactions({
    transactions,
}: FinanceRecentTransactionsProps) {
    if (transactions.length === 0) {
        return (
            <WorkspaceCard padding="lg">
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <p className="text-sm font-medium text-[var(--workspace-text)]">
                        No transactions yet
                    </p>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Create your first financial transaction to get started.
                    </p>
                </div>
            </WorkspaceCard>
        );
    }

    return (
        <WorkspaceCard padding="lg">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-[var(--workspace-text)]">
                    Recent Transactions
                </h3>
                <Link
                    href="/workspace/finance/transactions"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                >
                    View all
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </div>

            <div className="space-y-2">
                {transactions.map((transaction) => {
                    const statusStyles = getStatusBadgeStyles(transaction.status);
                    const typeColor = getTypeColor(transaction.type);

                    return (
                        <Link
                            key={transaction.id}
                            href={`/workspace/finance/transactions/${transaction.id}`}
                            className="
                group
                flex
                flex-col
                gap-2
                rounded-lg
                border
                border-[var(--workspace-border)]
                bg-[var(--workspace-background)]
                p-3
                transition-all
                duration-150
                hover:border-[var(--workspace-border-hover)]
                hover:bg-[var(--workspace-card-background)]
              "
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex flex-1 flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-[var(--workspace-text)]">
                                            {transaction.reference || "Untitled"}
                                        </p>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ${statusStyles.bg} ${statusStyles.text}`}
                                        >
                                            {transaction.status.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--workspace-text-muted)]">
                                        {formatDate(transaction.transactionDate)}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p
                                        className={`text-sm font-semibold ${typeColor}`}
                                    >
                                        {transaction.type === "INCOME" ? "+" : "-"}
                                        {formatCurrency(transaction.amount)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </WorkspaceCard>
    );
}
