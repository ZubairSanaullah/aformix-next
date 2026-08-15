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
import { FolderKanban, CheckSquare, Clock } from "lucide-react";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";
import WorkspaceSkeleton from "@/components/workspace/ui/WorkspaceSkeleton";

interface ProjectData {
    projects: {
        total: number;
        active: number;
        completed: number;
        overdue: number;
        byStatus: { status: string; count: number }[];
    };
    tasks: {
        total: number;
        completed: number;
        pending: number;
        overdue: number;
        completionRate: number;
    };
}

interface AnalyticsProjectsProps {
    data?: ProjectData | null;
    isLoading?: boolean;
}

const COLORS = [
    "var(--workspace-primary)",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#64748b",
];

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

export default function AnalyticsProjects({ data, isLoading = false }: AnalyticsProjectsProps) {
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

    if (!data || (data.projects.total === 0 && data.tasks.total === 0)) {
        return (
            <WorkspaceCard padding="lg">
                <WorkspaceEmptyState
                    icon={FolderKanban}
                    title="No Project Data"
                    description="No projects or tasks recorded for the selected date range."
                />
            </WorkspaceCard>
        );
    }

    const pieData = data.projects.byStatus.map((item, index) => ({
        name: item.status,
        value: item.count,
        color: COLORS[index % COLORS.length],
    }));

    const taskData = [
        { name: "Completed", value: data.tasks.completed, color: "#10b981" },
        { name: "Pending", value: data.tasks.pending - data.tasks.overdue, color: "var(--workspace-primary)" },
        { name: "Overdue", value: data.tasks.overdue, color: "#ef4444" },
    ].filter(item => item.value > 0);

    return (
        <WorkspaceCard padding="lg" className="space-y-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-bold text-[var(--workspace-text)] tracking-tight">
                        Projects & Tasks
                    </h2>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Project status and task completion overview.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                        <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Task Completion:</span>
                        <span className="font-semibold text-[var(--workspace-text)]">
                            {data.tasks.completionRate.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Project Status */}
                <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 space-y-3 flex flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                            Projects by Status
                        </h3>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500">
                            {data.projects.overdue} Overdue
                        </span>
                    </div>
                    <div className="h-[220px] w-full flex items-center justify-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                No project status data
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 text-[10px]">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[var(--workspace-text-muted)]">{entry.name} ({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Task Breakdown */}
                <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 space-y-3 flex flex-col">
                    <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                        Task Breakdown
                    </h3>
                    <div className="h-[220px] w-full flex items-center justify-center">
                        {taskData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={taskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {taskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                No task data
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 text-[10px]">
                        {taskData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[var(--workspace-text-muted)]">{entry.name} ({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </WorkspaceCard>
    );
}
