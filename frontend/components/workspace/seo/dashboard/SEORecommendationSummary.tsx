import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

interface SEORecommendationSummaryProps {
    critical: number;
    warning: number;
    success: number;
}

export default function SEORecommendationSummary({
    critical,
    warning,
    success,
}: SEORecommendationSummaryProps) {
    const total = critical + warning + success;

    const segments = [
        {
            key: "critical",
            count: critical,
            colorVar: "--workspace-danger",
            label: "Critical",
            icon: AlertCircle,
        },
        {
            key: "warning",
            count: warning,
            colorVar: "--workspace-warning",
            label: "Warning",
            icon: AlertTriangle,
        },
        {
            key: "success",
            count: success,
            colorVar: "--workspace-success",
            label: "Good",
            icon: CheckCircle2,
        },
    ];

    return (
        <WorkspaceCard padding="lg" className="space-y-4">
            <div>
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Recommendation breakdown
                </h2>
                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    Across all analyzed pages.
                </p>
            </div>

            {total === 0 ? (
                <p className="text-xs text-[var(--workspace-text-muted)]">
                    No recommendations available yet.
                </p>
            ) : (
                <>
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--workspace-background)]">
                        {segments.map((segment) =>
                            segment.count > 0 ? (
                                <div
                                    key={segment.key}
                                    style={{
                                        width: `${(segment.count / total) * 100}%`,
                                        backgroundColor: `var(${segment.colorVar})`,
                                    }}
                                />
                            ) : null
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {segments.map((segment) => (
                            <div key={segment.key} className="flex items-center gap-2">
                                <segment.icon
                                    className="h-3.5 w-3.5 shrink-0"
                                    style={{ color: `var(${segment.colorVar})` }}
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[var(--workspace-text)]">
                                        {segment.count}
                                    </p>
                                    <p className="text-[10px] text-[var(--workspace-text-subtle)]">
                                        {segment.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </WorkspaceCard>
    );
}
