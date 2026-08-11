import Link from "next/link";
import { Plus } from "lucide-react";
import type {
    TaskPriority,
    TaskStatus,
} from "@prisma/client";

import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import TaskFilters from "@/components/workspace/tasks/TaskFilters";
import TaskTable from "@/components/workspace/tasks/TaskTable";

import {
    getTasks,
    type TaskDueFilter,
} from "@/lib/services/tasks";

interface TasksPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        priority?: string;
        due?: string;
    }>;
}

export default async function TasksPage({
    searchParams,
}: TasksPageProps) {
    const params = await searchParams;

    const search = params.search ?? undefined;
    const status = [
        "TODO",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
    ].includes(params.status ?? "")
        ? (params.status as TaskStatus)
        : undefined;
    const priority = ["LOW", "MEDIUM", "HIGH", "URGENT"].includes(
        params.priority ?? ""
    )
        ? (params.priority as TaskPriority)
        : undefined;
    const due = ["overdue", "today", "upcoming", "none"].includes(
        params.due ?? ""
    )
        ? (params.due as TaskDueFilter)
        : undefined;

    const tasks = await getTasks({
        search,
        status,
        priority,
        due,
    });

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    {
                        label: "Tasks",
                    },
                ]}
            />

            <WorkspacePageHeader
                title="Tasks"
                description="Organize, prioritize, and track your work from one place."
            >
                <Link
                    href="/workspace/tasks/create"
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--workspace-primary)] px-3.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Create Task
                </Link>
            </WorkspacePageHeader>

            <TaskFilters />

            <div className="overflow-hidden rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                <TaskTable tasks={tasks} />
            </div>
        </div>
    );
}
