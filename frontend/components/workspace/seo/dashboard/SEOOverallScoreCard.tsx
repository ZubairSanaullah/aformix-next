import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

import SEOScoreRing from "./SEOScoreRing";

interface SEOOverallScoreCardProps {
    score: number;
}

function getScoreLabel(score: number): string {
    if (score >= 80) return "Healthy";
    if (score >= 50) return "Needs improvement";
    return "Critical";
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
