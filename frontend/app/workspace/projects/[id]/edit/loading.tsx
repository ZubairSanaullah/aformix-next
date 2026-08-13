import { WorkspacePageHeader } from "@/components/workspace/ui";
import { WorkspaceCard } from "@/components/workspace/ui";

function Shimmer({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[var(--workspace-background)] ${className}`}
        />
    );
}

export default function ProjectEditLoading() {
    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                breadcrumbs={[
                    { label: "Projects", href: "/workspace/projects" },
                    { label: "Loading…" },
                ]}
                title="Loading project…"
            />

            <WorkspaceCard>
                <div className="space-y-6 p-2">
                    <Shimmer className="h-4 w-40" />

                    <div className="grid gap-5 md:grid-cols-2">
                        <Shimmer className="h-10 w-full" />
                        <Shimmer className="h-10 w-full" />
                        <Shimmer className="h-10 w-full" />
                        <Shimmer className="h-10 w-full" />
                    </div>

                    <Shimmer className="h-24 w-full" />

                    <div className="grid gap-5 md:grid-cols-3">
                        <Shimmer className="h-10 w-full" />
                        <Shimmer className="h-10 w-full" />
                        <Shimmer className="h-10 w-full" />
                    </div>
                </div>
            </WorkspaceCard>
        </div>
    );
}
