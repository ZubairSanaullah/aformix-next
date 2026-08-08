import { ReactNode } from "react";

interface WorkspaceFiltersProps {
    children: ReactNode;
    className?: string;
}

export default function WorkspaceFilters({
    children,
    className = "",
}: WorkspaceFiltersProps) {
    return (
        <div
            className={`
        flex
        flex-col
        gap-3
        rounded-xl
        border
        border-[var(--workspace-border)]
        bg-[var(--workspace-surface)]
        p-3
        sm:flex-row
        sm:items-center
        sm:justify-between
        ${className}
      `}
        >
            {children}
        </div>
    );
}