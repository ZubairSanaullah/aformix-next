"use client";

import { WorkspaceCard, WorkspaceSkeleton } from "@/components/workspace/ui";

export default function FinanceSkeleton() {
    return (
        <div className="space-y-6">
            {/* Metric Cards Skeleton */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <WorkspaceCard key={i} padding="md">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <WorkspaceSkeleton className="h-3 w-16" />
                                <WorkspaceSkeleton className="h-3.5 w-3.5 rounded-full" />
                            </div>
                            <WorkspaceSkeleton className="h-5 w-24" />
                            <WorkspaceSkeleton className="h-3 w-20" />
                        </div>
                    </WorkspaceCard>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <WorkspaceCard key={i} padding="lg">
                        <WorkspaceSkeleton className="mb-6 h-5 w-40" />
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, j) => (
                                <div key={j} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <WorkspaceSkeleton className="h-4 w-24" />
                                        <WorkspaceSkeleton className="h-4 w-20" />
                                    </div>
                                    <WorkspaceSkeleton className="h-2 w-full rounded-full" />
                                </div>
                            ))}
                        </div>
                    </WorkspaceCard>
                ))}
            </div>

            {/* Recent Transactions Skeleton */}
            <WorkspaceCard padding="lg">
                <WorkspaceSkeleton className="mb-4 h-5 w-40" />
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--workspace-border)] p-3">
                            <div className="flex-1">
                                <WorkspaceSkeleton className="mb-2 h-4 w-32" />
                                <WorkspaceSkeleton className="h-3 w-24" />
                            </div>
                            <WorkspaceSkeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </WorkspaceCard>
        </div>
    );
}
