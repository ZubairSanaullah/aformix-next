import type { LucideIcon } from "lucide-react";

interface ActivityItemProps {
    title: string;
    description: string;
    time: string;
    icon: LucideIcon;
}

export default function ActivityItem({
    title,
    description,
    time,
    icon: Icon,
}: ActivityItemProps) {
    return (
        <div className="group flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-background)] transition-colors group-hover:bg-[var(--workspace-primary-soft)]">
                <Icon className="h-3.5 w-3.5 text-[var(--workspace-text-muted)] transition-colors group-hover:text-[var(--workspace-primary)]" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[var(--workspace-text)]">
                    {title}
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[var(--workspace-text-muted)]">
                    {description}
                </p>
            </div>

            <time className="shrink-0 text-[10px] text-[var(--workspace-text-subtle)]">
                {time}
            </time>
        </div>
    );
}