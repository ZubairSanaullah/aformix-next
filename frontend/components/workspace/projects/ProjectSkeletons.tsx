import { WorkspaceCard } from "@/components/workspace/ui";

function Shimmer({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[var(--workspace-background)] ${className}`}
        />
    );
}

export function ProjectStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <WorkspaceCard key={index} padding="md">
                    <Shimmer className="h-3 w-16" />
                    <Shimmer className="mt-3 h-6 w-10" />
                </WorkspaceCard>
            ))}
        </div>
    );
}

export function ProjectTableSkeleton() {
    return (
        <WorkspaceCard padding="none">
            <div className="divide-y divide-[var(--workspace-border)]">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 px-4 py-3.5"
                    >
                        <Shimmer className="h-8 w-8 shrink-0 rounded-md" />
                        <Shimmer className="h-3 w-40" />
                        <Shimmer className="h-3 w-20" />
                        <Shimmer className="h-3 w-16" />
                        <Shimmer className="ml-auto h-3 w-24" />
                    </div>
                ))}
            </div>
        </WorkspaceCard>
    );
}

export function ProjectDetailSkeleton() {
    return (
        <div className="space-y-6">
            <WorkspaceCard padding="lg">
                <Shimmer className="h-5 w-64" />
                <Shimmer className="mt-3 h-3 w-96" />
                <Shimmer className="mt-6 h-2 w-full rounded-full" />
            </WorkspaceCard>

            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <WorkspaceCard key={index} padding="md">
                        <Shimmer className="h-3 w-20" />
                        <Shimmer className="mt-3 h-4 w-32" />
                    </WorkspaceCard>
                ))}
            </div>
        </div>
    );
}
