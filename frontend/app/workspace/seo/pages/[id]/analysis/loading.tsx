import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

function SkeletonBlock({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[var(--workspace-border)] ${className}`}
        />
    );
}

export default function SEOPageAnalysisLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <SkeletonBlock className="h-6 w-40" />
                <SkeletonBlock className="h-4 w-72" />
            </div>

            <WorkspaceCard padding="lg" className="flex items-center gap-6 py-8">
                <SkeletonBlock className="h-30 w-30 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-48" />
                    <SkeletonBlock className="h-3 w-64" />
                </div>
            </WorkspaceCard>

            {Array.from({ length: 2 }).map((_, index) => (
                <WorkspaceCard key={index} padding="lg" className="space-y-3">
                    <SkeletonBlock className="h-4 w-40" />
                    <SkeletonBlock className="h-14 w-full" />
                    <SkeletonBlock className="h-14 w-full" />
                </WorkspaceCard>
            ))}
        </div>
    );
}
