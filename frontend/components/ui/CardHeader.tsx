import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardHeaderProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    className?: string;
}

export default function CardHeader({
    icon,
    title,
    description,
    className,
}: CardHeaderProps) {
    return (
        <div className={cn("flex items-center gap-3 sm:gap-4", className)}>
            {icon && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] sm:h-14 sm:w-14 sm:rounded-2xl">
                    {icon}
                </div>
            )}

            <div className="min-w-0">
                <h2 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-2 sm:text-sm sm:leading-7">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}