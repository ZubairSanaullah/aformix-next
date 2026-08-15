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
} from "recharts";
import { FileText, BookOpen } from "lucide-react";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";
import WorkspaceSkeleton from "@/components/workspace/ui/WorkspaceSkeleton";

interface ContentData {
    blog: {
        total: number;
        published: number;
        drafts: number;
        archived: number;
        views: number;
    };
    knowledgeBase: {
        total: number;
        published: number;
        drafts: number;
        public: number;
        internal: number;
    };
}

interface AnalyticsContentProps {
    data?: ContentData | null;
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

export default function AnalyticsContent({ data, isLoading = false }: AnalyticsContentProps) {
    if (isLoading) {
        return (
            <WorkspaceCard padding="lg" className="space-y-4">
                <WorkspaceSkeleton className="h-6 w-48" />
                <WorkspaceSkeleton className="h-[280px] w-full rounded-xl" />
            </WorkspaceCard>
        );
    }

    if (!data || (data.blog.total === 0 && data.knowledgeBase.total === 0)) {
        return (
            <WorkspaceCard padding="lg">
                <WorkspaceEmptyState
                    icon={FileText}
                    title="No Content Data"
                    description="No blog posts or knowledge base articles found."
                />
            </WorkspaceCard>
        );
    }

    const chartData = [
        {
            name: "Blog Posts",
            Published: data.blog.published,
            Drafts: data.blog.drafts,
            Archived: data.blog.archived,
        },
        {
            name: "Knowledge Base",
            Published: data.knowledgeBase.published,
            Drafts: data.knowledgeBase.drafts,
            Archived: 0,
        },
    ];

    return (
        <WorkspaceCard padding="lg" className="space-y-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-bold text-[var(--workspace-text)] tracking-tight">
                        Content Performance
                    </h2>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Blog posts and knowledge base metrics.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-[var(--workspace-text-muted)]">
                        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                        <span>Total Views:</span>
                        <span className="font-semibold text-[var(--workspace-text)]">
                            {data.blog.views.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 space-y-3">
                <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                    Content Status Overview
                </h3>
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                            <CartesianGrid
                                vertical={false}
                                stroke="var(--workspace-border)"
                                strokeDasharray="3 3"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "var(--workspace-text-subtle)", fontSize: 10 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "var(--workspace-text-subtle)", fontSize: 10 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                            <Bar dataKey="Published" stackId="a" fill="var(--workspace-primary)" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Drafts" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Archived" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </WorkspaceCard>
    );
}
