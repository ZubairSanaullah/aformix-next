import {
    SEO_LIMITS,
    seoAnalysisSchema,
    type SEOAnalysisInput,
    type SEOAnalysisResult,
    type SEORecommendation,
} from "@/lib/validations/seo";

interface AnalysisMetrics {
    wordCount: number;
    headingCount: number;
    imageCount: number;
    imagesWithAlt: number;
    linkCount: number;
    internalLinkCount: number;
    externalLinkCount: number;
}

function normalizeText(value: string): string {
    return value
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function countWords(value: string): number {
    const normalized = normalizeText(value);

    if (!normalized) {
        return 0;
    }

    return normalized.split(/\s+/).filter(Boolean).length;
}

function extractMetrics(content: string): AnalysisMetrics {
    const plainText = normalizeText(content);

    const headings = content.match(/<h[1-6][^>]*>/gi) ?? [];

    const images = content.match(/<img\b[^>]*>/gi) ?? [];

    const imagesWithAlt = images.filter((image) => {
        const altMatch = image.match(/\balt\s*=\s*["']([^"']*)["']/i);

        return Boolean(altMatch?.[1]?.trim());
    });

    const links = content.match(/<a\b[^>]*href\s*=\s*["'][^"']+["'][^>]*>/gi) ?? [];

    let internalLinkCount = 0;
    let externalLinkCount = 0;

    for (const link of links) {
        const hrefMatch = link.match(
            /\bhref\s*=\s*["']([^"']+)["']/i
        );

        const href = hrefMatch?.[1]?.trim();

        if (!href) {
            continue;
        }

        if (
            href.startsWith("/") ||
            href.startsWith("#") ||
            href.startsWith("?")
        ) {
            internalLinkCount += 1;
            continue;
        }

        if (/^https?:\/\//i.test(href)) {
            externalLinkCount += 1;
        }
    }

    return {
        wordCount: countWords(plainText),
        headingCount: headings.length,
        imageCount: images.length,
        imagesWithAlt: imagesWithAlt.length,
        linkCount: links.length,
        internalLinkCount,
        externalLinkCount,
    };
}

function addRecommendation(
    recommendations: SEORecommendation[],
    recommendation: SEORecommendation
): void {
    recommendations.push(recommendation);
}

function analyzeTitle(
    title: string,
    recommendations: SEORecommendation[]
): number {
    const length = title.length;

    if (!title) {
        addRecommendation(recommendations, {
            key: "title-missing",
            severity: "CRITICAL",
            title: "Add an SEO title",
            message:
                "Add a clear, descriptive SEO title that accurately represents the page content.",
        });

        return 0;
    }

    if (length < SEO_LIMITS.title.min) {
        addRecommendation(recommendations, {
            key: "title-too-short",
            severity: "WARNING",
            title: "SEO title is too short",
            message: `Your SEO title is ${length} characters long. Aim for at least ${SEO_LIMITS.title.recommendedMin} characters when possible.`,
        });

        return 5;
    }

    if (length > SEO_LIMITS.title.max) {
        addRecommendation(recommendations, {
            key: "title-too-long",
            severity: "CRITICAL",
            title: "SEO title is too long",
            message: `Your SEO title exceeds the maximum of ${SEO_LIMITS.title.max} characters.`,
        });

        return 5;
    }

    if (
        length >= SEO_LIMITS.title.recommendedMin &&
        length <= SEO_LIMITS.title.recommendedMax
    ) {
        addRecommendation(recommendations, {
            key: "title-length-good",
            severity: "SUCCESS",
            title: "SEO title length is good",
            message: `Your SEO title is ${length} characters long and falls within the recommended range.`,
        });

        return 15;
    }

    addRecommendation(recommendations, {
        key: "title-length-acceptable",
        severity: "SUCCESS",
        title: "SEO title is valid",
        message:
            "Your SEO title is within the allowed length. Consider keeping it close to the recommended range for better search-result presentation.",
    });

    return 12;
}

function analyzeDescription(
    description: string,
    recommendations: SEORecommendation[]
): number {
    const length = description.length;

    if (!description) {
        addRecommendation(recommendations, {
            key: "description-missing",
            severity: "CRITICAL",
            title: "Add a meta description",
            message:
                "Add a concise description that summarizes the page and encourages users to click from search results.",
        });

        return 0;
    }

    if (length < SEO_LIMITS.description.min) {
        addRecommendation(recommendations, {
            key: "description-too-short",
            severity: "WARNING",
            title: "Meta description is too short",
            message: `Your meta description is ${length} characters long. Aim for at least ${SEO_LIMITS.description.recommendedMin} characters when possible.`,
        });

        return 5;
    }

    if (length > SEO_LIMITS.description.max) {
        addRecommendation(recommendations, {
            key: "description-too-long",
            severity: "CRITICAL",
            title: "Meta description is too long",
            message: `Your meta description exceeds the maximum of ${SEO_LIMITS.description.max} characters.`,
        });

        return 5;
    }

    if (
        length >= SEO_LIMITS.description.recommendedMin &&
        length <= SEO_LIMITS.description.recommendedMax
    ) {
        addRecommendation(recommendations, {
            key: "description-length-good",
            severity: "SUCCESS",
            title: "Meta description length is good",
            message: `Your meta description is ${length} characters long and falls within the recommended range.`,
        });

        return 15;
    }

    addRecommendation(recommendations, {
        key: "description-length-acceptable",
        severity: "SUCCESS",
        title: "Meta description is valid",
        message:
            "Your meta description is within the allowed length. Consider keeping it close to the recommended range for better search-result presentation.",
    });

    return 12;
}

function analyzeContent(
    content: string,
    metrics: AnalysisMetrics,
    recommendations: SEORecommendation[]
): number {
    if (!content.trim()) {
        addRecommendation(recommendations, {
            key: "content-missing",
            severity: "CRITICAL",
            title: "Add page content",
            message:
                "The analyzer could not find any meaningful page content to evaluate.",
        });

        return 0;
    }

    let score = 0;

    if (metrics.wordCount >= 300) {
        score += 10;

        addRecommendation(recommendations, {
            key: "content-length-good",
            severity: "SUCCESS",
            title: "Content length is healthy",
            message: `The page contains approximately ${metrics.wordCount} words.`,
        });
    } else if (metrics.wordCount >= 150) {
        score += 6;

        addRecommendation(recommendations, {
            key: "content-length-moderate",
            severity: "WARNING",
            title: "Consider adding more content",
            message: `The page contains approximately ${metrics.wordCount} words. More useful, relevant content may improve topical depth.`,
        });
    } else {
        score += 2;

        addRecommendation(recommendations, {
            key: "content-too-short",
            severity: "WARNING",
            title: "Content is relatively short",
            message: `The page contains approximately ${metrics.wordCount} words. Consider expanding it with useful, relevant information where appropriate.`,
        });
    }

    if (metrics.headingCount === 0) {
        addRecommendation(recommendations, {
            key: "headings-missing",
            severity: "WARNING",
            title: "Add content headings",
            message:
                "Use descriptive headings to organize the page and make its structure easier to understand.",
        });
    } else {
        score += 5;

        addRecommendation(recommendations, {
            key: "headings-present",
            severity: "SUCCESS",
            title: "Content headings detected",
            message: `The analyzer detected ${metrics.headingCount} heading element${metrics.headingCount === 1 ? "" : "s"}.`,
        });
    }

    return score;
}

function analyzeCanonical(
    canonicalUrl: string | null | undefined,
    recommendations: SEORecommendation[]
): number {
    if (!canonicalUrl) {
        addRecommendation(recommendations, {
            key: "canonical-missing",
            severity: "WARNING",
            title: "Canonical URL is not configured",
            message:
                "Consider defining a canonical URL to help search engines understand the preferred version of the page.",
        });

        return 4;
    }

    addRecommendation(recommendations, {
        key: "canonical-present",
        severity: "SUCCESS",
        title: "Canonical URL is configured",
        message:
            "A canonical URL has been provided for this page.",
    });

    return 7;
}

function analyzeRobots(
    noIndex: boolean,
    noFollow: boolean,
    recommendations: SEORecommendation[]
): number {
    if (noIndex) {
        addRecommendation(recommendations, {
            key: "noindex-enabled",
            severity: "WARNING",
            title: "Page is set to noindex",
            message:
                "Search engines have been instructed not to index this page. Confirm this is intentional.",
        });
    } else {
        addRecommendation(recommendations, {
            key: "index-enabled",
            severity: "SUCCESS",
            title: "Page can be indexed",
            message:
                "The page is configured to allow search engine indexing.",
        });
    }

    if (noFollow) {
        addRecommendation(recommendations, {
            key: "nofollow-enabled",
            severity: "WARNING",
            title: "Page is set to nofollow",
            message:
                "Search engines have been instructed not to follow links on this page. Confirm this is intentional.",
        });
    } else {
        addRecommendation(recommendations, {
            key: "follow-enabled",
            severity: "SUCCESS",
            title: "Links can be followed",
            message:
                "The page is configured to allow search engines to follow its links.",
        });
    }

    return noIndex || noFollow ? 4 : 8;
}

function analyzeOpenGraph(
    ogTitle: string | null | undefined,
    ogDescription: string | null | undefined,
    ogImage: string | null | undefined,
    recommendations: SEORecommendation[]
): number {
    let score = 0;

    if (ogTitle) {
        score += 3;
    } else {
        addRecommendation(recommendations, {
            key: "og-title-missing",
            severity: "WARNING",
            title: "Open Graph title is missing",
            message:
                "Add an Open Graph title to improve how the page appears when shared on supported social platforms.",
        });
    }

    if (ogDescription) {
        score += 3;
    } else {
        addRecommendation(recommendations, {
            key: "og-description-missing",
            severity: "WARNING",
            title: "Open Graph description is missing",
            message:
                "Add an Open Graph description to provide better social sharing context.",
        });
    }

    if (ogImage) {
        score += 4;

        addRecommendation(recommendations, {
            key: "og-image-present",
            severity: "SUCCESS",
            title: "Open Graph image is configured",
            message:
                "An Open Graph image has been configured for social sharing.",
        });
    } else {
        addRecommendation(recommendations, {
            key: "og-image-missing",
            severity: "WARNING",
            title: "Open Graph image is missing",
            message:
                "Add an Open Graph image to improve the visual presentation of shared pages.",
        });
    }

    if (ogTitle && ogDescription) {
        addRecommendation(recommendations, {
            key: "og-metadata-good",
            severity: "SUCCESS",
            title: "Open Graph metadata is configured",
            message:
                "Open Graph title and description are available for social sharing.",
        });
    }

    return score;
}

function analyzeImages(
    metrics: AnalysisMetrics,
    recommendations: SEORecommendation[]
): number {
    if (metrics.imageCount === 0) {
        return 5;
    }

    if (metrics.imagesWithAlt === metrics.imageCount) {
        addRecommendation(recommendations, {
            key: "images-alt-good",
            severity: "SUCCESS",
            title: "Images have alternative text",
            message:
                "All detected images contain non-empty alt attributes.",
        });

        return 5;
    }

    const missingAltCount =
        metrics.imageCount - metrics.imagesWithAlt;

    addRecommendation(recommendations, {
        key: "images-alt-missing",
        severity: "WARNING",
        title: "Some images are missing alt text",
        message: `${missingAltCount} image${missingAltCount === 1 ? "" : "s"} ${missingAltCount === 1 ? "is" : "are"} missing meaningful alternative text.`,
    });

    return 2;
}

function analyzeLinks(
    metrics: AnalysisMetrics,
    recommendations: SEORecommendation[]
): number {
    if (metrics.linkCount === 0) {
        addRecommendation(recommendations, {
            key: "links-missing",
            severity: "WARNING",
            title: "No links detected",
            message:
                "Consider adding relevant internal links where they naturally help users navigate related content.",
        });

        return 1;
    }

    if (metrics.internalLinkCount > 0) {
        addRecommendation(recommendations, {
            key: "internal-links-present",
            severity: "SUCCESS",
            title: "Internal links detected",
            message: `The page contains ${metrics.internalLinkCount} internal link${metrics.internalLinkCount === 1 ? "" : "s"}.`,
        });

        return 3;
    }

    addRecommendation(recommendations, {
        key: "internal-links-missing",
        severity: "WARNING",
        title: "Consider adding internal links",
        message:
            "No internal links were detected. Add relevant internal links where they improve navigation and content relationships.",
    });

    return 1;
}

function calculateScore(
    recommendations: SEORecommendation[]
): number {
    const criticalCount = recommendations.filter(
        (recommendation) => recommendation.severity === "CRITICAL"
    ).length;

    const warningCount = recommendations.filter(
        (recommendation) => recommendation.severity === "WARNING"
    ).length;

    const successCount = recommendations.filter(
        (recommendation) => recommendation.severity === "SUCCESS"
    ).length;

    const totalChecks =
        criticalCount + warningCount + successCount;

    if (totalChecks === 0) {
        return 0;
    }

    const weightedScore =
        successCount * 1 +
        warningCount * 0.45 +
        criticalCount * 0;

    const rawScore =
        (weightedScore / totalChecks) * 100;

    return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * Analyze SEO data without accessing the database.
 *
 * This function is intentionally pure and reusable across:
 * - SEO pages
 * - Blog content
 * - Workspace SEO tools
 * - API endpoints
 * - Pre-save validation interfaces
 */
export function analyzeSEO(
    input: SEOAnalysisInput
): SEOAnalysisResult {
    const parsedInput = seoAnalysisSchema.safeParse(input);

    if (!parsedInput.success) {
        throw new Error(
            parsedInput.error.issues[0]?.message ??
                "Invalid SEO analysis input."
        );
    }

    const data = parsedInput.data;

    const recommendations: SEORecommendation[] = [];

    const metrics = extractMetrics(data.content);

    analyzeTitle(data.title, recommendations);

    analyzeDescription(
        data.description,
        recommendations
    );

    analyzeContent(
        data.content,
        metrics,
        recommendations
    );

    analyzeCanonical(
        data.canonicalUrl,
        recommendations
    );

    analyzeRobots(
        data.noIndex,
        data.noFollow,
        recommendations
    );

    analyzeOpenGraph(
        data.ogTitle,
        data.ogDescription,
        data.ogImage,
        recommendations
    );

    analyzeImages(
        metrics,
        recommendations
    );

    analyzeLinks(
        metrics,
        recommendations
    );

    const score = calculateScore(recommendations);

    return {
        score,
        recommendations,
    };
}

/**
 * Validate and analyze arbitrary SEO input.
 *
 * Useful when the caller receives untrusted data such as
 * request bodies or form submissions.
 */
export function analyzeSEOInput(
    input: unknown
): SEOAnalysisResult {
    const result = seoAnalysisSchema.safeParse(input);

    if (!result.success) {
        throw new Error(
            result.error.issues[0]?.message ??
                "Invalid SEO analysis input."
        );
    }

    return analyzeSEO(result.data);
}