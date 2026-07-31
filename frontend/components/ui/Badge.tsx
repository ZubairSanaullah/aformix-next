import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "info"
    | "danger";
}

const variantClasses = {
    default:
        "border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] font-medium",

    primary:
        "border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold",

    success:
        "border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 font-semibold",

    warning:
        "border border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 font-semibold",

    info:
        "border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold",

    danger:
        "border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold",
};

export default function Badge({
    children,
    className,
    variant = "default",
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
                variantClasses[variant],
                className
            )}
        >
            {children}
        </span>
    );
}