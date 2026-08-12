import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, FileText, Gauge, Plus, Settings, ShieldAlert } from "lucide-react";

import { auth } from "@/auth";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspacePageActions from "@/components/workspace/ui/WorkspacePageActions";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import { getSEOPages } from "@/lib/services/seo/pages";
import { getSEOSettings } from "@/lib/services/seo/settings";

import { buildSEODashboardMetrics } from "@/components/workspace/seo/dashboard/metrics";
import SEOOverallScoreCard from "@/components/workspace/seo/dashboard/SEOOverallScoreCard";
import SEOStatCard from "@/components/workspace/seo/dashboard/SEOStatCard";
import SEOPagesNeedingAttention from "@/components/workspace/seo/dashboard/SEOPagesNeedingAttention";
import SEORecommendationSummary from "@/components/workspace/seo/dashboard/SEORecommendationSummary";
import SEOEmptyState from "@/components/workspace/seo/dashboard/SEOEmptyState";

export default async function SEODashboardPage() {
    // NOTE: assumes /workspace routes are not already gated by a layout or
    // middleware. Remove this check if session handling is already applied
    // upstream — kept here only to match the auth pattern used by the SEO
    // API routes.
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const [pages, settings] = await Promise.all([
        getSEOPages(),
        getSEOSettings(),
    ]);

    const metrics = buildSEODashboardMetrics(pages);

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="SEO Dashboard"
                description="Overall search-readiness across your site's pages."
                actions={
                    <WorkspacePageActions>
                        <Link href="/workspace/seo/settings">
                            <WorkspaceButton variant="secondary" size="sm">
                                <Settings className="h-3.5 w-3.5" />
                                SEO Settings
                            </WorkspaceButton>
                        </Link>

                        <Link href="/workspace/seo/pages/create">
                            <WorkspaceButton size="sm">
                                <Plus className="h-3.5 w-3.5" />
                                New SEO Page
                            </WorkspaceButton>
                        </Link>
                    </WorkspacePageActions>
                }
            />

            {pages.length === 0 ? (
                <SEOEmptyState />
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <SEOOverallScoreCard score={metrics.overallScore} />

                        <SEOStatCard
                            label="Total pages"
                            value={metrics.totalPages}
                            icon={<FileText className="h-4 w-4" />}
                            sublabel={`${metrics.indexablePages} indexable`}
                            accentVar="--workspace-info"
                        />

                        <SEOStatCard
                            label="Needs attention"
                            value={metrics.pagesNeedingAttention.length}
                            icon={<AlertCircle className="h-4 w-4" />}
                            sublabel="Pages below target score"
                            accentVar="--workspace-warning"
                        />

                        <SEOStatCard
                            label="Critical issues"
                            value={metrics.criticalIssueCount}
                            icon={<ShieldAlert className="h-4 w-4" />}
                            sublabel="Across all pages"
                            accentVar="--workspace-danger"
                        />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <SEOPagesNeedingAttention
                                pages={metrics.pagesNeedingAttention}
                            />
                        </div>

                        <SEORecommendationSummary
                            critical={metrics.criticalIssueCount}
                            warning={metrics.warningIssueCount}
                            success={metrics.successCheckCount}
                        />
                    </div>

                    {!settings && (
                        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-[var(--workspace-warning)]/30 bg-[var(--workspace-warning)]/5 p-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <Gauge className="h-4 w-4 shrink-0 text-[var(--workspace-warning)]" />
                                <p className="text-xs text-[var(--workspace-text)]">
                                    Site-wide SEO settings haven&apos;t been
                                    configured yet.
                                </p>
                            </div>

                            <Link href="/workspace/seo/settings">
                                <WorkspaceButton variant="secondary" size="sm">
                                    Configure
                                </WorkspaceButton>
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
