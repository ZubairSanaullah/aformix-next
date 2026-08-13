import { WorkspacePageHeader } from "@/components/workspace/ui";

import {
    ProjectStatsSkeleton,
    ProjectTableSkeleton,
} from "@/components/workspace/projects/ProjectSkeletons";

/**
 * Next.js App Router convention: automatically streamed in while
 * app/workspace/projects/page.tsx is fetching (getProjects + getProjectStats
 * + getProjectOwnerOptions + getCRMCompaniesForFilter). Prevents the blank
 * screen called out in spec §20.
 */
export default function ProjectsLoading() {
    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Projects"
                description="Manage and track projects across your Workspace."
            />

            <ProjectStatsSkeleton />

            <ProjectTableSkeleton />
        </div>
    );
}
