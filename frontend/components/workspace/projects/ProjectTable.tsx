"use client";

import Link from "next/link";
import type { ProjectPriority, ProjectStatus } from "@prisma/client";
import { Building2, ExternalLink, Pencil, User } from "lucide-react";

import {
    WorkspaceEmptyState,
    WorkspaceTable,
    WorkspaceTableBody,
    WorkspaceTableCell,
    WorkspaceTableHead,
    WorkspaceTableHeader,
    WorkspaceTableRow,
} from "@/components/workspace/ui";

import ProjectStatusBadge from "@/components/workspace/projects/ProjectStatusBadge";
import ProjectPriorityBadge from "@/components/workspace/projects/ProjectPriorityBadge";
import ProjectLifecycleActions from "@/components/workspace/projects/ProjectLifecycleActions";

import {
    formatProjectDate,
    isProjectOverdue,
} from "@/lib/utils/project-format";

interface ProjectOwner {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

interface ProjectCompany {
    id: string;
    name: string;
}

export interface ProjectListItem {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    status: ProjectStatus;
    priority: ProjectPriority;
    progress: number;
    startDate: Date | string | null;
    dueDate: Date | string | null;
    updatedAt: Date | string;
    deletedAt: Date | string | null;
    owner: ProjectOwner;
    company: ProjectCompany | null;
}

interface ProjectTableProps {
    projects: ProjectListItem[];
    isAdmin: boolean;
    hasActiveFilters?: boolean;
    onClearFilters?: () => void;
}

function ProgressBar({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--workspace-background)]">
                <div
                    className="h-full rounded-full bg-[var(--workspace-primary)]"
                    style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
                />
            </div>
            <span className="text-[11px] font-medium text-[var(--workspace-text-muted)]">
                {value}%
            </span>
        </div>
    );
}

export default function ProjectTable({
    projects,
    isAdmin,
    hasActiveFilters = false,
    onClearFilters,
}: ProjectTableProps) {
    if (!projects.length) {
        return (
            <WorkspaceEmptyState
                title={
                    hasActiveFilters
                        ? "No projects match your filters"
                        : "No projects yet"
                }
                description={
                    hasActiveFilters
                        ? "Try adjusting or clearing your search and filters."
                        : "Create your first project to start tracking work across your team."
                }
                actionLabel={hasActiveFilters && onClearFilters ? "Clear filters" : undefined}
                onAction={hasActiveFilters && onClearFilters ? onClearFilters : undefined}
            />
        );
    }

    return (
        <>
            {/* Mobile: card list (avoids horizontal table overflow — spec §18) */}
            <div className="space-y-3 sm:hidden">
                {projects.map((project) => {
                    const overdue = isProjectOverdue(
                        project.dueDate,
                        project.status
                    );

                    return (
                        <div
                            key={project.id}
                            className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-4"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <Link
                                    href={`/workspace/projects/${project.id}`}
                                    className="min-w-0 text-xs font-semibold text-[var(--workspace-text)]"
                                >
                                    <span className="line-clamp-1">
                                        {project.name}
                                    </span>
                                </Link>

                                <ProjectPriorityBadge
                                    priority={project.priority}
                                />
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <ProjectStatusBadge status={project.status} />
                                {overdue && (
                                    <span className="text-[10px] font-medium text-red-600">
                                        Overdue
                                    </span>
                                )}
                            </div>

                            <div className="mt-3">
                                <ProgressBar value={project.progress} />
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-[11px] text-[var(--workspace-text-muted)]">
                                <div className="flex items-center gap-1.5">
                                    <User className="h-3 w-3" />
                                    <span className="truncate">
                                        {project.owner.name ??
                                            project.owner.email}
                                    </span>
                                </div>

                                {project.company && (
                                    <div className="flex items-center gap-1.5">
                                        <Building2 className="h-3 w-3" />
                                        <span className="truncate">
                                            {project.company.name}
                                        </span>
                                    </div>
                                )}

                                <span>
                                    Due {formatProjectDate(project.dueDate)}
                                </span>

                                <span>
                                    Updated{" "}
                                    {formatProjectDate(project.updatedAt)}
                                </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-[var(--workspace-border)] pt-3">
                                <Link
                                    href={`/workspace/projects/${project.id}`}
                                    className="text-[11px] font-medium text-[var(--workspace-primary)]"
                                >
                                    View project
                                </Link>

                                {isAdmin && (
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/workspace/projects/${project.id}/edit`}
                                            aria-label={`Edit ${project.name}`}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Link>

                                        <ProjectLifecycleActions
                                            projectId={project.id}
                                            projectName={project.name}
                                            isArchived={Boolean(
                                                project.deletedAt
                                            )}
                                            compact
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop / tablet: full table */}
            <div className="workspace-scrollbar hidden overflow-x-auto sm:block">
            <WorkspaceTable>
                <WorkspaceTableHeader>
                    <WorkspaceTableRow>
                        <WorkspaceTableHead>Project</WorkspaceTableHead>
                        <WorkspaceTableHead>Status</WorkspaceTableHead>
                        <WorkspaceTableHead>Priority</WorkspaceTableHead>
                        <WorkspaceTableHead>Progress</WorkspaceTableHead>
                        <WorkspaceTableHead>Owner</WorkspaceTableHead>
                        <WorkspaceTableHead>Company</WorkspaceTableHead>
                        <WorkspaceTableHead>Start</WorkspaceTableHead>
                        <WorkspaceTableHead>Due</WorkspaceTableHead>
                        <WorkspaceTableHead>Updated</WorkspaceTableHead>
                        <WorkspaceTableHead>Actions</WorkspaceTableHead>
                    </WorkspaceTableRow>
                </WorkspaceTableHeader>

                <WorkspaceTableBody>
                    {projects.map((project) => {
                        const overdue = isProjectOverdue(
                            project.dueDate,
                            project.status
                        );

                        return (
                            <WorkspaceTableRow key={project.id}>
                                <WorkspaceTableCell>
                                    <div className="min-w-[220px]">
                                        <Link
                                            href={`/workspace/projects/${project.id}`}
                                            className="group inline-flex items-center gap-2 text-xs font-semibold text-[var(--workspace-text)] transition-colors hover:text-[var(--workspace-primary)]"
                                        >
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </span>

                                            <span className="truncate">
                                                {project.name}
                                            </span>
                                        </Link>

                                        {project.description && (
                                            <div className="mt-1 pl-9 text-[10px] text-[var(--workspace-text-subtle)]">
                                                <span className="line-clamp-1">
                                                    {project.description}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <div className="flex flex-col gap-1">
                                        <ProjectStatusBadge
                                            status={project.status}
                                        />
                                        {overdue && (
                                            <span className="text-[10px] font-medium text-red-600">
                                                Overdue
                                            </span>
                                        )}
                                    </div>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <ProjectPriorityBadge
                                        priority={project.priority}
                                    />
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <ProgressBar value={project.progress} />
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <div className="flex min-w-[120px] items-center gap-1.5 text-xs text-[var(--workspace-text-muted)]">
                                        <User className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">
                                            {project.owner.name ??
                                                project.owner.email}
                                        </span>
                                    </div>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    {project.company ? (
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--workspace-text-muted)]">
                                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                                            <span className="max-w-[140px] truncate">
                                                {project.company.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-[var(--workspace-text-subtle)]">
                                            —
                                        </span>
                                    )}
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <span className="whitespace-nowrap text-xs text-[var(--workspace-text-muted)]">
                                        {formatProjectDate(project.startDate)}
                                    </span>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <span
                                        className={`whitespace-nowrap text-xs ${
                                            overdue
                                                ? "font-medium text-red-600"
                                                : "text-[var(--workspace-text-muted)]"
                                        }`}
                                    >
                                        {formatProjectDate(project.dueDate)}
                                    </span>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <span className="whitespace-nowrap text-xs text-[var(--workspace-text-muted)]">
                                        {formatProjectDate(project.updatedAt)}
                                    </span>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/workspace/projects/${project.id}`}
                                            aria-label={`View ${project.name}`}
                                            title="View project"
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </Link>

                                        {isAdmin && (
                                            <>
                                                <Link
                                                    href={`/workspace/projects/${project.id}/edit`}
                                                    aria-label={`Edit ${project.name}`}
                                                    title="Edit project"
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Link>

                                                <ProjectLifecycleActions
                                                    projectId={project.id}
                                                    projectName={project.name}
                                                    isArchived={Boolean(
                                                        project.deletedAt
                                                    )}
                                                    compact
                                                />
                                            </>
                                        )}
                                    </div>
                                </WorkspaceTableCell>
                            </WorkspaceTableRow>
                        );
                    })}
                </WorkspaceTableBody>
            </WorkspaceTable>
            </div>
        </>
    );
}
