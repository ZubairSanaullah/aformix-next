import type { ReactNode } from "react";

interface SectionHeadingProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    className?: string;
}

export default function SectionHeading({
    title,
    description,
    icon,
    className = "",
}: SectionHeadingProps) {
    return (
        <div className={className}>
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        {icon}
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-semibold text-[var(--color-text)]">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-2 text-[var(--color-text-muted)] leading-7">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}