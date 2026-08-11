import {
    forwardRef,
    type SelectHTMLAttributes,
    type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface WorkspaceSelectProps
    extends SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
}

const WorkspaceSelect = forwardRef<
    HTMLSelectElement,
    WorkspaceSelectProps
>(function WorkspaceSelect(
    { className, children, ...props },
    ref
) {
    return (
        <select
            ref={ref}
            className={cn(
                "h-9 w-full rounded-lg border bg-[var(--workspace-surface)] px-3 text-xs text-[var(--workspace-text)] outline-none transition-all",
                "focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10",
                "disabled:cursor-not-allowed disabled:bg-[var(--workspace-background)] disabled:opacity-60",
                "border-[var(--workspace-border)]",
                className
            )}
            {...props}
        >
            {children}
        </select>
    );
});

WorkspaceSelect.displayName = "WorkspaceSelect";

export default WorkspaceSelect;
