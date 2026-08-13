import {
    WorkspaceAlert,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import ProjectStats from "@/components/workspace/projects/ProjectStats";
import ProjectsPageClient from "@/components/workspace/projects/ProjectsPageClient";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { getProjects, getProjectStats } from "@/lib/services/projects";
import { getProjectOwnerOptions } from "@/lib/services/project-options";
import { getCRMCompaniesForFilter } from "@/lib/services/crm";

import type {
    ProjectPriority,
    ProjectStatus,
} from "@prisma/client";

interface ProjectsPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        priority?: string;
        ownerId?: string;
        companyId?: string;
        sort?: string;
        order?: string;
    }>;
}

const VALID_SORT_FIELDS = [
    "createdAt",
    "updatedAt",
    "name",
    "dueDate",
    "priority",
    "status",
    "progress",
] as const;

export default async function ProjectsPage({
    searchParams,
}: ProjectsPageProps) {
    /*
     * This page reads Projects directly via the service layer (not through
     * /api/projects), so it must enforce the same admin-only rule the API
     * routes enforce with requireAdmin() — otherwise viewing this page
     * would bypass the "ONLY ADMIN users" rule for the whole module.
     * See Phase 14 handoff §5 / §19.
     */
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <WorkspacePageHeader
                        title="Projects"
                        description="Manage and track projects across your Workspace."
                    />

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to view Projects."
                            : "Only administrators can access the Projects module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    const params = await searchParams;

    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const search = params.search?.trim() || undefined;
    const status = params.status as ProjectStatus | undefined;
    const priority = params.priority as ProjectPriority | undefined;
    const ownerId = params.ownerId || undefined;
    const companyId = params.companyId || undefined;
    const sort = (VALID_SORT_FIELDS as readonly string[]).includes(
        params.sort ?? ""
    )
        ? (params.sort as (typeof VALID_SORT_FIELDS)[number])
        : "createdAt";
    const order = params.order === "asc" ? "asc" : "desc";

    const [{ projects, pagination }, stats, owners, companies] =
        await Promise.all([
            getProjects({
                page,
                search,
                status,
                priority,
                ownerId,
                companyId,
                sort,
                order,
            }),

            getProjectStats(),

            getProjectOwnerOptions(),

            getCRMCompaniesForFilter(),
        ]);

    const hasActiveFilters = Boolean(
        search || status || priority || ownerId || companyId
    );

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Projects"
                description="Manage and track projects across your Workspace."
            />

            <ProjectStats stats={stats} />

            <ProjectsPageClient
                projects={projects}
                pagination={pagination}
                owners={owners}
                companies={companies}
                isAdmin={currentUser.role === "ADMIN"}
                hasActiveFilters={hasActiveFilters}
            />
        </div>
    );
}
