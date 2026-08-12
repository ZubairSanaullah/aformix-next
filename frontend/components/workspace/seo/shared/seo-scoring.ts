import { analyzeSEOPageData } from "@/lib/services/seo/pages";
import type { SEOAnalysisResult } from "@/lib/validations/seo";

/**
 * Shape this module needs from an SEOPage record.
 *
 * Intentionally omits `keywords` — the current Prisma model stores it as a
 * comma-joined string, while `SEOPageData.keywords` expects `string[]`.
 * The analyzer doesn't use keywords for scoring, so it's left out of the
 * analysis call entirely rather than coercing types across that mismatch.
 */
export interface SEOScorablePage {
    title: string | null;
    description: string | null;
    canonical: string | null;
    noIndex: boolean;
    noFollow: boolean;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
}

export interface SEOPageScore {
    score: number;
    criticalCount: number;
    warningCount: number;
    successCount: number;
    analysis: SEOAnalysisResult;
}

/**
 * Run the existing SEO analyzer against a page and summarize severity
 * counts. Server-only — pulls in `analyzeSEOPageData`, which shares a
 * module with the Prisma client, so this must not be imported from a
 * "use client" file.
 */
export function scoreSEOPage(page: SEOScorablePage): SEOPageScore {
    const analysis = analyzeSEOPageData({
        title: page.title,
        description: page.description,
        canonical: page.canonical,
        noIndex: page.noIndex,
        noFollow: page.noFollow,
        ogTitle: page.ogTitle,
        ogDescription: page.ogDescription,
        ogImage: page.ogImage,
    });

    const criticalCount = analysis.recommendations.filter(
        (recommendation) => recommendation.severity === "CRITICAL"
    ).length;

    const warningCount = analysis.recommendations.filter(
        (recommendation) => recommendation.severity === "WARNING"
    ).length;

    const successCount = analysis.recommendations.filter(
        (recommendation) => recommendation.severity === "SUCCESS"
    ).length;

    return {
        score: analysis.score,
        criticalCount,
        warningCount,
        successCount,
        analysis,
    };
}
