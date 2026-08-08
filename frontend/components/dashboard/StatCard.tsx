import type { LucideIcon } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    icon: LucideIcon;
}

export default function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: StatCardProps) {
    return (
        <WorkspaceCard
            padding="md"
            className="
                group
                relative
                overflow-hidden
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-[var(--workspace-shadow-md)]
            "
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--workspace-text-muted)]">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-[10px] text-[var(--workspace-text-muted)]">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[var(--workspace-primary-soft)]
                        transition-transform
                        duration-200
                        group-hover:scale-105
                    "
                >
                    <Icon className="h-4 w-4 text-[var(--workspace-primary)]" />
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--workspace-primary)]/10 transition-colors group-hover:bg-[var(--workspace-primary)]/30" />
        </WorkspaceCard>
    );
}