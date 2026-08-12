import Link from "next/link";
import { Plus, Search, SearchX } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

interface SEOPagesEmptyStateProps {
    variant: "no-pages" | "no-results";
    query?: string;
}

export default function SEOPagesEmptyState({
    variant,
    query,
}: SEOPagesEmptyStateProps) {
    if (variant === "no-results") {
        return (
            <WorkspaceCard
                padding="lg"
                className="flex flex-col items-center gap-2 py-12 text-center"
            >
                <SearchX className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                <p className="text-xs text-[var(--workspace-text-muted)]">
                    No SEO pages match {query ? `"${query}"` : "your search"}.
                </p>
            </WorkspaceCard>
        );
    }

    return (
        <WorkspaceCard
            padding="lg"
            className="flex flex-col items-center gap-4 py-16 text-center"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                <Search className="h-5 w-5" />
            </div>

            <div className="space-y-1">
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    No SEO pages yet
                </h2>
                <p className="max-w-sm text-xs text-[var(--workspace-text-muted)]">
                    Create your first SEO page configuration to start
                    managing metadata across your site.
                </p>
            </div>

            <Link href="/workspace/seo/pages/create">
                <WorkspaceButton size="sm">
                    <Plus className="h-3.5 w-3.5" />
                    Create SEO page
                </WorkspaceButton>
            </Link>
        </WorkspaceCard>
    );
}
