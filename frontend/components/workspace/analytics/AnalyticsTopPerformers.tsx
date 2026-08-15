"use client";

import { Trophy } from "lucide-react";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";
import WorkspaceSkeleton from "@/components/workspace/ui/WorkspaceSkeleton";

export interface TopPerformerItem {
    id: string;
    name: string;
    value: string | number;
    subtitle?: string;
}

interface AnalyticsTopPerformersProps {
    title: string;
    items: TopPerformerItem[];
    isLoading?: boolean;
}

export default function AnalyticsTopPerformers({
    title,
    items,
    isLoading = false,
}: AnalyticsTopPerformersProps) {
    if (isLoading) {
        return (
            <WorkspaceCard padding="md" className="space-y-4">
                <WorkspaceSkeleton className="h-5 w-32" />
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <WorkspaceSkeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
            </WorkspaceCard>
        );
    }

    if (!items || items.length === 0) {
        return (
            <WorkspaceCard padding="md" className="h-full flex flex-col items-center justify-center min-h-[200px]">
                <WorkspaceEmptyState
                    icon={Trophy}
                    title="No Data"
                    description={`No top ${title.toLowerCase()} available.`}
                />
            </WorkspaceCard>
        );
    }

    return (
        <WorkspaceCard padding="md" className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/10 text-amber-500">
                    <Trophy className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                    Top {title}
                </h3>
            </div>

            <div className="space-y-2 flex-1">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-2.5 transition-colors hover:border-[var(--workspace-border-hover)]"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--workspace-surface)] text-[10px] font-medium text-[var(--workspace-text-muted)] border border-[var(--workspace-border)]">
                                {index + 1}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-[var(--workspace-text)]">
                                    {item.name}
                                </p>
                                {item.subtitle && (
                                    <p className="truncate text-[10px] text-[var(--workspace-text-muted)]">
                                        {item.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="shrink-0 pl-3">
                            <span className="text-xs font-semibold text-[var(--workspace-text)]">
                                {item.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </WorkspaceCard>
    );
}
