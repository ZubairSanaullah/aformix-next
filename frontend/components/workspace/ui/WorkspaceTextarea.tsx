import {
    forwardRef,
    type TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface WorkspaceTextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const WorkspaceTextarea = forwardRef<
    HTMLTextAreaElement,
    WorkspaceTextareaProps
>(function WorkspaceTextarea(
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
    const textareaId =
        id ??
        (label
            ? label.toLowerCase().replace(/\s+/g, "-")
            : undefined);

    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-xs font-medium text-[var(--workspace-text)]"
                >
                    {label}
                </label>
            )}

            <textarea
                ref={ref}
                id={textareaId}
                className={cn(
                    "min-h-24 w-full resize-y rounded-lg border bg-[var(--workspace-surface)] px-3 py-2.5 text-xs leading-5 text-[var(--workspace-text)] outline-none transition-all",
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

WorkspaceTextarea.displayName = "WorkspaceTextarea";

export default WorkspaceTextarea;