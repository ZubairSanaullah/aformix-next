import type { LucideIcon } from "lucide-react";

import WorkspaceButton from "./WorkspaceButton";

interface WorkspaceEmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function WorkspaceEmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: WorkspaceEmptyStateProps) {
    return (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--workspace-border-strong)] bg-[var(--workspace-surface)] px-6 py-10 text-center">
            {Icon && (
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--workspace-primary-soft)]">
                    <Icon className="h-5 w-5 text-[var(--workspace-primary)]" />
                </div>
            )}

            <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                {title}
            </h3>

            {description && (
                <p className="mt-1.5 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                    {description}
                </p>
            )}

            {actionLabel && onAction && (
                <WorkspaceButton
                    size="sm"
                    className="mt-4"
                    onClick={onAction}
                >
                    {actionLabel}
                </WorkspaceButton>
            )}
        </div>
    );
}