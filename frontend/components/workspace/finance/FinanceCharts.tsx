"use client";

import { WorkspaceCard } from "@/components/workspace/ui";

import type { FinanceDashboardStats } from "@/lib/services/finance-dashboard";

interface FinanceChartsProps {
    stats: FinanceDashboardStats;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function SimpleBar({
    label,
    value,
    maxValue,
    color,
}: {
    label: string;
    value: number;
    maxValue: number;
    color: string;
}) {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--workspace-text)]">
                    {label}
                </span>
                <span className="text-sm font-semibold text-[var(--workspace-text)]">
                    {formatCurrency(value)}
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--workspace-border)]">
                <div
                    className={`h-full ${color}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}

export default function FinanceCharts({ stats }: FinanceChartsProps) {
    const totalIncome = stats.totalIncome;
    const totalExpenses = stats.totalExpenses;
    const maxAmount = Math.max(totalIncome, totalExpenses, 1);

    const totalCollected = stats.totalCollected;
    const totalPending = stats.totalPending;
    const maxPaymentAmount = Math.max(totalCollected, totalPending, 1);

    const netIncome = totalIncome - totalExpenses;

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {/* Income vs Expenses Chart */}
            <WorkspaceCard padding="lg">
                <h3 className="mb-6 text-base font-semibold text-[var(--workspace-text)]">
                    Income vs Expenses
                </h3>

                <div className="space-y-4">
                    <SimpleBar
                        label="Income"
                        value={totalIncome}
                        maxValue={maxAmount}
                        color="bg-emerald-500"
                    />
                    <SimpleBar
                        label="Expenses"
                        value={totalExpenses}
                        maxValue={maxAmount}
                        color="bg-rose-500"
                    />
                </div>

                <div className="mt-6 border-t border-[var(--workspace-border)] pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--workspace-text-muted)]">
                            Net Profit
                        </span>
                        <span
                            className={`text-lg font-bold ${
                                netIncome >= 0
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                            }`}
                        >
                            {netIncome >= 0 ? "+" : ""}
                            {formatCurrency(netIncome)}
                        </span>
                    </div>
                </div>
            </WorkspaceCard>

            {/* Paid vs Pending Chart */}
            <WorkspaceCard padding="lg">
                <h3 className="mb-6 text-base font-semibold text-[var(--workspace-text)]">
                    Payment Status
                </h3>

                <div className="space-y-4">
                    <SimpleBar
                        label="Collected"
                        value={totalCollected}
                        maxValue={maxPaymentAmount}
                        color="bg-blue-500"
                    />
                    <SimpleBar
                        label="Pending"
                        value={totalPending}
                        maxValue={maxPaymentAmount}
                        color="bg-amber-500"
                    />
                </div>

                <div className="mt-6 border-t border-[var(--workspace-border)] pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--workspace-text-muted)]">
                            Collection Rate
                        </span>
                        <span className="text-lg font-bold text-[var(--workspace-primary)]">
                            {totalCollected + totalPending > 0
                                ? (
                                    (totalCollected /
                                        (totalCollected + totalPending)) *
                                    100
                                ).toFixed(1)
                                : 0}
                            %
                        </span>
                    </div>
                </div>
            </WorkspaceCard>

            {/* Top Categories */}
            <WorkspaceCard padding="lg">
                <h3 className="mb-6 text-base font-semibold text-[var(--workspace-text)]">
                    Top Income Categories
                </h3>

                <div className="space-y-3">
                    {stats.topCategories
                        .filter((cat) => cat.type === "INCOME")
                        .slice(0, 5)
                        .map((category) => (
                            <div key={category.id} className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-[var(--workspace-text)]">
                                        {category.name}
                                    </p>
                                    <p className="text-xs text-[var(--workspace-text-muted)]">
                                        {category.transactionCount} transaction
                                        {category.transactionCount !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-emerald-600">
                                    {formatCurrency(category.totalAmount)}
                                </p>
                            </div>
                        ))}

                    {stats.topCategories.filter((cat) => cat.type === "INCOME")
                        .length === 0 && (
                        <p className="text-sm text-[var(--workspace-text-muted)]">
                            No income categories yet
                        </p>
                    )}
                </div>
            </WorkspaceCard>

            {/* Top Expense Categories */}
            <WorkspaceCard padding="lg">
                <h3 className="mb-6 text-base font-semibold text-[var(--workspace-text)]">
                    Top Expense Categories
                </h3>

                <div className="space-y-3">
                    {stats.topCategories
                        .filter((cat) => cat.type === "EXPENSE")
                        .slice(0, 5)
                        .map((category) => (
                            <div key={category.id} className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-[var(--workspace-text)]">
                                        {category.name}
                                    </p>
                                    <p className="text-xs text-[var(--workspace-text-muted)]">
                                        {category.transactionCount} transaction
                                        {category.transactionCount !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-rose-600">
                                    {formatCurrency(category.totalAmount)}
                                </p>
                            </div>
                        ))}

                    {stats.topCategories.filter((cat) => cat.type === "EXPENSE")
                        .length === 0 && (
                        <p className="text-sm text-[var(--workspace-text-muted)]">
                            No expense categories yet
                        </p>
                    )}
                </div>
            </WorkspaceCard>
        </div>
    );
}
