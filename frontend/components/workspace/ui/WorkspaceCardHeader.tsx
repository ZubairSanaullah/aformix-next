import { ReactNode } from "react";

interface WorkspaceCardHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function WorkspaceCardHeader({
    title,
    description,
    action,
}: WorkspaceCardHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4 px-5 py-5">
            <div className="min-w-0">
                <h2 className="text-sm font-semibold tracking-[-0.01em] text-[var(--workspace-text)]">
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