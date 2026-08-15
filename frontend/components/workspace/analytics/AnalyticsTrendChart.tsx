"use client";

import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceSelect from "@/components/workspace/ui/WorkspaceSelect";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";
import WorkspaceSkeleton from "@/components/workspace/ui/WorkspaceSkeleton";

interface TrendPoint {
    period: string;
    revenue?: number;
    expenses?: number;
    netIncome?: number;
    leads?: number;
    deals?: number;
    projects?: number;
    tasks?: number;
}

interface AnalyticsTrendChartProps {
    data?: TrendPoint[] | null;
    isLoading?: boolean;
}

type MetricType = "revenue" | "expenses" | "netIncome" | "leads" | "deals" | "projects" | "tasks";

const METRICS: { value: MetricType; label: string; color: string; isCurrency?: boolean }[] = [
    { value: "revenue", label: "Revenue", color: "var(--workspace-primary)", isCurrency: true },
    { value: "expenses", label: "Expenses", color: "#ef4444", isCurrency: true },
    { value: "netIncome", label: "Net Income", color: "#10b981", isCurrency: true },
    { value: "leads", label: "Leads", color: "#3b82f6" },
    { value: "deals", label: "Deals", color: "#8b5cf6" },
    { value: "projects", label: "Projects", color: "#f59e0b" },
    { value: "tasks", label: "Tasks", color: "#64748b" },
];

function formatValue(value: number, isCurrency?: boolean): string {
    if (isCurrency) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value);
    }
    return value.toString();
}

function CustomTooltip({ active, payload, label, isCurrency }: any) {
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
                        {formatValue(entry.value, isCurrency)}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsTrendChart({ data, isLoading = false }: AnalyticsTrendChartProps) {
    const [selectedMetric, setSelectedMetric] = useState<MetricType>("revenue");

    if (isLoading) {
        return (
            <WorkspaceCard padding="lg" className="space-y-4">
                <div className="flex items-center justify-between">
                    <WorkspaceSkeleton className="h-6 w-48" />
                    <WorkspaceSkeleton className="h-9 w-32 rounded-lg" />
                </div>
                <WorkspaceSkeleton className="h-[300px] w-full rounded-xl" />
            </WorkspaceCard>
        );
    }

    if (!data || data.length === 0) {
        return (
            <WorkspaceCard padding="lg">
                <WorkspaceEmptyState
                    icon={Activity}
                    title="No Trend Data"
                    description="No trend data available for the selected period."
                />
            </WorkspaceCard>
        );
    }

    const currentMetric = METRICS.find(m => m.value === selectedMetric) || METRICS[0];

    return (
        <WorkspaceCard padding="lg" className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-bold text-[var(--workspace-text)] tracking-tight">
                        Business Trends
                    </h2>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Key performance indicators over time.
                    </p>
                </div>
                <div>
                    <WorkspaceSelect
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
                        className="w-full sm:w-[180px]"
                        aria-label="Select metric to visualize"
                    >
                        {METRICS.map((metric) => (
                            <option key={metric.value} value={metric.value}>
                                {metric.label}
                            </option>
                        ))}
                    </WorkspaceSelect>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
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
                            tickFormatter={(val) => currentMetric.isCurrency ? `$${val}` : val}
                        />
                        <Tooltip
                            content={<CustomTooltip isCurrency={currentMetric.isCurrency} />}
                        />
                        <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            name={currentMetric.label}
                            stroke={currentMetric.color}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </WorkspaceCard>
    );
}
