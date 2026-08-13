"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import SEOScoreRing from "@/components/workspace/seo/shared/SEOScoreRing";
import SEOSeverityBadge from "@/components/workspace/seo/shared/SEOSeverityBadge";
import { isEditableRecommendation } from "@/components/workspace/seo/shared/seo-recommendation-scope";

import type {
    SEOAnalysisResult,
    SEORecommendationSeverity,
} from "@/lib/validations/seo";

interface SEOLiveAnalysisPanelProps {
    title: string;
    description: string;
    canonicalUrl: string;
    noIndex: boolean;
    noFollow: boolean;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    /** When editing a saved page, links to its full analysis screen. */
    pageId?: string;
}

const SEVERITY_ORDER: SEORecommendationSeverity[] = [
    "CRITICAL",
    "WARNING",
    "SUCCESS",
];

export default function SEOLiveAnalysisPanel({
    title,
    description,
    canonicalUrl,
    noIndex,
    noFollow,
    ogTitle,
    ogDescription,
    ogImage,
    pageId,
}: SEOLiveAnalysisPanelProps) {
    const [result, setResult] = useState<SEOAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            const requestId = ++requestIdRef.current;

            setIsLoading(true);
            setError(null);

            fetch("/api/seo/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    content: "",
                    canonicalUrl: canonicalUrl || null,
                    noIndex,
                    noFollow,
                    ogTitle: ogTitle || null,
                    ogDescription: ogDescription || null,
                    ogImage: ogImage || null,
                }),
            })
                .then(async (response) => {
                    const data = await response.json().catch(() => null);

                    if (requestId !== requestIdRef.current) return;

                    if (!response.ok) {
                        setError(data?.error ?? "Unable to analyze this page.");
                        setResult(null);
                        return;
                    }

                    setResult(data.data);
                })
                .catch(() => {
                    if (requestId !== requestIdRef.current) return;
                    setError("Unable to analyze this page.");
                    setResult(null);
                })
                .finally(() => {
                    if (requestId !== requestIdRef.current) return;
                    setIsLoading(false);
                });
        }, 450);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [
        title,
        description,
        canonicalUrl,
        noIndex,
        noFollow,
        ogTitle,
        ogDescription,
        ogImage,
    ]);

    const visibleRecommendations = result
        ? result.recommendations
              .filter((recommendation) => isEditableRecommendation(recommendation.key))
              .sort(
                  (a, b) =>
                      SEVERITY_ORDER.indexOf(a.severity) -
                      SEVERITY_ORDER.indexOf(b.severity)
              )
        : [];

    const hiddenCount = result
        ? result.recommendations.length - visibleRecommendations.length
        : 0;

    return (
        <WorkspaceCard padding="lg" className="h-fit space-y-4 lg:sticky lg:top-6">
            <div>
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Live SEO Analysis
                </h2>
                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    Updates automatically as you edit the fields below.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <SEOScoreRing score={result?.score ?? 0} size={64} strokeWidth={6} />
                <p className="text-xs text-[var(--workspace-text-muted)]">
                    {isLoading
                        ? "Analyzing..."
                        : result
                            ? `${visibleRecommendations.length} relevant checks`
                            : "Start typing to see analysis"}
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-[var(--workspace-danger)]/30 bg-[var(--workspace-danger)]/5 p-3">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-danger)]" />
                    <p className="text-xs text-[var(--workspace-text)]">{error}</p>
                </div>
            )}

            {visibleRecommendations.length > 0 && (
                <ul className="workspace-scrollbar max-h-96 space-y-2 overflow-y-auto pr-1">
                    {visibleRecommendations.map((recommendation) => (
                        <li
                            key={recommendation.key}
                            className="rounded-lg border border-[var(--workspace-border)] p-2.5"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-medium text-[var(--workspace-text)]">
                                    {recommendation.title}
                                </p>
                                <SEOSeverityBadge severity={recommendation.severity} />
                            </div>
                            <p className="mt-1 text-[11px] leading-4 text-[var(--workspace-text-muted)]">
                                {recommendation.message}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            {hiddenCount > 0 && (
                <p className="text-[11px] leading-4 text-[var(--workspace-text-subtle)]">
                    {hiddenCount} additional check{hiddenCount === 1 ? "" : "s"}{" "}
                    (content, images, links) apply once this page is live and
                    aren&apos;t shown here.
                </p>
            )}

            {pageId && (
                <Link
                    href={`/workspace/seo/pages/${pageId}/analysis`}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--workspace-primary)] hover:underline"
                >
                    View full analysis
                    <ArrowRight className="h-3 w-3" />
                </Link>
            )}
        </WorkspaceCard>
    );
}
