"use client";

import { useMemo } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Search,
    XCircle,
} from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

interface SeoAnalyzerPanelProps {
    title: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    content: string;
    slug?: string;
}

type Status =
    | "good"
    | "warning"
    | "bad";

function getStatusIcon(status: Status) {
    if (status === "good") {
        return (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        );
    }

    if (status === "warning") {
        return (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        );
    }

    return (
        <XCircle className="h-3.5 w-3.5 text-red-500" />
    );
}

export default function SeoAnalyzerPanel({
    title,
    seoTitle,
    seoDescription,
    content,
    slug,
}: SeoAnalyzerPanelProps) {
    const analysis = useMemo(() => {
        const words = content
            .replace(/<[^>]+>/g, "")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;

        const headingCount =
            (
                content.match(
                    /<h[1-6][^>]*>/gi
                ) || []
            ).length;

        const keyword = title
            .split(" ")
            .filter(Boolean)[0]
            ?.toLowerCase();

        const keywordUsed =
            keyword &&
            content
                .toLowerCase()
                .includes(keyword);

        const checks: {
            label: string;
            status: Status;
            message: string;
        }[] = [
                {
                    label: "SEO title",
                    status:
                        seoTitle &&
                            seoTitle.length >= 30 &&
                            seoTitle.length <= 60
                            ? "good"
                            : "warning",
                    message: seoTitle
                        ? `${seoTitle.length}/60 characters`
                        : "Missing SEO title",
                },
                {
                    label: "Meta description",
                    status:
                        seoDescription &&
                            seoDescription.length >=
                            120 &&
                            seoDescription.length <= 160
                            ? "good"
                            : "warning",
                    message: seoDescription
                        ? `${seoDescription.length}/160 characters`
                        : "Missing description",
                },
                {
                    label: "Content length",
                    status:
                        words >= 600
                            ? "good"
                            : words >= 300
                                ? "warning"
                                : "bad",
                    message: `${words} words`,
                },
                {
                    label: "Headings",
                    status:
                        headingCount > 0
                            ? "good"
                            : "warning",
                    message:
                        headingCount > 0
                            ? `${headingCount} headings found`
                            : "Add headings",
                },
                {
                    label: "Keyword usage",
                    status: keywordUsed
                        ? "good"
                        : "warning",
                    message: keywordUsed
                        ? "Primary keyword found"
                        : "Keyword missing",
                },
                {
                    label: "Slug",
                    status:
                        slug &&
                            !slug.includes(" ")
                            ? "good"
                            : "warning",
                    message:
                        slug || "No slug",
                },
            ];

        const score = Math.round(
            (checks.filter(
                (item) =>
                    item.status === "good"
            ).length /
                checks.length) *
            100
        );

        return {
            checks,
            score,
        };
    }, [
        title,
        seoTitle,
        seoDescription,
        content,
        slug,
    ]);

    return (
        <WorkspaceCard
            padding="md"
            className="space-y-5"
        >
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                    <Search className="h-3.5 w-3.5" />
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        SEO Analysis
                    </h2>

                    <p className="text-[10px] text-[var(--workspace-text-muted)]">
                        Content optimization
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface-soft)] p-4">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--workspace-text-subtle)]">
                            SEO Score
                        </p>

                        <p className="mt-1 text-3xl font-semibold tracking-tight text-[var(--workspace-text)]">
                            {analysis.score}
                            <span className="text-sm font-medium text-[var(--workspace-text-subtle)]">
                                /100
                            </span>
                        </p>
                    </div>

                    <div className="text-right text-[10px] text-[var(--workspace-text-muted)]">
                        {analysis.score >=
                            80
                            ? "Good"
                            : analysis.score >=
                                50
                                ? "Needs work"
                                : "Poor"}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {analysis.checks.map(
                    (check) => (
                        <div
                            key={
                                check.label
                            }
                            className="flex items-center justify-between gap-3 rounded-lg border border-[var(--workspace-border)] px-3 py-2.5"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-[11px] font-medium text-[var(--workspace-text)]">
                                    {
                                        check.label
                                    }
                                </p>

                                <p className="mt-0.5 truncate text-[10px] text-[var(--workspace-text-subtle)]">
                                    {
                                        check.message
                                    }
                                </p>
                            </div>

                            {getStatusIcon(
                                check.status
                            )}
                        </div>
                    )
                )}
            </div>
        </WorkspaceCard>
    );
}