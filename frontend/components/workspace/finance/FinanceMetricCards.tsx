"use client";

import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    DollarSign,
    Wallet,
    Clock,
} from "lucide-react";

import { WorkspaceCard } from "@/components/workspace/ui";

import type { FinanceDashboardStats } from "@/lib/services/finance-dashboard";

interface FinanceMetricCardsProps {
    stats: FinanceDashboardStats;
}

interface MetricItem {
    label: string;
    value: string;
    change?: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    tooltip?: string;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function FinanceMetricCards({ stats }: FinanceMetricCardsProps) {
    const metrics: MetricItem[] = [
        {
            label: "Total Income",
            value: formatCurrency(stats.totalIncome),
            icon: TrendingUp,
            accent: "text-emerald-600",
            tooltip: `${stats.paidCount} transactions`,
        },
        {
            label: "Total Expenses",
            value: formatCurrency(stats.totalExpenses),
            icon: TrendingDown,
            accent: "text-rose-600",
            tooltip: `${stats.totalTransactions - stats.paidCount} transactions`,
        },
        {
            label: "Net Income",
            value: formatCurrency(stats.totalIncome - stats.totalExpenses),
            icon: DollarSign,
            accent:
                stats.totalIncome - stats.totalExpenses >= 0
                    ? "text-blue-600"
                    : "text-red-600",
            tooltip: "Income minus Expenses",
        },
        {
            label: "Total Collected",
            value: formatCurrency(stats.totalCollected),
            icon: Wallet,
            accent: "text-[var(--workspace-primary)]",
            tooltip: `${stats.paidCount} paid transactions`,
        },
        {
            label: "Pending",
            value: formatCurrency(stats.totalPending),
            icon: Clock,
            accent: "text-amber-600",
            tooltip: `${stats.pendingCount} pending`,
        },
        {
            label: "Overdue",
            value: stats.pendingOverdue.toString(),
            icon: AlertTriangle,
            accent: "text-red-600",
            tooltip: "Overdue payments due",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                    <WorkspaceCard key={metric.label} padding="md" className="group">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] font-medium text-[var(--workspace-text-muted)]">
                                    {metric.label}
                                </p>
                                <Icon className={`h-3.5 w-3.5 ${metric.accent}`} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-bold text-[var(--workspace-text)] tracking-tight">
                                    {metric.value}
                                </p>

                                {metric.tooltip && (
                                    <p className="text-[10px] text-[var(--workspace-text-muted)]">
                                        {metric.tooltip}
                                    </p>
                                )}
                            </div>
                        </div>
                    </WorkspaceCard>
                );
            })}
        </div>
    );
}
