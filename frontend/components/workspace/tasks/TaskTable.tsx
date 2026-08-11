"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    Circle,
    Clock3,
    UserRound,
} from "lucide-react";

import {
    WorkspaceEmptyState,
    WorkspaceTable,
    WorkspaceTableBody,
    WorkspaceTableCell,
    WorkspaceTableHead,
    WorkspaceTableHeader,
    WorkspaceTableRow,
} from "@/components/workspace/ui";

import TaskActions from "@/components/workspace/tasks/TaskActions";
import TaskStatusBadge from "@/components/workspace/tasks/TaskStatusBadge";

type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

interface TaskContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface TaskCompany {
    id: string;
    name: string;
}

interface TaskLead {
    id: string;
    title: string;
}

interface TaskDeal {
    id: string;
    title: string;
}

interface TaskOwner {
    id: string;
    name: string | null;
    email: string;
}

export interface WorkspaceTask {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueAt: Date | string | null;
    completedAt: Date | string | null;
    ownerId: string;
    contactId: string | null;
    companyId: string | null;
    leadId: string | null;
    dealId: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;

    owner: TaskOwner;
    contact: TaskContact | null;
    company: TaskCompany | null;
    lead: TaskLead | null;
    deal: TaskDeal | null;
}

interface TaskTableProps {
    tasks: WorkspaceTask[];
}

function formatDate(date: Date | string | null) {
    if (!date) {
        return "No due date";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function isOverdue(
    date: Date | string | null,
    status: TaskStatus
) {
    if (!date) return false;

    if (
        status === "COMPLETED" ||
        status === "CANCELLED"
    ) {
        return false;
    }

    const dueDate = new Date(date);

    if (Number.isNaN(dueDate.getTime())) {
        return false;
    }

    const today = new Date();

    today.setHours(23, 59, 59, 999);

    return dueDate < today;
}

function formatPriority(priority: TaskPriority) {
    const labels: Record<TaskPriority, string> = {
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
        URGENT: "Urgent",
    };

    return labels[priority];
}

function getPriorityClasses(
    priority: TaskPriority
) {
    switch (priority) {
        case "LOW":
            return "border-slate-200 bg-slate-50 text-slate-700";

        case "MEDIUM":
            return "border-blue-200 bg-blue-50 text-blue-700";

        case "HIGH":
            return "border-amber-200 bg-amber-50 text-amber-700";

        case "URGENT":
            return "border-red-200 bg-red-50 text-red-700";

        default:
            return "border-[var(--workspace-border)] bg-[var(--workspace-background)] text-[var(--workspace-text-muted)]";
    }
}

function getTaskIcon(status: TaskStatus) {
    switch (status) {
        case "COMPLETED":
            return CheckCircle2;

        case "IN_PROGRESS":
            return Clock3;

        default:
            return Circle;
    }
}

export default function TaskTable({
    tasks,
}: TaskTableProps) {
    if (!tasks.length) {
        return (
            <WorkspaceEmptyState
                title="No tasks found"
                description="No tasks match your current filters. Create a task or adjust your search criteria."
            />
        );
    }

    return (
        <WorkspaceTable>
            <WorkspaceTableHeader>
                <WorkspaceTableRow>
                    <WorkspaceTableHead>
                        Task
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Priority
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Status
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Due date
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Contact
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Company
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Owner
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Actions
                    </WorkspaceTableHead>
                </WorkspaceTableRow>
            </WorkspaceTableHeader>

            <WorkspaceTableBody>
                {tasks.map((task) => {
                    const overdue = isOverdue(
                        task.dueAt,
                        task.status
                    );

                    const TaskIcon =
                        getTaskIcon(task.status);

                    return (
                        <WorkspaceTableRow
                            key={task.id}
                        >
                            {/* Task */}
                            <WorkspaceTableCell>
                                <div className="min-w-[240px]">
                                    <Link
                                        href={`/workspace/tasks/${task.id}`}
                                        className="group flex items-start gap-2.5"
                                    >
                                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                            <TaskIcon className="h-3.5 w-3.5" />
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block truncate text-xs font-semibold text-[var(--workspace-text)] transition-colors group-hover:text-[var(--workspace-primary)]">
                                                {task.title}
                                            </span>

                                            {task.description && (
                                                <span className="mt-1 block line-clamp-1 text-[10px] leading-4 text-[var(--workspace-text-subtle)]">
                                                    {
                                                        task.description
                                                    }
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                </div>
                            </WorkspaceTableCell>

                            {/* Priority */}
                            <WorkspaceTableCell>
                                <span
                                    className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-medium ${getPriorityClasses(
                                        task.priority
                                    )}`}
                                >
                                    {formatPriority(
                                        task.priority
                                    )}
                                </span>
                            </WorkspaceTableCell>

                            {/* Status */}
                            <WorkspaceTableCell>
                                <TaskStatusBadge
                                    status={task.status}
                                />
                            </WorkspaceTableCell>

                            {/* Due Date */}
                            <WorkspaceTableCell>
                                <div
                                    className={`flex min-w-[120px] items-center gap-1.5 text-xs ${overdue
                                            ? "font-medium text-red-600"
                                            : "text-[var(--workspace-text-muted)]"
                                        }`}
                                >
                                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />

                                    <span>
                                        {overdue
                                            ? `Overdue · ${formatDate(
                                                task.dueAt
                                            )}`
                                            : formatDate(
                                                task.dueAt
                                            )}
                                    </span>
                                </div>
                            </WorkspaceTableCell>

                            {/* Contact */}
                            <WorkspaceTableCell>
                                {task.contact ? (
                                    <Link
                                        href={`/workspace/crm/contacts/${task.contact.id}`}
                                        className="group flex min-w-[150px] items-center gap-1.5 text-xs text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                                    >
                                        <UserRound className="h-3.5 w-3.5 shrink-0" />

                                        <span className="truncate">
                                            {[
                                                task.contact
                                                    .firstName,
                                                task.contact
                                                    .lastName,
                                            ]
                                                .filter(
                                                    Boolean
                                                )
                                                .join(
                                                    " "
                                                )}
                                        </span>
                                    </Link>
                                ) : (
                                    <span className="text-xs text-[var(--workspace-text-subtle)]">
                                        —
                                    </span>
                                )}
                            </WorkspaceTableCell>

                            {/* Company */}
                            <WorkspaceTableCell>
                                {task.company ? (
                                    <Link
                                        href={`/workspace/crm/companies/${task.company.id}`}
                                        className="min-w-[140px] truncate text-xs text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                                    >
                                        {
                                            task.company
                                                .name
                                        }
                                    </Link>
                                ) : (
                                    <span className="text-xs text-[var(--workspace-text-subtle)]">
                                        —
                                    </span>
                                )}
                            </WorkspaceTableCell>

                            {/* Owner */}
                            <WorkspaceTableCell>
                                <span className="block min-w-[120px] truncate text-xs text-[var(--workspace-text-muted)]">
                                    {task.owner?.name ||
                                        task.owner?.email ||
                                        "Unknown"}
                                </span>
                            </WorkspaceTableCell>

                            {/* Actions */}
                            <WorkspaceTableCell>
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/workspace/tasks/${task.id}`}
                                        aria-label={`View ${task.title}`}
                                        title="View task"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                    >
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Link>

                                    <TaskActions
                                        taskId={task.id}
                                        taskTitle={task.title}
                                    />
                                </div>
                            </WorkspaceTableCell>
                        </WorkspaceTableRow>
                    );
                })}
            </WorkspaceTableBody>
        </WorkspaceTable>
    );
}
