import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
}

export default function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-8 py-16 text-center",
                className
            )}
        >
            {icon && (
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    {icon}
                </div>
            )}

            <h3 className="text-xl font-semibold text-foreground">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {description}
            </p>

            {action && (
                <div className="mt-8">
                    {action}
                </div>
            )}
        </div>
    );
}