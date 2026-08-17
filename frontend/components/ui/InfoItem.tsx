import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoItemProps {
    icon: ReactNode;
    label: string;
    value: ReactNode;
    className?: string;
    iconClassName?: string;
}

export default function InfoItem({
    icon,
    label,
    value,
    className,
    iconClassName,
}: InfoItemProps) {
    return (
        <div className={cn("flex items-center gap-2.5 sm:gap-3 min-w-0", className)}>
            <div
                className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] sm:h-10 sm:w-10",
                    iconClassName
                )}
            >
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[var(--color-text-muted)] truncate">
                    {label}
                </p>

                <p className="mt-0.5 text-xs sm:text-sm md:text-base font-semibold text-[var(--color-text)] truncate">
                    {value}
                </p>
            </div>
        </div>
    );
}