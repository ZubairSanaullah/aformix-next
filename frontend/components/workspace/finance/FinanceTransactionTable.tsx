"use client";

import Link from "next/link";
import { ArrowUpDown, Trash2, MoreVertical } from "lucide-react";
import { Prisma } from "@prisma/client";

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

interface FinanceTransactionTableProps {
    transactions: Transaction[];
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

function formatCurrency(amount: any): string {
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

function formatDate(date: Date | null | undefined): string {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function getStatusColor(status: string): string {
    const statusMap: Record<string, string> = {
        PAID: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
        PENDING:
            "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
        PARTIALLY_PAID:
            "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
        CANCELLED:
            "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
    };

    return statusMap[status] || statusMap.PENDING;
}

export default function FinanceTransactionTable({
    transactions,
    hasActiveFilters,
    onClearFilters,
}: FinanceTransactionTableProps) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <p className="text-sm font-medium text-[var(--workspace-text)]">
                    {hasActiveFilters
                        ? "No transactions match your filters"
                        : "No transactions yet"}
                </p>
                <p className="text-xs text-[var(--workspace-text-muted)]">
                    {hasActiveFilters ? (
                        <button
                            onClick={onClearFilters}
                            className="font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                        >
                            Clear filters
                        </button>
                    ) : (
                        "Create your first financial transaction to get started."
                    )}
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--workspace-border)]">
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Date
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Reference
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Type
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Category
                        </th>
                        <th className="py-3 px-4 text-right font-semibold text-[var(--workspace-text)]">
                            Amount
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Status
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Due Date
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-[var(--workspace-text)]">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr
                            key={transaction.id}
                            className="border-b border-[var(--workspace-border)] transition-colors hover:bg-[var(--workspace-card-background-hover)]"
                        >
                            <td className="py-3 px-4 text-[var(--workspace-text)]">
                                {formatDate(transaction.transactionDate)}
                            </td>
                            <td className="py-3 px-4">
                                <Link
                                    href={`/workspace/finance/transactions/${transaction.id}`}
                                    className="font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                                >
                                    {transaction.reference || "Untitled"}
                                </Link>
                            </td>
                            <td className="py-3 px-4">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ${
                                        transaction.type === "INCOME"
                                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                            : "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                                    }`}
                                >
                                    {transaction.type}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-[var(--workspace-text-muted)]">
                                {transaction.category?.name || "—"}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-[var(--workspace-text)]">
                                <span
                                    className={
                                        transaction.type === "INCOME"
                                            ? "text-emerald-600"
                                            : "text-rose-600"
                                    }
                                >
                                    {transaction.type === "INCOME" ? "+" : "−"}
                                    {formatCurrency(transaction.amount)}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ${getStatusColor(
                                        transaction.status
                                    )}`}
                                >
                                    {transaction.status.replace(/_/g, " ")}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-[var(--workspace-text-muted)]">
                                {formatDate(transaction.dueDate)}
                            </td>
                            <td className="py-3 px-4 text-center">
                                <Link
                                    href={`/workspace/finance/transactions/${transaction.id}`}
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-card-background)] hover:text-[var(--workspace-text)]"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
