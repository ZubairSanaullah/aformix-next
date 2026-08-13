import {
    AlertTriangle,
    CheckCircle2,
    CircleDashed,
    Layers,
    PauseCircle,
    TrendingUp,
    XCircle,
} from "lucide-react";

import { WorkspaceCard } from "@/components/workspace/ui";

export interface ProjectStatsData {
    total: number;
    planning: number;
    active: number;
    onHold: number;
    completed: number;
    cancelled: number;
    overdue: number;
    averageProgress: number;
}

interface ProjectStatsProps {
    stats: ProjectStatsData;
}

interface StatItem {
    label: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
}

export default function ProjectStats({ stats }: ProjectStatsProps) {
    const items: StatItem[] = [
        {
            label: "Total Projects",
            value: stats.total,
            icon: Layers,
            accent: "text-[var(--workspace-text)]",
        },
        {
            label: "Planning",
            value: stats.planning,
            icon: CircleDashed,
            accent: "text-sky-600",
        },
        {
            label: "Active",
            value: stats.active,
            icon: TrendingUp,
            accent: "text-[var(--workspace-primary)]",
        },
        {
            label: "On Hold",
            value: stats.onHold,
            icon: PauseCircle,
            accent: "text-amber-600",
        },
        {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle2,
            accent: "text-emerald-600",
        },
        {
            label: "Cancelled",
            value: stats.cancelled,
            icon: XCircle,
            accent: "text-red-600",
        },
        {
            label: "Overdue",
            value: stats.overdue,
            icon: AlertTriangle,
            accent: "text-red-600",
        },
        {
            label: "Avg. Progress",
            value: `${stats.averageProgress}%`,
            icon: TrendingUp,
            accent: "text-[var(--workspace-primary)]",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <WorkspaceCard key={item.label} padding="md">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-medium text-[var(--workspace-text-muted)]">
                                {item.label}
                            </p>

                            <Icon className={`h-3.5 w-3.5 ${item.accent}`} />
                        </div>

                        <p className="mt-2 text-xl font-semibold text-[var(--workspace-text)]">
                            {item.value}
                        </p>
                    </WorkspaceCard>
                );
            })}
        </div>
    );
}
