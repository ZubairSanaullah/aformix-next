import { Filter } from "lucide-react";

import WorkspaceButton from "./WorkspaceButton";

interface WorkspaceFilterBarProps {
    children: React.ReactNode;
    onReset?: () => void;
    onClear?: () => void;
    showReset?: boolean;
}

export default function WorkspaceFilterBar({
    children,
    onReset,
    onClear,
    showReset = false,
}: WorkspaceFilterBarProps) {
    const handleReset = onReset ?? onClear;

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-background)]">
                    <Filter className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {children}
                </div>
            </div>

            {showReset && handleReset && (
                <WorkspaceButton
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                >
                    Reset
                </WorkspaceButton>
            )}
        </div>
    );
}