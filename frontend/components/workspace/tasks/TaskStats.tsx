import {
    CheckCircle2,
    Circle,
    Clock3,
    ListTodo,
    TriangleAlert,
} from "lucide-react";

import {
    WorkspaceCard,
} from "@/components/workspace/ui";

interface TaskStatsProps {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    overdue: number;
    urgent: number;
}

const stats = [
    {
        key: "total",
        label: "Total Tasks",
        icon: ListTodo,
        valueKey: "total",
    },
    {
        key: "todo",
        label: "To Do",
        icon: Circle,
        valueKey: "todo",
    },
    {
        key: "inProgress",
        label: "In Progress",
        icon: Clock3,
        valueKey: "inProgress",
    },
    {
        key: "completed",
        label: "Completed",
        icon: CheckCircle2,
        valueKey: "completed",
    },
    {
        key: "overdue",
        label: "Overdue",
        icon: TriangleAlert,
        valueKey: "overdue",
    },
] as const;

export default function TaskStats({
    total,
    todo,
    inProgress,
    completed,
    overdue,
    urgent,
}: TaskStatsProps) {
    const values = {
        total,
        todo,
        inProgress,
        completed,
        overdue,
    };

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <WorkspaceCard
                        key={stat.key}
                        className="p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-[var(--workspace-text-muted)]">
                                    {stat.label}
                                </p>

                                <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                                    {
                                        values[
                                        stat.valueKey
                                        ]
                                    }
                                </p>
                            </div>

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                <Icon className="h-4 w-4" />
                            </div>
                        </div>
                    </WorkspaceCard>
                );
            })}

            {/* Urgent tasks */}

            <WorkspaceCard className="p-4 sm:col-span-2 lg:col-span-1">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-medium text-[var(--workspace-text-muted)]">
                            Urgent
                        </p>

                        <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                            {urgent}
                        </p>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <TriangleAlert className="h-4 w-4" />
                    </div>
                </div>
            </WorkspaceCard>
        </div>
    );
}