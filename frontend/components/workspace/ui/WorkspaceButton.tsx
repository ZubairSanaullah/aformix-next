import {
    forwardRef,
    type ButtonHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type WorkspaceButtonVariant =
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "outline";

type WorkspaceButtonSize =
    | "sm"
    | "md"
    | "lg"
    | "icon";

interface WorkspaceButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: WorkspaceButtonVariant;
    size?: WorkspaceButtonSize;
}

const WorkspaceButton = forwardRef<
    HTMLButtonElement,
    WorkspaceButtonProps
>(function WorkspaceButton(
    {
        className,
        variant = "primary",
        size = "md",
        type = "button",
        ...props
    },
    ref
) {
    return (
        <button
            ref={ref}
            type={type}
            className={cn(
                "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--workspace-primary)]/30",
                "disabled:pointer-events-none disabled:opacity-50",
                "active:scale-[0.98]",

                {
                    /* Primary */
                    "bg-[var(--workspace-primary)] text-white shadow-sm hover:bg-[var(--workspace-primary-hover)]":
                        variant === "primary",

                    /* Secondary */
                    "border border-[var(--workspace-border)] bg-[var(--workspace-surface)] text-[var(--workspace-text)] shadow-[var(--workspace-shadow-sm)] hover:bg-[var(--workspace-background)]":
                        variant === "secondary",

                    /* Outline */
                    "border border-[var(--workspace-border)] bg-transparent text-[var(--workspace-text-muted)] hover:border-[var(--workspace-primary)]/30 hover:bg-[var(--workspace-primary-softer)] hover:text-[var(--workspace-primary)]":
                        variant === "outline",

                    /* Ghost */
                    "bg-transparent text-[var(--workspace-text-muted)] hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]":
                        variant === "ghost",

                    /* Danger */
                    "bg-[var(--workspace-danger)] text-white shadow-sm hover:bg-red-700":
                        variant === "danger",

                    /* Small */
                    "h-8 px-3 text-[11px]":
                        size === "sm",

                    /* Medium */
                    "h-9 px-3.5 text-xs":
                        size === "md",

                    /* Large */
                    "h-10 px-4 text-sm":
                        size === "lg",

                    /* Icon */
                    "h-9 w-9 p-0":
                        size === "icon",
                },

                className
            )}
            {...props}
        />
    );
});

WorkspaceButton.displayName = "WorkspaceButton";

export default WorkspaceButton;