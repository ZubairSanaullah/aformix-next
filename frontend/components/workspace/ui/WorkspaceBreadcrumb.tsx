import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface WorkspaceBreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function WorkspaceBreadcrumb({
    items,
}: WorkspaceBreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-[11px]">
                <li>
                    <Link
                        href="/workspace"
                        className="text-[var(--workspace-text-subtle)] transition-colors hover:text-[var(--workspace-primary)]"
                        aria-label="Workspace"
                    >
                        <Home className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                        <ChevronRight
                            className="h-3 w-3 text-[var(--workspace-text-subtle)]"
                            strokeWidth={1.8}
                        />

                        {item.href && index !== items.length - 1 ? (
                            <Link
                                href={item.href}
                                className="text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[var(--workspace-text-subtle)]">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}