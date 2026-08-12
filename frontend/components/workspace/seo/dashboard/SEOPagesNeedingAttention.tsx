import Link from "next/link";
import { ArrowRight, FileWarning } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import SEOSeverityBadge from "@/components/workspace/seo/shared/SEOSeverityBadge";

import type { SEOPageWithScore } from "./metrics";

interface SEOPagesNeedingAttentionProps {
    pages: SEOPageWithScore[];
}

export default function SEOPagesNeedingAttention({
    pages,
}: SEOPagesNeedingAttentionProps) {
    return (
        <WorkspaceCard padding="lg" className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Pages needing attention
                    </h2>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Lowest-scoring pages, ranked by severity.
                    </p>
                </div>

                <Link href="/workspace/seo/pages">
                    <WorkspaceButton variant="ghost" size="sm">
                        View all
                        <ArrowRight className="h-3.5 w-3.5" />
                    </WorkspaceButton>
                </Link>
            </div>

            {pages.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-[var(--workspace-border)] py-8 text-center">
                    <FileWarning className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        No pages currently need attention. Nice work.
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-[var(--workspace-border)]">
                    {pages.map((page) => (
                        <li key={page.id} className="py-3 first:pt-0 last:pb-0">
                            <Link
                                href={`/workspace/seo/pages/${page.id}/edit`}
                                className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--workspace-background)]"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-medium text-[var(--workspace-text)]">
                                        {page.title || page.path}
                                    </p>
                                    <p className="truncate text-[11px] text-[var(--workspace-text-subtle)]">
                                        {page.path}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    {page.criticalCount > 0 && (
                                        <SEOSeverityBadge severity="CRITICAL" />
                                    )}

                                    <span className="text-xs font-semibold text-[var(--workspace-text)]">
                                        {page.score}
                                        <span className="text-[var(--workspace-text-subtle)]">
                                            /100
                                        </span>
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </WorkspaceCard>
    );
}
