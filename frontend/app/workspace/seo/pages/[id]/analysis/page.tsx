import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";

import { analyzeSEOPageById, getSEOPageById } from "@/lib/services/seo/pages";

import SEOAnalysisScoreHeader from "@/components/workspace/seo/analysis/SEOAnalysisScoreHeader";
import SEORecommendationGroup from "@/components/workspace/seo/analysis/SEORecommendationGroup";

interface SEOPageAnalysisPageProps {
    params: Promise<{ id: string }>;
}

export default async function SEOPageAnalysisPage({
    params,
}: SEOPageAnalysisPageProps) {
    // NOTE: same auth-guard assumption as the other SEO routes — remove if
    // /workspace/* is already gated by a layout or middleware.
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const { id } = await params;

    const page = await getSEOPageById(id);

    if (!page) {
        notFound();
    }

    const analysis = await analyzeSEOPageById(id);

    // analyzeSEOPageById re-fetches internally — null only if the page was
    // deleted between the two calls above. Treat that edge case as 404 too.
    if (!analysis) {
        notFound();
    }

    const critical = analysis.recommendations.filter(
        (recommendation) => recommendation.severity === "CRITICAL"
    );

    const warning = analysis.recommendations.filter(
        (recommendation) => recommendation.severity === "WARNING"
    );

    const success = analysis.recommendations.filter(
        (recommendation) => recommendation.severity === "SUCCESS"
    );

    const editHref = `/workspace/seo/pages/${page.id}/edit`;

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="SEO Analysis"
                description={`Full analysis for ${page.path}`}
                breadcrumbs={[
                    { label: "SEO", href: "/workspace/seo" },
                    { label: "Pages", href: "/workspace/seo/pages" },
                    { label: page.path, href: editHref },
                    { label: "Analysis" },
                ]}
            />

            <SEOAnalysisScoreHeader
                pageId={page.id}
                score={analysis.score}
                criticalCount={critical.length}
                warningCount={warning.length}
                successCount={success.length}
            />

            <div className="rounded-xl border border-[var(--workspace-info)]/30 bg-[var(--workspace-info)]/5 p-4 text-xs leading-5 text-[var(--workspace-text)]">
                Content, image, and link checks reflect this page&apos;s
                rendered content, which isn&apos;t tracked by this SEO
                configuration — those checks may always show as needing
                attention here. Title, description, canonical, robots, and
                Open Graph checks are fully editable below.
            </div>

            <div className="space-y-4">
                <SEORecommendationGroup
                    severity="CRITICAL"
                    title="Critical issues"
                    description="Fix these first — they have the biggest impact on search visibility."
                    recommendations={critical}
                    editHref={editHref}
                />

                <SEORecommendationGroup
                    severity="WARNING"
                    title="Warnings"
                    description="Worth addressing to improve this page's SEO health."
                    recommendations={warning}
                    editHref={editHref}
                />

                <SEORecommendationGroup
                    severity="SUCCESS"
                    title="Passing checks"
                    description="These are already in good shape."
                    recommendations={success}
                    editHref={editHref}
                />
            </div>
        </div>
    );
}
