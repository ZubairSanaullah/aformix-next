import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface KBBreadcrumbsProps {
    items: Array<{ label: string; href?: string }>;
}

export default function KBBreadcrumbs({ items }: KBBreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-text-muted)]"
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="transition-colors hover:text-[var(--color-primary)]"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={
                                    isLast
                                        ? "text-[var(--color-text)]"
                                        : undefined
                                }
                            >
                                {item.label}
                            </span>
                        )}

                        {!isLast && (
                            <ChevronRight className="h-3 w-3 shrink-0" />
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
