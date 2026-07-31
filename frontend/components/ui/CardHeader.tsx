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
        <div className={cn("flex items-center gap-3", className)}>
            {icon && (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    {icon}
                </div>
            )}

            <div>
                <h2 className="text-2xl font-semibold text-[var(--color-text)]">
                    {title}
                </h2>

                {description && (
                    <p className="mt-2 leading-7 text-[var(--color-text-muted)]">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}