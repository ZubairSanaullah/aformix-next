"use client";

import Link from "next/link";
import { Eye, Pencil, Star } from "lucide-react";

import {
    WorkspaceTable,
    WorkspaceTableCell,
    WorkspaceTableHead,
    WorkspaceTableHeader,
    WorkspaceTableRow,
} from "@/components/workspace/ui";

import WorkspaceBadge from "@/components/workspace/ui/WorkspaceBadge";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";

import ArchivePortfolioProjectButton from "./ArchivePortfolioProjectButton";
import RestorePortfolioProjectButton from "./RestorePortfolioProjectButton";
import TrashPortfolioProjectButton from "./TrashPortfolioProjectButton";

import type { PortfolioProjectListItemDb } from "@/lib/services/portfolio-projects";

interface PortfolioProjectsTableProps {
    projects: PortfolioProjectListItemDb[];
}

function getStatusVariant(status: PortfolioProjectListItemDb["status"]) {
    switch (status) {
        case "PUBLISHED":
            return "success" as const;
        case "DRAFT":
            return "warning" as const;
        case "ARCHIVED":
            return "default" as const;
        default:
            return "default" as const;
    }
}

function getVisibilityVariant(
    visibility: PortfolioProjectListItemDb["visibility"],
) {
    return visibility === "PUBLIC" ? ("success" as const) : ("default" as const);
}

function formatDate(date: Date | string | null | undefined) {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function PortfolioProjectsTable({
    projects,
}: PortfolioProjectsTableProps) {
    if (projects.length === 0) {
        return (
            <WorkspaceEmptyState
                title="No portfolio projects found"
                description="No projects match your current filters. Create a new project or adjust your filters."
                actionLabel="Create New Project"
                onAction={() => {
                    window.location.href = "/workspace/portfolio/create";
                }}
            />
        );
    }

    return (
        <WorkspaceTable>
            <WorkspaceTableHeader>
                <tr>
                    <WorkspaceTableHead>Project</WorkspaceTableHead>
                    <WorkspaceTableHead>Category</WorkspaceTableHead>
                    <WorkspaceTableHead>Status</WorkspaceTableHead>
                    <WorkspaceTableHead>Visibility</WorkspaceTableHead>
                    <WorkspaceTableHead>Client</WorkspaceTableHead>
                    <WorkspaceTableHead>Updated</WorkspaceTableHead>
                    <WorkspaceTableHead className="text-right">
                        Actions
                    </WorkspaceTableHead>
                </tr>
            </WorkspaceTableHeader>

            <tbody>
                {projects.map((project) => (
                    <WorkspaceTableRow key={project.id}>
                        <WorkspaceTableCell className="min-w-[260px]">
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <Link
                                        href={`/workspace/portfolio/${project.id}/edit`}
                                        className="
                                            line-clamp-1
                                            text-xs
                                            font-semibold
                                            text-[var(--workspace-text)]
                                            transition-colors
                                            hover:text-[var(--workspace-primary)]
                                        "
                                    >
                                        {project.title}
                                    </Link>

                                    {project.featured && (
                                        <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                                    )}
                                </div>

                                <div className="mt-1 flex items-center gap-2 text-[10px] text-[var(--workspace-text-subtle)]">
                                    <span className="truncate">
                                        {project.slug}
                                    </span>
                                </div>
                            </div>
                        </WorkspaceTableCell>

                        <WorkspaceTableCell>
                            {project.category ? (
                                <span className="text-xs text-[var(--workspace-text-muted)]">
                                    {project.category.name}
                                </span>
                            ) : (
                                <span className="text-[10px] text-[var(--workspace-text-subtle)]">
                                    Uncategorized
                                </span>
                            )}
                        </WorkspaceTableCell>

                        <WorkspaceTableCell>
                            <WorkspaceBadge variant={getStatusVariant(project.status)}>
                                {project.status === "PUBLISHED"
                                    ? "Published"
                                    : project.status === "DRAFT"
                                      ? "Draft"
                                      : "Archived"}
                            </WorkspaceBadge>
                        </WorkspaceTableCell>

                        <WorkspaceTableCell>
                            <WorkspaceBadge
                                variant={getVisibilityVariant(project.visibility)}
                            >
                                {project.visibility === "PUBLIC"
                                    ? "Public"
                                    : "Internal"}
                            </WorkspaceBadge>
                        </WorkspaceTableCell>

                        <WorkspaceTableCell>
                            {project.clientName ? (
                                <span className="text-xs text-[var(--workspace-text-muted)]">
                                    {project.clientName}
                                </span>
                            ) : (
                                <span className="text-[10px] text-[var(--workspace-text-subtle)]">
                                    —
                                </span>
                            )}
                        </WorkspaceTableCell>

                        <WorkspaceTableCell>
                            <span className="whitespace-nowrap text-xs text-[var(--workspace-text-muted)]">
                                {formatDate(project.updatedAt)}
                            </span>
                        </WorkspaceTableCell>

                        <WorkspaceTableCell>
                            <div className="flex items-center justify-end gap-1.5">
                                <Link
                                    href={`/workspace/portfolio/${project.id}/preview`}
                                    className="
                                        inline-flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-[var(--workspace-border)]
                                        text-[var(--workspace-text-muted)]
                                        transition-colors
                                        hover:border-[var(--workspace-primary)]/30
                                        hover:bg-[var(--workspace-primary-soft)]
                                        hover:text-[var(--workspace-primary)]
                                    "
                                    title="Preview project"
                                    aria-label="Preview project"
                                >
                                    <Eye className="h-4 w-4" />
                                </Link>

                                <Link
                                    href={`/workspace/portfolio/${project.id}/edit`}
                                    className="
                                        inline-flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-[var(--workspace-border)]
                                        text-[var(--workspace-text-muted)]
                                        transition-colors
                                        hover:border-[var(--workspace-primary)]/30
                                        hover:bg-[var(--workspace-primary-soft)]
                                        hover:text-[var(--workspace-primary)]
                                    "
                                    title="Edit project"
                                    aria-label="Edit project"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>

                                {project.status === "ARCHIVED" ? (
                                    <RestorePortfolioProjectButton
                                        projectId={project.id}
                                    />
                                ) : (
                                    <ArchivePortfolioProjectButton
                                        projectId={project.id}
                                    />
                                )}

                                <TrashPortfolioProjectButton
                                    projectId={project.id}
                                    projectTitle={project.title}
                                />
                            </div>
                        </WorkspaceTableCell>
                    </WorkspaceTableRow>
                ))}
            </tbody>
        </WorkspaceTable>
    );
}