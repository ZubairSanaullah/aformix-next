import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { resolveCategoryIcon } from "@/lib/kb/icons";
import type { PublicCategory } from "./types";

interface KBCategoryGridProps {
    categories: PublicCategory[];
}

export default function KBCategoryGrid({ categories }: KBCategoryGridProps) {
    if (!categories.length) {
        return null;
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
                const Icon = resolveCategoryIcon(category.icon);

                return (
                    <Link
                        key={category.id}
                        href={`/kb/${category.slug}`}
                        className="card-premium group !rounded-2xl !p-6"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                            <Icon className="h-5 w-5" />
                        </span>

                        <h3 className="mt-4 text-base font-bold text-[var(--color-text)]">
                            {category.name}
                        </h3>

                        {category.description && (
                            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
                                {category.description}
                            </p>
                        )}

                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                            Browse articles
                            <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
