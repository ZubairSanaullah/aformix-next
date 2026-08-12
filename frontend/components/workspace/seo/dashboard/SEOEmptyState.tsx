import Link from "next/link";
import { Plus, Search } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

export default function SEOEmptyState() {
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
                    Create your first SEO page configuration to start tracking
                    metadata, Open Graph tags, and search-readiness across
                    your site.
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
