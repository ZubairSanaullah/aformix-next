import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

import SEOScoreRing from "@/components/workspace/seo/shared/SEOScoreRing";
import { getScoreLabel } from "@/components/workspace/seo/shared/seo-score-display";

interface SEOOverallScoreCardProps {
    score: number;
}

export default function SEOOverallScoreCard({
    score,
}: SEOOverallScoreCardProps) {
    return (
        <WorkspaceCard padding="lg" className="flex items-center gap-4">
            <SEOScoreRing score={score} size={72} strokeWidth={7} />

            <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                    Overall SEO health
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--workspace-text)]">
                    {getScoreLabel(score)}
                </p>
            </div>
        </WorkspaceCard>
    );
}
