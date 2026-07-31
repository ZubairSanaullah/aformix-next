import Link from "next/link";

interface BreadcrumbsProps {
    items: Array<{
        label: string;
        href?: string;
        url?: string;
    }>;
}

export default function Breadcrumbs({
    items,
}: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="text-sm text-[var(--color-text-muted)]"
        >
            <ol className="flex flex-wrap items-center gap-2">
                {items.map((item, index) => (
                    <li
                        key={`${item.label}-${index}`}
                        className="flex items-center gap-2"
                    >
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="transition-colors hover:text-[var(--color-primary)]"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[var(--color-text)]">
                                {item.label}
                            </span>
                        )}

                        {index < items.length - 1 && (
                            <span aria-hidden="true">
                                /
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}