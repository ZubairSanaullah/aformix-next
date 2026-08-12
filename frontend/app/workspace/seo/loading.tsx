import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

function SkeletonBlock({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[var(--workspace-border)] ${className}`}
        />
    );
}

export default function SEODashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <SkeletonBlock className="h-6 w-48" />
                <SkeletonBlock className="h-4 w-72" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <WorkspaceCard key={index} padding="lg" className="space-y-3">
                        <SkeletonBlock className="h-9 w-9 rounded-lg" />
                        <SkeletonBlock className="h-3 w-20" />
                        <SkeletonBlock className="h-6 w-12" />
                    </WorkspaceCard>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <WorkspaceCard padding="lg" className="space-y-3 lg:col-span-2">
                    <SkeletonBlock className="h-4 w-40" />
                    {Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonBlock key={index} className="h-10 w-full" />
                    ))}
                </WorkspaceCard>

                <WorkspaceCard padding="lg" className="space-y-3">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="h-2 w-full" />
                    <SkeletonBlock className="h-10 w-full" />
                </WorkspaceCard>
            </div>
        </div>
    );
}
