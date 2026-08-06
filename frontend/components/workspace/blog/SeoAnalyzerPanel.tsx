"use client";

import { useMemo } from "react";
import {
    Search,
    CheckCircle2,
    AlertTriangle,
    XCircle,
} from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";

interface SeoAnalyzerPanelProps {
    title: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    content: string;
    slug?: string;
}


function getStatusIcon(
    status: "good" | "warning" | "bad"
) {
    switch (status) {
        case "good":
            return (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            );

        case "warning":
            return (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
            );

        default:
            return (
                <XCircle className="h-4 w-4 text-red-500" />
            );
    }
}


export default function SeoAnalyzerPanel({
    title,
    seoTitle,
    seoDescription,
    content,
    slug,
}: SeoAnalyzerPanelProps) {


    const analysis = useMemo(() => {

        const words =
            content
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


        const keyword =
            title
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
            status: "good" | "warning" | "bad";
            message: string;
        }[] = [
            {
                label: "SEO Title length",
                status:
                    seoTitle &&
                        seoTitle.length >= 30 &&
                        seoTitle.length <= 60
                        ? "good"
                        : "warning",
                message:
                    seoTitle
                        ? `${seoTitle.length}/60 characters`
                        : "Missing SEO title",
            },


            {
                label: "Meta description",
                status:
                    seoDescription &&
                        seoDescription.length >= 120 &&
                        seoDescription.length <= 160
                        ? "good"
                        : "warning",
                message:
                    seoDescription
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
                message:
                    `${words} words`,
            },


            {
                label: "Headings",
                status:
                    headingCount > 0
                        ? "good"
                        : "warning",
                message:
                    headingCount
                        ? `${headingCount} headings found`
                        : "Add headings",
            },


            {
                label: "Keyword usage",
                status:
                    keywordUsed
                        ? "good"
                        : "warning",
                message:
                    keywordUsed
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


        const score =
            Math.round(
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
        <GlassCard className="space-y-5 p-6">

            <div className="flex items-center gap-2">

                <Search className="h-5 w-5" />

                <h2 className="font-semibold">
                    SEO Analysis
                </h2>

            </div>


            <div className="rounded-xl border p-4">

                <p className="text-sm text-muted-foreground">
                    SEO Score
                </p>


                <p className="mt-1 text-3xl font-bold">
                    {analysis.score}/100
                </p>

            </div>


            <div className="space-y-3">

                {analysis.checks.map(
                    (check) => (
                        <div
                            key={check.label}
                            className="
                                flex
                                items-start
                                justify-between
                                gap-3
                                rounded-xl
                                border
                                p-3
                            "
                        >

                            <div>

                                <p className="text-sm font-medium">
                                    {check.label}
                                </p>


                                <p className="text-xs text-muted-foreground">
                                    {check.message}
                                </p>

                            </div>


                            {getStatusIcon(
                                check.status
                            )}

                        </div>
                    )
                )}

            </div>

        </GlassCard>
    );
}