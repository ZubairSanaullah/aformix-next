import { redirect } from "next/navigation";

import { WorkspaceAlert, WorkspacePageHeader } from "@/components/workspace/ui";

import ProjectEditClient from "@/components/workspace/projects/ProjectEditClient";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { getProjectById } from "@/lib/services/projects";
import { getProjectOwnerOptions } from "@/lib/services/project-options";
import { getCRMCompaniesForFilter } from "@/lib/services/crm";

interface ProjectEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectEditPage({
    params,
}: ProjectEditPageProps) {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <WorkspaceAlert variant="danger" title="Access restricted">
                    {error.status === 401
                        ? "Please sign in to edit this project."
                        : "Only administrators can edit projects."}
                </WorkspaceAlert>
            );
        }

        throw error;
    }

    // UI-level guard mirroring the "only ADMIN can manage Projects" rule;
    // the PATCH /api/projects/[id] route enforces this authoritatively.
    if (currentUser.role !== "ADMIN") {
        redirect(`/workspace/projects/${(await params).id}`);
    }

    const { id } = await params;

    const [project, owners, companies] = await Promise.all([
        getProjectById(id),
        getProjectOwnerOptions(),
        getCRMCompaniesForFilter(),
    ]);

    if (!project) {
        return (
            <div className="space-y-6">
                <WorkspacePageHeader
                    title="Project not found"
                    breadcrumbs={[
                        { label: "Projects", href: "/workspace/projects" },
                        { label: "Not found" },
                    ]}
                />

                <WorkspaceAlert variant="warning" title="Project not found">
                    This project may have been permanently deleted, or the
                    link is incorrect.
                </WorkspaceAlert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                breadcrumbs={[
                    { label: "Projects", href: "/workspace/projects" },
                    {
                        label: project.name,
                        href: `/workspace/projects/${project.id}`,
                    },
                    { label: "Edit" },
                ]}
                title={`Edit ${project.name}`}
            />

            <ProjectEditClient
                project={project}
                owners={owners}
                companies={companies}
            />
        </div>
    );
}
