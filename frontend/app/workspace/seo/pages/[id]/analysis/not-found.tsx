import Link from "next/link";
import { FileX } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

export default function SEOPageAnalysisNotFound() {
    return (
        <WorkspaceCard
            padding="lg"
            className="flex flex-col items-center gap-4 py-16 text-center"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--workspace-background)] text-[var(--workspace-text-subtle)]">
                <FileX className="h-5 w-5" />
            </div>

            <div className="space-y-1">
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    SEO page not found
                </h2>
                <p className="max-w-sm text-xs text-[var(--workspace-text-muted)]">
                    This SEO page configuration doesn&apos;t exist or may
                    have already been deleted.
                </p>
            </div>

            <Link href="/workspace/seo/pages">
                <WorkspaceButton size="sm">Back to SEO Pages</WorkspaceButton>
            </Link>
        </WorkspaceCard>
    );
}
