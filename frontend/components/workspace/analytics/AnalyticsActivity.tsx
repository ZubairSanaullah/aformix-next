"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";
import WorkspaceSkeleton from "@/components/workspace/ui/WorkspaceSkeleton";

interface ActivityData {
    meetings: number;
    calls: number;
    appointments: number;
    completed: number;
    pending: number;
}

interface AnalyticsActivityProps {
    data?: ActivityData | null;
    isLoading?: boolean;
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
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsActivity({ data, isLoading = false }: AnalyticsActivityProps) {
    if (isLoading) {
        return (
            <WorkspaceCard padding="lg" className="space-y-4">
                <WorkspaceSkeleton className="h-6 w-48" />
                <WorkspaceSkeleton className="h-[200px] w-full rounded-xl" />
            </WorkspaceCard>
        );
    }

    if (!data || (data.meetings === 0 && data.calls === 0 && data.appointments === 0)) {
        return (
            <WorkspaceCard padding="lg">
                <WorkspaceEmptyState
                    icon={Calendar}
                    title="No Activity Data"
                    description="No meetings, calls, or appointments scheduled."
                />
            </WorkspaceCard>
        );
    }

    const chartData = [
        { name: "Meetings", value: data.meetings, fill: "var(--workspace-primary)" },
        { name: "Calls", value: data.calls, fill: "#8b5cf6" },
        { name: "Appointments", value: data.appointments, fill: "#f59e0b" },
    ];

    return (
        <WorkspaceCard padding="lg" className="space-y-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-bold text-[var(--workspace-text)] tracking-tight">
                        Calendar & Activity
                    </h2>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Overview of meetings, calls, and appointments.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Completed:</span>
                        <span className="font-semibold text-[var(--workspace-text)]">
                            {data.completed}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>Pending:</span>
                        <span className="font-semibold text-[var(--workspace-text)]">
                            {data.pending}
                        </span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 space-y-3 flex flex-col">
                <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                    Activity Volume
                </h3>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
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
                                dataKey="value"
                                name="Count"
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </WorkspaceCard>
    );
}
