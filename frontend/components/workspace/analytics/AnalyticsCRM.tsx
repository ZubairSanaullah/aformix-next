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
import { Users, Funnel, TrendingUp } from "lucide-react";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";
import WorkspaceSkeleton from "@/components/workspace/ui/WorkspaceSkeleton";

interface CRMData {
    leads: {
        total: number;
        sources: { source: string; leadCount: number }[];
    };
    deals: {
        total: number;
        pipelineValue: number;
        pipeline: { name: string; dealCount: number; totalValue: number }[];
    };
}

interface AnalyticsCRMProps {
    data?: CRMData | null;
    isLoading?: boolean;
}

const COLORS = [
    "var(--workspace-primary)",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
];

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
                        {entry.name.toLowerCase().includes("value")
                            ? formatCurrency(entry.value)
                            : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsCRM({ data, isLoading = false }: AnalyticsCRMProps) {
    if (isLoading) {
        return (
            <WorkspaceCard padding="lg" className="space-y-4">
                <WorkspaceSkeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <WorkspaceSkeleton className="h-[280px] rounded-xl" />
                    <WorkspaceSkeleton className="h-[280px] rounded-xl" />
                </div>
            </WorkspaceCard>
        );
    }

    if (!data || (data.leads.total === 0 && data.deals.total === 0)) {
        return (
            <WorkspaceCard padding="lg">
                <WorkspaceEmptyState
                    icon={Users}
                    title="No CRM Data"
                    description="No leads or deals recorded for the selected date range."
                />
            </WorkspaceCard>
        );
    }

    const pieData = (data.leads.sources || []).map((item, index) => ({
        name: item.source,
        value: item.leadCount,
        color: COLORS[index % COLORS.length],
    }));

    return (
        <WorkspaceCard padding="lg" className="space-y-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-bold text-[var(--workspace-text)] tracking-tight">
                        CRM Performance
                    </h2>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Lead sources and pipeline stage distribution.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                        <TrendingUp className="h-3.5 w-3.5 text-[var(--workspace-primary)]" />
                        <span>Pipeline Value:</span>
                        <span className="font-semibold text-[var(--workspace-text)]">
                            {formatCurrency(data.deals.pipelineValue)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Lead Sources */}
                <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 space-y-3 flex flex-col">
                    <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                        Lead Sources
                    </h3>
                    <div className="h-[260px] w-full flex items-center justify-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                No lead source data
                            </p>
                        )}
                    </div>
                </div>

                {/* Pipeline Stages */}
                <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 space-y-3 flex flex-col">
                    <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                        Pipeline by Stage
                    </h3>
                    <div className="h-[260px] w-full flex items-center justify-center">
                        {data.deals.pipeline && data.deals.pipeline.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data.deals.pipeline}
                                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                    layout="vertical"
                                >
                                    <CartesianGrid
                                        horizontal={true}
                                        vertical={false}
                                        stroke="var(--workspace-border)"
                                        strokeDasharray="3 3"
                                    />
                                    <XAxis
                                        type="number"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "var(--workspace-text-subtle)", fontSize: 10 }}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "var(--workspace-text-subtle)", fontSize: 10 }}
                                        width={80}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="dealCount"
                                        name="Deals"
                                        fill="var(--workspace-primary)"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                No pipeline stage data
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </WorkspaceCard>
    );
}
