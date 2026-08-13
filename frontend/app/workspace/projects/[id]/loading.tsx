import { WorkspacePageHeader } from "@/components/workspace/ui";
import { ProjectDetailSkeleton } from "@/components/workspace/projects/ProjectSkeletons";

export default function ProjectDetailLoading() {
    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                breadcrumbs={[
                    { label: "Projects", href: "/workspace/projects" },
                    { label: "Loading…" },
                ]}
            />

            <ProjectDetailSkeleton />
        </div>
    );
}
