import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CircleUserRound,
    BriefcaseBusiness,
    Target,
} from "lucide-react";

import {
    WorkspaceBreadcrumbs,
    WorkspaceCard,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import TaskActions from "@/components/workspace/tasks/TaskActions";
import TaskStatusBadge from "@/components/workspace/tasks/TaskStatusBadge";

import { getTaskById } from "@/lib/services/tasks";

interface TaskDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

function formatDate(date: Date | string | null) {
    if (!date) return "No due date";

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function formatDateTime(date: Date | string | null) {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
}

function formatPriority(priority: string) {
    const labels: Record<string, string> = {
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
        URGENT: "Urgent",
    };

    return labels[priority] ?? priority;
}

function getPriorityClasses(priority: string) {
    switch (priority) {
        case "LOW":
            return "bg-slate-50 text-slate-700 border-slate-200";

        case "MEDIUM":
            return "bg-blue-50 text-blue-700 border-blue-200";

        case "HIGH":
            return "bg-amber-50 text-amber-700 border-amber-200";

        case "URGENT":
            return "bg-red-50 text-red-700 border-red-200";

        default:
            return "bg-[var(--workspace-background)] text-[var(--workspace-text-muted)] border-[var(--workspace-border)]";
    }
}

export default async function TaskDetailPage({
    params,
}: TaskDetailPageProps) {
    const { id } = await params;

    const task = await getTaskById(id);

    if (!task) {
        return (
            <div className="space-y-6">
                <WorkspaceBreadcrumbs
                    items={[
                        {
                            label: "Tasks",
                            href: "/workspace/tasks",
                        },
                        {
                            label: "Task Not Found",
                        },
                    ]}
                />

                <WorkspaceCard className="p-8">
                    <div className="text-center">
                        <h1 className="text-lg font-semibold text-[var(--workspace-text)]">
                            Task not found
                        </h1>

                        <p className="mt-2 text-sm text-[var(--workspace-text-muted)]">
                            The task you are looking for does not
                            exist or may have been removed.
                        </p>

                        <Link
                            href="/workspace/tasks"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--workspace-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Tasks
                        </Link>
                    </div>
                </WorkspaceCard>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    {
                        label: "Tasks",
                        href: "/workspace/tasks",
                    },
                    {
                        label: task.title,
                    },
                ]}
            />

            <WorkspacePageHeader
                title={task.title}
                description={
                    task.description ||
                    "View task details and CRM relationships."
                }
            >
                <Link
                    href="/workspace/tasks"
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-xs font-medium text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                </Link>

                <TaskActions
                    taskId={task.id}
                    taskTitle={task.title}
                />
            </WorkspacePageHeader>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                {/* Main Details */}
                <div className="space-y-6">
                    <WorkspaceCard className="p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--workspace-text-subtle)]">
                                    Task status
                                </p>

                                <div className="mt-2">
                                    <TaskStatusBadge
                                        status={task.status}
                                    />
                                </div>
                            </div>

                            <div className="text-left sm:text-right">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--workspace-text-subtle)]">
                                    Priority
                                </p>

                                <span
                                    className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${getPriorityClasses(
                                        task.priority
                                    )}`}
                                >
                                    {formatPriority(
                                        task.priority
                                    )}
                                </span>
                            </div>
                        </div>
                    </WorkspaceCard>

                    <WorkspaceCard className="p-6">
                        <div className="mb-5">
                            <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                                Description
                            </h2>

                            <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                                Task details and notes.
                            </p>
                        </div>

                        {task.description ? (
                            <div className="whitespace-pre-wrap rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 text-sm leading-6 text-[var(--workspace-text-muted)]">
                                {task.description}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-[var(--workspace-border)] p-6 text-center">
                                <p className="text-xs text-[var(--workspace-text-subtle)]">
                                    No description has been added.
                                </p>
                            </div>
                        )}
                    </WorkspaceCard>

                    <WorkspaceCard className="p-6">
                        <div className="mb-5">
                            <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                                CRM Relationships
                            </h2>

                            <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                                Records connected to this task.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {/* Contact */}
                            <div className="rounded-xl border border-[var(--workspace-border)] p-4">
                                <div className="flex items-center gap-2">
                                    <CircleUserRound className="h-4 w-4 text-[var(--workspace-primary)]" />

                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                        Contact
                                    </span>
                                </div>

                                <div className="mt-3">
                                    {task.contact ? (
                                        <Link
                                            href={`/workspace/crm/contacts/${task.contact.id}`}
                                            className="text-sm font-medium text-[var(--workspace-text)] hover:text-[var(--workspace-primary)]"
                                        >
                                            {[
                                                task.contact.firstName,
                                                task.contact.lastName,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-[var(--workspace-text-subtle)]">
                                            Not connected
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Company */}
                            <div className="rounded-xl border border-[var(--workspace-border)] p-4">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-[var(--workspace-primary)]" />

                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                        Company
                                    </span>
                                </div>

                                <div className="mt-3">
                                    {task.company ? (
                                        <Link
                                            href={`/workspace/crm/companies/${task.company.id}`}
                                            className="text-sm font-medium text-[var(--workspace-text)] hover:text-[var(--workspace-primary)]"
                                        >
                                            {task.company.name}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-[var(--workspace-text-subtle)]">
                                            Not connected
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Lead */}
                            <div className="rounded-xl border border-[var(--workspace-border)] p-4">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-[var(--workspace-primary)]" />

                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                        Lead
                                    </span>
                                </div>

                                <div className="mt-3">
                                    {task.lead ? (
                                        <Link
                                            href={`/workspace/crm/leads/${task.lead.id}`}
                                            className="text-sm font-medium text-[var(--workspace-text)] hover:text-[var(--workspace-primary)]"
                                        >
                                            {task.lead.title}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-[var(--workspace-text-subtle)]">
                                            Not connected
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Deal */}
                            <div className="rounded-xl border border-[var(--workspace-border)] p-4">
                                <div className="flex items-center gap-2">
                                    <BriefcaseBusiness className="h-4 w-4 text-[var(--workspace-primary)]" />

                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                        Deal
                                    </span>
                                </div>

                                <div className="mt-3">
                                    {task.deal ? (
                                        <Link
                                            href={`/workspace/crm/deals/${task.deal.id}`}
                                            className="text-sm font-medium text-[var(--workspace-text)] hover:text-[var(--workspace-primary)]"
                                        >
                                            {task.deal.title}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-[var(--workspace-text-subtle)]">
                                            Not connected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </WorkspaceCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <WorkspaceCard className="p-6">
                        <div className="mb-5">
                            <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                                Task Information
                            </h2>

                            <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                                Important task metadata.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[var(--workspace-text-muted)]" />

                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                        Due date
                                    </p>

                                    <p className="mt-1 text-sm text-[var(--workspace-text)]">
                                        {formatDate(task.dueAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-[var(--workspace-border)]" />

                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                    Created
                                </p>

                                <p className="mt-1 text-sm text-[var(--workspace-text)]">
                                    {formatDateTime(
                                        task.createdAt
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                    Last updated
                                </p>

                                <p className="mt-1 text-sm text-[var(--workspace-text)]">
                                    {formatDateTime(
                                        task.updatedAt
                                    )}
                                </p>
                            </div>

                            {task.completedAt && (
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                        Completed
                                    </p>

                                    <p className="mt-1 text-sm text-[var(--workspace-text)]">
                                        {formatDateTime(
                                            task.completedAt
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    </WorkspaceCard>

                    <WorkspaceCard className="p-6">
                        <div className="flex items-start gap-3">
                            <CircleUserRound className="mt-0.5 h-4 w-4 shrink-0 text-[var(--workspace-primary)]" />

                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                    Owner
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-[var(--workspace-text)]">
                                    {task.owner?.name ||
                                        task.owner?.email ||
                                        "Unknown"}
                                </p>

                                {task.owner?.email &&
                                    task.owner?.name && (
                                        <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                            {task.owner.email}
                                        </p>
                                    )}
                            </div>
                        </div>
                    </WorkspaceCard>
                </div>
            </div>
        </div>
    );
}
