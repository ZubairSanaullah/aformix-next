import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

function SkeletonBlock({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[var(--workspace-border)] ${className}`}
        />
    );
}

export default function SEOPagesListLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <SkeletonBlock className="h-6 w-40" />
                <SkeletonBlock className="h-4 w-96" />
            </div>

            <WorkspaceCard padding="sm">
                <SkeletonBlock className="h-8 w-full" />
            </WorkspaceCard>

            <WorkspaceCard padding="none" className="divide-y divide-[var(--workspace-border)]">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="space-y-2 p-4">
                        <SkeletonBlock className="h-4 w-1/3" />
                        <SkeletonBlock className="h-3 w-1/4" />
                    </div>
                ))}
            </WorkspaceCard>
        </div>
    );
}
