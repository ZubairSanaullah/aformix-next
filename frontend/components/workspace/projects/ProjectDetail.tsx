import Link from "next/link";
import {
    Building2,
    Calendar,
    CalendarCheck,
    CalendarClock,
    Pencil,
    User,
} from "lucide-react";

import {
    WorkspaceBadge,
    WorkspaceCard,
    WorkspaceEmptyState,
} from "@/components/workspace/ui";

import ProjectStatusBadge from "@/components/workspace/projects/ProjectStatusBadge";
import ProjectPriorityBadge from "@/components/workspace/projects/ProjectPriorityBadge";
import ProjectLifecycleActions from "@/components/workspace/projects/ProjectLifecycleActions";

import {
    formatProjectDate,
    isProjectOverdue,
} from "@/lib/utils/project-format";

/**
 * Shape returned by lib/services/projects.ts -> getProjectById(). Only the
 * fields this view actually renders are typed here.
 */
export interface ProjectDetailData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    progress: number;
    startDate: Date | string | null;
    dueDate: Date | string | null;
    completedAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt: Date | string | null;
    owner: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    };
    company: {
        id: string;
        name: string;
    } | null;
    tasks: {
        id: string;
        title: string;
        status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
        priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
        dueAt: Date | string | null;
        owner: {
            id: string;
            name: string | null;
            email: string;
            image: string | null;
        } | null;
    }[];
    activities: {
        id: string;
        type: string;
        title: string;
        description: string | null;
        createdAt: Date | string;
        user: {
            id: string;
            name: string | null;
            email: string;
            image: string | null;
        };
    }[];
}

function TaskStatusPill({
    status,
}: {
    status: ProjectDetailData["tasks"][number]["status"];
}) {
    const variantMap = {
        TODO: "neutral",
        IN_PROGRESS: "info",
        COMPLETED: "success",
        CANCELLED: "danger",
    } as const;

    const labelMap = {
        TODO: "To Do",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
    } as const;

    return (
        <WorkspaceBadge variant={variantMap[status]}>
            {labelMap[status]}
        </WorkspaceBadge>
    );
}

export function ProjectDetailHeader({
    project,
    isAdmin,
}: {
    project: ProjectDetailData;
    isAdmin: boolean;
}) {
    const overdue = isProjectOverdue(project.dueDate, project.status);

    return (
        <WorkspaceCard padding="lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-lg font-semibold text-[var(--workspace-text)] sm:text-xl">
                            {project.name}
                        </h1>

                        <ProjectStatusBadge status={project.status} />
                        <ProjectPriorityBadge priority={project.priority} />

                        {project.deletedAt && (
                            <WorkspaceBadge variant="neutral">
                                Archived
                            </WorkspaceBadge>
                        )}

                        {overdue && (
                            <WorkspaceBadge variant="danger">
                                Overdue
                            </WorkspaceBadge>
                        )}
                    </div>

                    {project.description && (
                        <p className="mt-2 max-w-2xl text-xs leading-5 text-[var(--workspace-text-muted)] sm:text-sm">
                            {project.description}
                        </p>
                    )}
                </div>

                {isAdmin && (
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={`/workspace/projects/${project.id}/edit`}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3.5 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)]"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Link>

                        <ProjectLifecycleActions
                            projectId={project.id}
                            projectName={project.name}
                            isArchived={Boolean(project.deletedAt)}
                            redirectAfterArchiveOrDeleteTo="/workspace/projects"
                        />
                    </div>
                )}
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--workspace-text)]">
                        Progress
                    </span>
                    <span className="text-[var(--workspace-text-muted)]">
                        {project.progress}%
                    </span>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--workspace-background)]">
                    <div
                        className="h-full rounded-full bg-[var(--workspace-primary)] transition-all"
                        style={{
                            width: `${Math.min(Math.max(project.progress, 0), 100)}%`,
                        }}
                    />
                </div>
            </div>
        </WorkspaceCard>
    );
}

export function ProjectInformation({
    project,
}: {
    project: ProjectDetailData;
}) {
    const items = [
        {
            label: "Owner",
            value: project.owner.name ?? project.owner.email,
            icon: User,
        },
        {
            label: "Company",
            value: project.company?.name ?? "—",
            icon: Building2,
        },
        {
            label: "Start Date",
            value: formatProjectDate(project.startDate),
            icon: Calendar,
        },
        {
            label: "Due Date",
            value: formatProjectDate(project.dueDate),
            icon: CalendarClock,
        },
        {
            label: "Completed",
            value: formatProjectDate(project.completedAt),
            icon: CalendarCheck,
        },
        {
            label: "Created",
            value: formatProjectDate(project.createdAt),
            icon: Calendar,
        },
        {
            label: "Last Updated",
            value: formatProjectDate(project.updatedAt),
            icon: Calendar,
        },
        {
            label: "Slug",
            value: project.slug,
            icon: Calendar,
        },
    ];

    return (
        <WorkspaceCard>
            <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                Project Information
            </h2>

            <dl className="mt-4 grid grid-cols-2 gap-4">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div key={item.label}>
                            <dt className="flex items-center gap-1.5 text-[11px] text-[var(--workspace-text-muted)]">
                                <Icon className="h-3 w-3" />
                                {item.label}
                            </dt>
                            <dd className="mt-1 truncate text-xs font-medium text-[var(--workspace-text)]">
                                {item.value}
                            </dd>
                        </div>
                    );
                })}
            </dl>
        </WorkspaceCard>
    );
}

export function ProjectTasksCard({
    tasks,
}: {
    tasks: ProjectDetailData["tasks"];
}) {
    return (
        <WorkspaceCard padding="none">
            <div className="border-b border-[var(--workspace-border)] p-4">
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Tasks
                </h2>
            </div>

            {tasks.length === 0 ? (
                <div className="p-4">
                    <WorkspaceEmptyState
                        title="No tasks yet"
                        description="Tasks linked to this project will show up here."
                    />
                </div>
            ) : (
                <div className="divide-y divide-[var(--workspace-border)]">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-[var(--workspace-text)]">
                                    {task.title}
                                </p>
                                <p className="mt-1 text-[11px] text-[var(--workspace-text-muted)]">
                                    {task.owner?.name ??
                                        task.owner?.email ??
                                        "Unassigned"}{" "}
                                    · Due {formatProjectDate(task.dueAt)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <ProjectPriorityBadge priority={task.priority} />
                                <TaskStatusPill status={task.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </WorkspaceCard>
    );
}

export function ProjectActivityTimeline({
    activities,
}: {
    activities: ProjectDetailData["activities"];
}) {
    return (
        <WorkspaceCard padding="none">
            <div className="border-b border-[var(--workspace-border)] p-4">
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Activity
                </h2>
            </div>

            {activities.length === 0 ? (
                <div className="p-4">
                    <WorkspaceEmptyState
                        title="No activity yet"
                        description="Project changes (created, updated, archived, restored) will appear here."
                    />
                </div>
            ) : (
                <ul className="divide-y divide-[var(--workspace-border)]">
                    {activities.map((activity) => (
                        <li key={activity.id} className="flex gap-3 p-4">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--workspace-primary-soft)] text-[10px] font-semibold text-[var(--workspace-primary)]">
                                {(activity.user.name ??
                                    activity.user.email)[0]?.toUpperCase()}
                            </span>

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-[var(--workspace-text)]">
                                    {activity.title}
                                </p>

                                {activity.description && (
                                    <p className="mt-0.5 text-[11px] text-[var(--workspace-text-muted)]">
                                        {activity.description}
                                    </p>
                                )}

                                <p className="mt-1 text-[10px] text-[var(--workspace-text-subtle)]">
                                    {activity.user.name ?? activity.user.email}
                                    {" · "}
                                    {formatProjectDate(activity.createdAt)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </WorkspaceCard>
    );
}
