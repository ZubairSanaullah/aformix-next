import { cn } from "@/lib/utils";

type WorkspaceBadgeVariant =
    | "default"
    | "neutral"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "primary";

interface WorkspaceBadgeProps {
    children: React.ReactNode;
    variant?: WorkspaceBadgeVariant;
    className?: string;
}

export default function WorkspaceBadge({
    children,
    variant = "default",
    className,
}: WorkspaceBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold leading-none",
                {
                    "bg-slate-100 text-slate-600":
                        variant === "default" || variant === "neutral",

                    "bg-green-50 text-green-700":
                        variant === "success",

                    "bg-amber-50 text-amber-700":
                        variant === "warning",

                    "bg-red-50 text-red-700":
                        variant === "danger",

                    "bg-sky-50 text-sky-700":
                        variant === "info",

                    "bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]":
                        variant === "primary",
                },
                className
            )}
        >
            <span
                className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    {
                        "bg-slate-400":
                            variant === "default" || variant === "neutral",

                        "bg-green-500":
                            variant === "success",

                        "bg-amber-500":
                            variant === "warning",

                        "bg-red-500":
                            variant === "danger",

                        "bg-sky-500":
                            variant === "info",

                        "bg-[var(--workspace-primary)]":
                            variant === "primary",
                    }
                )}
            />

            {children}
        </span>
    );
}