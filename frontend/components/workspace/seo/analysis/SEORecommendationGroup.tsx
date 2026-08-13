import { cn } from "@/lib/utils";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import SEORecommendationCard from "./SEORecommendationCard";

import type {
    SEORecommendation,
    SEORecommendationSeverity,
} from "@/lib/validations/seo";

interface SEORecommendationGroupProps {
    severity: SEORecommendationSeverity;
    title: string;
    description: string;
    recommendations: SEORecommendation[];
    editHref?: string;
}

const GROUP_ACCENT_CLASS: Record<SEORecommendationSeverity, string> = {
    CRITICAL: "border-l-4 border-l-[var(--workspace-danger)]",
    WARNING: "border-l-4 border-l-[var(--workspace-warning)]",
    SUCCESS: "border-l-4 border-l-[var(--workspace-success)]",
};

export default function SEORecommendationGroup({
    severity,
    title,
    description,
    recommendations,
    editHref,
}: SEORecommendationGroupProps) {
    if (recommendations.length === 0) {
        return null;
    }

    return (
        <WorkspaceCard
            padding="lg"
            className={cn("space-y-3", GROUP_ACCENT_CLASS[severity])}
        >
            <div>
                <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                    {title} ({recommendations.length})
                </h3>
                <p className="mt-0.5 text-xs text-[var(--workspace-text-muted)]">
                    {description}
                </p>
            </div>

            <div className="space-y-2">
                {recommendations.map((recommendation) => (
                    <SEORecommendationCard
                        key={recommendation.key}
                        recommendation={recommendation}
                        editHref={editHref}
                    />
                ))}
            </div>
        </WorkspaceCard>
    );
}
