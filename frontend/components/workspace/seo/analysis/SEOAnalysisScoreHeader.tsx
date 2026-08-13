import Link from "next/link";
import { Pencil } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import SEOScoreRing from "@/components/workspace/seo/shared/SEOScoreRing";

interface SEOAnalysisScoreHeaderProps {
    pageId: string;
    score: number;
    criticalCount: number;
    warningCount: number;
    successCount: number;
}

function getScoreSummary(score: number): string {
    if (score >= 80) return "This page is in good shape.";
    if (score >= 50) return "This page could use some improvements.";
    return "This page needs attention.";
}

export default function SEOAnalysisScoreHeader({
    pageId,
    score,
    criticalCount,
    warningCount,
    successCount,
}: SEOAnalysisScoreHeaderProps) {
    const totalChecks = criticalCount + warningCount + successCount;

    return (
        <WorkspaceCard
            padding="lg"
            className="flex flex-col items-center gap-6 py-8 text-center sm:flex-row sm:text-left"
        >
            <SEOScoreRing score={score} size={120} strokeWidth={10} />

            <div className="flex-1 space-y-3">
                <div>
                    <p className="text-sm font-semibold text-[var(--workspace-text)]">
                        {getScoreSummary(score)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Based on {totalChecks} check{totalChecks === 1 ? "" : "s"}{" "}
                        across title, description, content, canonical, robots,
                        images, links, and Open Graph configuration.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--workspace-danger)]/10 px-2.5 py-1 text-xs font-medium text-[var(--workspace-danger)]">
                        {criticalCount} critical
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--workspace-warning)]/10 px-2.5 py-1 text-xs font-medium text-[var(--workspace-warning)]">
                        {warningCount} warning{warningCount === 1 ? "" : "s"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--workspace-success)]/10 px-2.5 py-1 text-xs font-medium text-[var(--workspace-success)]">
                        {successCount} passed
                    </span>
                </div>
            </div>

            <Link href={`/workspace/seo/pages/${pageId}/edit`}>
                <WorkspaceButton variant="secondary" size="sm">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Page
                </WorkspaceButton>
            </Link>
        </WorkspaceCard>
    );
}
