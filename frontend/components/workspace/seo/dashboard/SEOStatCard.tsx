import type { ReactNode } from "react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import { cn } from "@/lib/utils";

interface SEOStatCardProps {
    label: string;
    value: ReactNode;
    icon: ReactNode;
    sublabel?: string;
    accentVar?: string;
    className?: string;
}

export default function SEOStatCard({
    label,
    value,
    icon,
    sublabel,
    accentVar = "--workspace-primary",
    className,
}: SEOStatCardProps) {
    return (
        <WorkspaceCard
            padding="lg"
            className={cn("flex items-start gap-3", className)}
        >
            <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                    backgroundColor: `color-mix(in srgb, var(${accentVar}) 12%, transparent)`,
                    color: `var(${accentVar})`,
                }}
            >
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                    {label}
                </p>

                <p className="mt-1 text-xl font-semibold text-[var(--workspace-text)]">
                    {value}
                </p>

                {sublabel && (
                    <p className="mt-0.5 text-xs text-[var(--workspace-text-muted)]">
                        {sublabel}
                    </p>
                )}
            </div>
        </WorkspaceCard>
    );
}
