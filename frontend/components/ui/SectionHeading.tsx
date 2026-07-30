import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export default function SectionHeading({
  title,
  description,
  badge,
  className = "",
  align = "left",
}: SectionHeadingProps) {
  const alignmentClass =
    align === "center"
      ? "text-center mx-auto"
      : align === "right"
      ? "text-right ml-auto"
      : "text-left";

  return (
    <div className={`space-y-2 ${alignmentClass} ${className}`}>
      {badge && (
        <div className="inline-flex items-center rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
          {badge}
        </div>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
