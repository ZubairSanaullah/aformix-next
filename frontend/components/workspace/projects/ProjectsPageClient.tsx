"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { ProjectPriority, ProjectStatus } from "@prisma/client";

import { WorkspaceButton, WorkspacePageActions } from "@/components/workspace/ui";

import ProjectFilters from "@/components/workspace/projects/ProjectFilters";
import ProjectTable, {
    type ProjectListItem,
} from "@/components/workspace/projects/ProjectTable";
import ProjectPagination, {
    type ProjectPaginationData,
} from "@/components/workspace/projects/ProjectPagination";
import ProjectForm from "@/components/workspace/projects/ProjectForm";
import { WorkspaceCard } from "@/components/workspace/ui";

interface ProjectFilterOwner {
    id: string;
    name: string | null;
    email: string;
}

interface ProjectFilterCompany {
    id: string;
    name: string;
}

interface ProjectsPageClientProps {
    projects: ProjectListItem[];
    pagination: ProjectPaginationData;
    owners: ProjectFilterOwner[];
    companies: ProjectFilterCompany[];
    isAdmin: boolean;
    hasActiveFilters: boolean;
}

export default function ProjectsPageClient({
    projects,
    pagination,
    owners,
    companies,
    isAdmin,
    hasActiveFilters,
}: ProjectsPageClientProps) {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="space-y-4">
            {isAdmin && (
                <div className="flex items-center justify-end">
                    <WorkspacePageActions>
                        <WorkspaceButton
                            type="button"
                            onClick={() => setIsCreating(true)}
                            disabled={isCreating}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Project
                        </WorkspaceButton>
                    </WorkspacePageActions>
                </div>
            )}

            {isCreating && (
                <ProjectForm
                    mode="create"
                    owners={owners}
                    companies={companies}
                    onCancel={() => setIsCreating(false)}
                />
            )}

            {!isCreating && (
                <>
                    <ProjectFilters owners={owners} companies={companies} />

                    <WorkspaceCard padding="none">
                        <div className="p-4">
                            <ProjectTable
                                projects={projects}
                                isAdmin={isAdmin}
                                hasActiveFilters={hasActiveFilters}
                                onClearFilters={() =>
                                    router.push("/workspace/projects")
                                }
                            />
                        </div>

                        <ProjectPagination pagination={pagination} />
                    </WorkspaceCard>
                </>
            )}
        </div>
    );
}
