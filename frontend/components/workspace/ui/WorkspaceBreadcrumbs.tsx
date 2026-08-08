import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface WorkspaceBreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function WorkspaceBreadcrumbs({
    items,
}: WorkspaceBreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <li className="shrink-0">
                    <Link
                        href="/workspace"
                        aria-label="Workspace home"
                        className="text-[var(--workspace-text-subtle)] transition-colors hover:text-[var(--workspace-primary)]"
                    >
                        <Home className="h-3.5 w-3.5" />
                    </Link>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li
                            key={`${item.label}-${index}`}
                            className="flex shrink-0 items-center gap-1.5"
                        >
                            <ChevronRight className="h-3 w-3 text-[var(--workspace-text-subtle)]" />

                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className={
                                        isLast
                                            ? "font-medium text-[var(--workspace-text)]"
                                            : "text-[var(--workspace-text-muted)]"
                                    }
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}