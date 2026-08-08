import { cn } from "@/lib/utils";

interface WorkspaceSectionHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export default function WorkspaceSectionHeader({
    title,
    description,
    action,
    className,
}: WorkspaceSectionHeaderProps) {
    return (
        <div
            className={cn(
                "flex items-end justify-between gap-4",
                className
            )}
        >
            <div className="min-w-0">
                <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-xs leading-5 text-[var(--workspace-text-muted)]">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}