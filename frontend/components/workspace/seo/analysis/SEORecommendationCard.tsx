import Link from "next/link";
import { Pencil } from "lucide-react";

import SEOSeverityBadge from "@/components/workspace/seo/shared/SEOSeverityBadge";
import { isEditableRecommendation } from "@/components/workspace/seo/shared/seo-recommendation-scope";

import type { SEORecommendation } from "@/lib/validations/seo";

interface SEORecommendationCardProps {
    recommendation: SEORecommendation;
    editHref?: string;
}

export default function SEORecommendationCard({
    recommendation,
    editHref,
}: SEORecommendationCardProps) {
    const editable = isEditableRecommendation(recommendation.key);

    return (
        <div className="rounded-lg border border-[var(--workspace-border)] p-3.5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[var(--workspace-text)]">
                            {recommendation.title}
                        </p>
                        <SEOSeverityBadge severity={recommendation.severity} />
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-[var(--workspace-text-muted)]">
                        {recommendation.message}
                    </p>
                </div>

                {editable && editHref && (
                    <Link
                        href={editHref}
                        className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[var(--workspace-primary)] hover:underline"
                    >
                        <Pencil className="h-3 w-3" />
                        Edit
                    </Link>
                )}
            </div>
        </div>
    );
}
