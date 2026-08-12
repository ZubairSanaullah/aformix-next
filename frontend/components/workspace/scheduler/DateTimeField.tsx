import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface DateTimeFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    error?: string;
}

/**
 * Native datetime-local input, styled to match WorkspaceInput.
 * There's no dedicated date/time picker in the design system yet —
 * this keeps things dependency-free and accessible. Swap the
 * underlying <input> for a richer picker later without changing
 * the calling code, since the prop surface mirrors WorkspaceInput.
 */
const DateTimeField = forwardRef<HTMLInputElement, DateTimeFieldProps>(
    function DateTimeField(
        { label, error, className, id, ...props },
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
                    type="datetime-local"
                    className={cn(
                        "h-9 w-full rounded-lg border bg-[var(--workspace-surface)] px-3 text-xs text-[var(--workspace-text)] outline-none transition-all",
                        "focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10",
                        "disabled:cursor-not-allowed disabled:bg-[var(--workspace-background)] disabled:opacity-60",
                        error
                            ? "border-[var(--workspace-danger)] focus:border-[var(--workspace-danger)] focus:ring-[var(--workspace-danger)]/10"
                            : "border-[var(--workspace-border)]",
                        className
                    )}
                    {...props}
                />

                {error && (
                    <p className="text-[10px] text-[var(--workspace-danger)]">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

export default DateTimeField;
