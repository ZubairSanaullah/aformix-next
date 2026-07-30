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
        <div className={cn("flex items-center gap-3", className)}>
            <div
                className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
                    iconClassName
                )}
            >
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    {label}
                </p>

                <p className="mt-1 font-semibold text-[var(--color-text)]">
                    {value}
                </p>
            </div>
        </div>
    );
}