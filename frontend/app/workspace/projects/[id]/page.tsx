import { WorkspaceAlert, WorkspacePageHeader } from "@/components/workspace/ui";

import {
    ProjectActivityTimeline,
    ProjectDetailHeader,
    ProjectInformation,
    ProjectTasksCard,
} from "@/components/workspace/projects/ProjectDetail";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { getProjectById } from "@/lib/services/projects";

interface ProjectDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectDetailPage({
    params,
}: ProjectDetailPageProps) {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <WorkspaceAlert variant="danger" title="Access restricted">
                    {error.status === 401
                        ? "Please sign in to view this project."
                        : "Only administrators can access the Projects module."}
                </WorkspaceAlert>
            );
        }

        throw error;
    }

    const { id } = await params;
    const project = await getProjectById(id);

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
                    { label: project.name },
                ]}
            />

            <ProjectDetailHeader
                project={project}
                isAdmin={currentUser.role === "ADMIN"}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-1">
                    <ProjectInformation project={project} />
                </div>

                <div className="space-y-6 lg:col-span-2">
                    <ProjectTasksCard tasks={project.tasks} />
                    <ProjectActivityTimeline activities={project.activities} />
                </div>
            </div>
        </div>
    );
}
