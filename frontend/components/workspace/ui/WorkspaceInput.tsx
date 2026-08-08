import {
    forwardRef,
    type InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface WorkspaceInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const WorkspaceInput = forwardRef<
    HTMLInputElement,
    WorkspaceInputProps
>(function WorkspaceInput(
    {
        label,
        error,
        hint,
        className,
        id,
        ...props
    },
    ref
) {
    const inputId =
        id ??
        (label
            ? label.toLowerCase().replace(/\s+/g, "-")
            : undefined);

    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-medium text-[var(--workspace-text)]"
                >
                    {label}
                </label>
            )}

            <input
                ref={ref}
                id={inputId}
                className={cn(
                    "h-9 w-full rounded-lg border bg-[var(--workspace-surface)] px-3 text-xs text-[var(--workspace-text)] outline-none transition-all",
                    "placeholder:text-[var(--workspace-text-subtle)]",
                    "focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10",
                    "disabled:cursor-not-allowed disabled:bg-[var(--workspace-background)] disabled:opacity-60",
                    error
                        ? "border-[var(--workspace-danger)] focus:border-[var(--workspace-danger)] focus:ring-[var(--workspace-danger)]/10"
                        : "border-[var(--workspace-border)]",
                    className
                )}
                {...props}
            />

            {error ? (
                <p className="text-[10px] text-[var(--workspace-danger)]">
                    {error}
                </p>
            ) : hint ? (
                <p className="text-[10px] text-[var(--workspace-text-muted)]">
                    {hint}
                </p>
            ) : null}
        </div>
    );
});

WorkspaceInput.displayName = "WorkspaceInput";

export default WorkspaceInput;