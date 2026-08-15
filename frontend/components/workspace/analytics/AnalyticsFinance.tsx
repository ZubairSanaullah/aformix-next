"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Wallet, DollarSign, Clock, PieChart as PieChartIcon } from "lucide-react";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";
import WorkspaceSkeleton from "@/components/workspace/ui/WorkspaceSkeleton";

interface FinanceData {
    totalRevenue: number;
    totalExpenses: number;
    totalPending: number;
    netIncome: number;
    collectionRate: number;
    outstandingAmount: number;
}

interface TrendItem {
    period: string;
    revenue: number;
    expenses: number;
    pending: number;
    net: number;
}

interface AnalyticsFinanceProps {
    data?: FinanceData | null;
    trendsData?: TrendItem[] | null;
    isLoading?: boolean;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-3 shadow-lg text-xs space-y-1">
            <p className="font-semibold text-[var(--workspace-text)]">{label}</p>
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        {entry.name}:
                    </span>
                    <span className="font-medium text-[var(--workspace-text)]">
                        {formatCurrency(entry.value)}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsFinance({
    data,
    trendsData,
    isLoading = false,
}: AnalyticsFinanceProps) {
    if (isLoading) {
        return (
            <WorkspaceCard padding="lg" className="space-y-4">
                <WorkspaceSkeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <WorkspaceSkeleton className="h-[280px] lg:col-span-2 rounded-xl" />
                    <WorkspaceSkeleton className="h-[280px] rounded-xl" />
                </div>
            </WorkspaceCard>
        );
    }

    const isEmpty =
        !data ||
        (data.totalRevenue === 0 &&
            data.totalExpenses === 0 &&
            data.totalPending === 0 &&
            data.netIncome === 0);

    if (isEmpty) {
        return (
            <WorkspaceCard padding="lg">
                <WorkspaceEmptyState
                    icon={DollarSign}
                    title="No Financial Data Available"
                    description="No financial transactions recorded for the selected date range."
                />
            </WorkspaceCard>
        );
    }

    const pieData = [
        { name: "Collected Revenue", value: data.totalRevenue - data.totalPending, color: "var(--workspace-primary)" },
        { name: "Pending Invoices", value: data.totalPending, color: "#f59e0b" },
    ].filter((item) => item.value > 0);

    return (
        <WorkspaceCard padding="lg" className="space-y-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-bold text-[var(--workspace-text)] tracking-tight">
                        Financial Performance
                    </h2>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Revenue vs Expenses, pending receivables, and collection rates.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                        <Wallet className="h-3.5 w-3.5 text-[var(--workspace-primary)]" />
                        <span>Collection Rate:</span>
                        <span className="font-semibold text-[var(--workspace-text)]">
                            {data.collectionRate}%
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>Outstanding:</span>
                        <span className="font-semibold text-[var(--workspace-text)]">
                            {formatCurrency(data.outstandingAmount)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Revenue vs Expenses Chart */}
                <div className="lg:col-span-2 rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 space-y-3">
                    <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                        Revenue & Expense Trends
                    </h3>
                    <div className="h-[260px] w-full">
                        {trendsData && trendsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={trendsData}
                                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        stroke="var(--workspace-border)"
                                        strokeDasharray="3 3"
                                    />
                                    <XAxis
                                        dataKey="period"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "var(--workspace-text-subtle)", fontSize: 10 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "var(--workspace-text-subtle)", fontSize: 10 }}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        name="Revenue"
                                        fill="var(--workspace-primary)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="expenses"
                                        name="Expenses"
                                        fill="#ef4444"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-xs text-[var(--workspace-text-muted)]">
                                No trend breakdown available for this date range
                            </div>
                        )}
                    </div>
                </div>

                {/* Collection Breakdown Chart */}
                <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                            Pending vs Collected
                        </h3>
                        <PieChartIcon className="h-4 w-4 text-[var(--workspace-text-muted)]" />
                    </div>

                    <div className="h-[200px] w-full flex items-center justify-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val: any) => formatCurrency(Number(val))}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                No collection data
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[var(--workspace-border)]">
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                                <span className="h-2.5 w-2.5 rounded-full bg-[var(--workspace-primary)]" />
                                Collected
                            </span>
                            <span className="font-semibold text-[var(--workspace-text)]">
                                {formatCurrency(Math.max(0, data.totalRevenue - data.totalPending))}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                Pending
                            </span>
                            <span className="font-semibold text-[var(--workspace-text)]">
                                {formatCurrency(data.totalPending)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </WorkspaceCard>
    );
}
