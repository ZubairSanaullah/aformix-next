import type { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function GlassCard({
    children,
    className = "",
    hover = true,
}: GlassCardProps) {
    return (
        <div
            className={`
        rounded-[2rem]
        border border-[var(--color-glass-border)]
        bg-[var(--color-surface)]/70
        backdrop-blur-xl
        ${hover
                    ? "transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                    : ""
                }
        ${className}
      `}
        >
            {children}
        </div>
    );
}