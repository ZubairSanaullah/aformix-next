"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    CheckCircle2,
    Clock3,
    ListTodo,
    Plus,
    Search,
    XCircle,
} from "lucide-react";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceEmptyState,
    WorkspaceInput,
    WorkspaceSelect,
    WorkspaceTable,
    WorkspaceTableBody,
    WorkspaceTableCell,
    WorkspaceTableHead,
    WorkspaceTableHeader,
    WorkspaceTableRow,
} from "@/components/workspace/ui";

interface TaskUser {
    id: string;
    name: string | null;
    email: string;
}

export interface WorkspaceTask {
    id: string;
    title: string;
    description: string | null;
    status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    user: TaskUser;
}

interface TaskPageClientProps {
    tasks: WorkspaceTask[];
}

const statusConfig = {
    TODO: {
        label: "To Do",
        icon: ListTodo,
        className:
            "border-blue-200 bg-blue-50 text-blue-700",
    },
    IN_PROGRESS: {
        label: "In Progress",
        icon: Clock3,
        className:
            "border-amber-200 bg-amber-50 text-amber-700",
    },
    COMPLETED: {
        label: "Completed",
        icon: CheckCircle2,
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    CANCELLED: {
        label: "Cancelled",
        icon: XCircle,
        className:
            "border-red-200 bg-red-50 text-red-700",
    },
};

const priorityConfig = {
    LOW: {
        label: "Low",
        className:
            "border-slate-200 bg-slate-50 text-slate-600",
    },
    MEDIUM: {
        label: "Medium",
        className:
            "border-blue-200 bg-blue-50 text-blue-700",
    },
    HIGH: {
        label: "High",
        className:
            "border-orange-200 bg-orange-50 text-orange-700",
    },
    URGENT: {
        label: "Urgent",
        className:
            "border-red-200 bg-red-50 text-red-700",
    },
};

function formatDate(date: Date | string | null) {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function isOverdue(task: WorkspaceTask) {
    if (!task.dueAt) {
        return false;
    }

    if (
        task.status === "COMPLETED" ||
        task.status === "CANCELLED"
    ) {
        return false;
    }

    return new Date(task.dueAt).getTime() < Date.now();
}

export default function TaskPageClient({
    tasks,
}: TaskPageClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search =
        searchParams.get("search") ?? "";

    const status =
        searchParams.get("status") ?? "";

    const priority =
        searchParams.get("priority") ?? "";

    const updateFilter = (
        key: string,
        value: string
    ) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(
            `/workspace/tasks?${params.toString()}`
        );
    };

    const clearFilters = () => {
        router.push("/workspace/tasks");
    };

    const hasFilters = Boolean(
        search || status || priority
    );

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.status === "COMPLETED"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.status === "IN_PROGRESS"
    ).length;

    const overdueTasks = tasks.filter(isOverdue).length;

    return (
        <div className="space-y-5">
            {/* Statistics */}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <WorkspaceCard className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                Total Tasks
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-[var(--workspace-text)]">
                                {totalTasks}
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                            <ListTodo className="h-4 w-4" />
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                In Progress
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-[var(--workspace-text)]">
                                {inProgressTasks}
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <Clock3 className="h-4 w-4" />
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                Completed
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-[var(--workspace-text)]">
                                {completedTasks}
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                Overdue
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-[var(--workspace-text)]">
                                {overdueTasks}
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <XCircle className="h-4 w-4" />
                        </div>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Filters */}

            <WorkspaceCard className="p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--workspace-text-subtle)]" />

                        <WorkspaceInput
                            value={search}
                            onChange={(event) =>
                                updateFilter(
                                    "search",
                                    event.target.value
                                )
                            }
                            placeholder="Search tasks..."
                            aria-label="Search tasks"
                            className="pl-9"
                        />
                    </div>

                    <WorkspaceSelect
                        value={status}
                        onChange={(event) =>
                            updateFilter(
                                "status",
                                event.target.value
                            )
                        }
                        aria-label="Filter tasks by status"
                    >
                        <option value="">
                            All statuses
                        </option>

                        <option value="TODO">
                            To Do
                        </option>

                        <option value="IN_PROGRESS">
                            In Progress
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>
                    </WorkspaceSelect>

                    <WorkspaceSelect
                        value={priority}
                        onChange={(event) =>
                            updateFilter(
                                "priority",
                                event.target.value
                            )
                        }
                        aria-label="Filter tasks by priority"
                    >
                        <option value="">
                            All priorities
                        </option>

                        <option value="LOW">
                            Low
                        </option>

                        <option value="MEDIUM">
                            Medium
                        </option>

                        <option value="HIGH">
                            High
                        </option>

                        <option value="URGENT">
                            Urgent
                        </option>
                    </WorkspaceSelect>

                    {hasFilters && (
                        <WorkspaceButton
                            type="button"
                            variant="secondary"
                            onClick={clearFilters}
                        >
                            Clear
                        </WorkspaceButton>
                    )}

                    <Link href="/workspace/tasks/create">
                        <WorkspaceButton type="button">
                            <Plus className="h-4 w-4" />
                            New Task
                        </WorkspaceButton>
                    </Link>
                </div>
            </WorkspaceCard>

            {/* Task table */}

            {!tasks.length ? (
                <WorkspaceEmptyState
                    title="No tasks found"
                    description={
                        hasFilters
                            ? "No tasks match your current filters. Try adjusting your search criteria."
                            : "You don't have any tasks yet. Create your first task to get started."
                    }
                />
            ) : (
                <WorkspaceCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <WorkspaceTable>
                            <WorkspaceTableHeader>
                                <WorkspaceTableRow>
                                    <WorkspaceTableHead>
                                        Task
                                    </WorkspaceTableHead>

                                    <WorkspaceTableHead>
                                        Status
                                    </WorkspaceTableHead>

                                    <WorkspaceTableHead>
                                        Priority
                                    </WorkspaceTableHead>

                                    <WorkspaceTableHead>
                                        Due Date
                                    </WorkspaceTableHead>

                                    <WorkspaceTableHead>
                                        Owner
                                    </WorkspaceTableHead>

                                    <WorkspaceTableHead>
                                        Created
                                    </WorkspaceTableHead>
                                </WorkspaceTableRow>
                            </WorkspaceTableHeader>

                            <WorkspaceTableBody>
                                {tasks.map((task) => {
                                    const status =
                                        statusConfig[
                                        task.status
                                        ];

                                    const priorityData =
                                        priorityConfig[
                                        task.priority
                                        ];

                                    const StatusIcon =
                                        status.icon;

                                    const overdue =
                                        isOverdue(task);

                                    return (
                                        <WorkspaceTableRow
                                            key={task.id}
                                        >
                                            <WorkspaceTableCell>
                                                <div className="min-w-[220px]">
                                                    <Link
                                                        href={`/workspace/tasks/${task.id}`}
                                                        className="text-xs font-semibold text-[var(--workspace-text)] transition-colors hover:text-[var(--workspace-primary)]"
                                                    >
                                                        {task.title}
                                                    </Link>

                                                    {task.description && (
                                                        <p className="mt-1 line-clamp-1 text-[10px] text-[var(--workspace-text-subtle)]">
                                                            {
                                                                task.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </WorkspaceTableCell>

                                            <WorkspaceTableCell>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-medium ${status.className}`}
                                                >
                                                    <StatusIcon className="h-3 w-3" />
                                                    {
                                                        status.label
                                                    }
                                                </span>
                                            </WorkspaceTableCell>

                                            <WorkspaceTableCell>
                                                <span
                                                    className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-medium ${priorityData.className}`}
                                                >
                                                    {
                                                        priorityData.label
                                                    }
                                                </span>
                                            </WorkspaceTableCell>

                                            <WorkspaceTableCell>
                                                <span
                                                    className={`whitespace-nowrap text-xs ${overdue
                                                            ? "font-medium text-red-600"
                                                            : "text-[var(--workspace-text-muted)]"
                                                        }`}
                                                >
                                                    {formatDate(
                                                        task.dueAt
                                                    )}

                                                    {overdue &&
                                                        " · Overdue"}
                                                </span>
                                            </WorkspaceTableCell>

                                            <WorkspaceTableCell>
                                                <div className="min-w-[130px]">
                                                    <span className="text-xs text-[var(--workspace-text-muted)]">
                                                        {task
                                                            .user
                                                            ?.name ||
                                                            task
                                                                .user
                                                                ?.email ||
                                                            "—"}
                                                    </span>
                                                </div>
                                            </WorkspaceTableCell>

                                            <WorkspaceTableCell>
                                                <span className="whitespace-nowrap text-xs text-[var(--workspace-text-muted)]">
                                                    {formatDate(
                                                        task.createdAt
                                                    )}
                                                </span>
                                            </WorkspaceTableCell>
                                        </WorkspaceTableRow>
                                    );
                                })}
                            </WorkspaceTableBody>
                        </WorkspaceTable>
                    </div>
                </WorkspaceCard>
            )}
        </div>
    );
}