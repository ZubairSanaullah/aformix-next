import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import type { PublicArticleListItem } from "./types";

function formatDate(date: string | Date | null) {
    if (!date) return null;

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export function KBArticleCard({
    article,
}: {
    article: PublicArticleListItem;
}) {
    const href = article.category
        ? `/kb/${article.category.slug}/${article.slug}`
        : `/kb/uncategorized/${article.slug}`;

    const publishedLabel = formatDate(article.publishedAt);

    return (
        <Link
            href={href}
            className="card-premium group flex flex-col !rounded-2xl !p-6"
        >
            <div className="flex items-center justify-between gap-2">
                {article.category && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                        {article.category.name}
                    </span>
                )}

                {article.featured && (
                    <Star
                        className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400"
                        aria-label="Featured"
                    />
                )}
            </div>

            <h3 className="mt-2 text-base font-bold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
                {article.title}
            </h3>

            {article.excerpt && (
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--color-text-muted)]">
                    {article.excerpt}
                </p>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                {publishedLabel && <span>{publishedLabel}</span>}

                <span className="ml-auto inline-flex items-center gap-1 font-semibold text-[var(--color-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5" />
                </span>
            </div>
        </Link>
    );
}

export default function KBArticleList({
    articles,
    emptyMessage = "No articles found.",
}: {
    articles: PublicArticleListItem[];
    emptyMessage?: string;
}) {
    if (!articles.length) {
        return (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
                <KBArticleCard key={article.id} article={article} />
            ))}
        </div>
    );
}
