import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

function SkeletonBlock({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[var(--workspace-border)] ${className}`}
        />
    );
}

export default function CreateSEOPageLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <SkeletonBlock className="h-6 w-48" />
                <SkeletonBlock className="h-4 w-96" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <WorkspaceCard key={index} padding="lg" className="space-y-3">
                            <SkeletonBlock className="h-4 w-32" />
                            <SkeletonBlock className="h-9 w-full" />
                            <SkeletonBlock className="h-9 w-full" />
                        </WorkspaceCard>
                    ))}
                </div>

                <WorkspaceCard padding="lg" className="space-y-3">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="h-16 w-16 rounded-full" />
                    <SkeletonBlock className="h-10 w-full" />
                </WorkspaceCard>
            </div>
        </div>
    );
}
