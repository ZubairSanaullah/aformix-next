import { scoreSEOPage, type SEOScorablePage } from "@/components/workspace/seo/shared/seo-scoring";

export interface SEODashboardPageInput extends SEOScorablePage {
    id: string;
    path: string;
}

export interface SEOPageWithScore {
    id: string;
    path: string;
    title: string | null;
    score: number;
    criticalCount: number;
    warningCount: number;
}

export interface SEODashboardMetrics {
    totalPages: number;
    indexablePages: number;
    overallScore: number;
    criticalIssueCount: number;
    warningIssueCount: number;
    successCheckCount: number;
    pagesNeedingAttention: SEOPageWithScore[];
}

const ATTENTION_LIMIT = 5;
const ATTENTION_SCORE_THRESHOLD = 70;

const EMPTY_METRICS: SEODashboardMetrics = {
    totalPages: 0,
    indexablePages: 0,
    overallScore: 0,
    criticalIssueCount: 0,
    warningIssueCount: 0,
    successCheckCount: 0,
    pagesNeedingAttention: [],
};

/**
 * Aggregate a list of SEO pages into dashboard-level metrics.
 *
 * Scoring for each page is delegated to `scoreSEOPage` (shared with the
 * SEO Pages list) — only aggregation/sorting for presentation happens here.
 */
export function buildSEODashboardMetrics(
    pages: SEODashboardPageInput[]
): SEODashboardMetrics {
    if (pages.length === 0) {
        return EMPTY_METRICS;
    }

    let scoreSum = 0;
    let criticalIssueCount = 0;
    let warningIssueCount = 0;
    let successCheckCount = 0;
    let indexablePages = 0;

    const scoredPages: SEOPageWithScore[] = pages.map((page) => {
        const { score, criticalCount, warningCount, successCount } =
            scoreSEOPage(page);

        scoreSum += score;
        criticalIssueCount += criticalCount;
        warningIssueCount += warningCount;
        successCheckCount += successCount;

        if (!page.noIndex) {
            indexablePages += 1;
        }

        return {
            id: page.id,
            path: page.path,
            title: page.title,
            score,
            criticalCount,
            warningCount,
        };
    });

    const pagesNeedingAttention = [...scoredPages]
        .filter(
            (page) =>
                page.score < ATTENTION_SCORE_THRESHOLD ||
                page.criticalCount > 0
        )
        .sort((a, b) => {
            if (b.criticalCount !== a.criticalCount) {
                return b.criticalCount - a.criticalCount;
            }

            return a.score - b.score;
        })
        .slice(0, ATTENTION_LIMIT);

    return {
        totalPages: pages.length,
        indexablePages,
        overallScore: Math.round(scoreSum / pages.length),
        criticalIssueCount,
        warningIssueCount,
        successCheckCount,
        pagesNeedingAttention,
    };
}
