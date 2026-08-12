import { analyzeSEO } from "./analyzer";
import type { SEOAnalysisResult } from "@/lib/validations/seo";

import {
    analyzeSEOPageById as analyzeSEOPageByIdFromPage,
    analyzeSEOPageByPath as analyzeSEOPageByPathFromPage,
    type SEOPageData,
} from "./pages";

/**
 * Analyze arbitrary SEO data.
 *
 * This is the service-level entry point for unsaved SEO content.
 * It does not access the database.
 */
export function analyzeSEOInputData(
    data: SEOPageData,
    content = ""
): SEOAnalysisResult {
    return analyzeSEO({
        title: data.title ?? "",
        description: data.description ?? "",
        content,
        canonicalUrl: data.canonical ?? null,
        noIndex: data.noIndex ?? false,
        noFollow: data.noFollow ?? false,
        ogTitle: data.ogTitle ?? null,
        ogDescription: data.ogDescription ?? null,
        ogImage: data.ogImage ?? null,
    });
}

/**
 * Analyze a saved SEO page by database ID.
 *
 * Returns null when the SEO page does not exist.
 */
export async function analyzeSEOPageById(
    id: string
): Promise<SEOAnalysisResult | null> {
    return analyzeSEOPageByIdFromPage(id);
}

/**
 * Analyze a saved SEO page by its public route path.
 *
 * Returns null when no SEO configuration exists
 * for the requested route.
 */
export async function analyzeSEOPageByPath(
    path: string
): Promise<SEOAnalysisResult | null> {
    return analyzeSEOPageByPathFromPage(path);
}