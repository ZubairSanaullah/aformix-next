import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
    analyzeSEO,
} from "./analyzer";
import type { SEOAnalysisResult } from "@/lib/validations/seo";

export interface SEOPageData {
    path?: string;
    title?: string | null;
    description?: string | null;
    keywords?: string[] | null;
    canonical?: string | null;
    noIndex?: boolean;
    noFollow?: boolean;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
}

const seoPageSelect = {
    id: true,
    path: true,
    title: true,
    description: true,
    keywords: true,
    canonical: true,
    noIndex: true,
    noFollow: true,
    ogTitle: true,
    ogDescription: true,
    ogImage: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.SEOPageSelect;

export async function getSEOPages() {
    return prisma.sEOPage.findMany({
        select: seoPageSelect,
        orderBy: {
            path: "asc",
        },
    });
}

export async function getSEOPageById(id: string) {
    return prisma.sEOPage.findUnique({
        where: { id },
        select: seoPageSelect,
    });
}

export async function getSEOPageByPath(path: string) {
    return prisma.sEOPage.findUnique({
        where: { path },
        select: seoPageSelect,
    });
}

export async function isSEOPagePathTaken(
    path: string,
    excludeId?: string
): Promise<boolean> {
    const existingPage =
        await prisma.sEOPage.findUnique({
            where: { path },
            select: { id: true },
        });

    if (!existingPage) {
        return false;
    }

    if (
        excludeId &&
        existingPage.id === excludeId
    ) {
        return false;
    }

    return true;
}

export async function createSEOPage(
    data: SEOPageData
) {
    if (!data.path?.trim()) {
        throw new Error(
            "SEO page path is required."
        );
    }

    return prisma.sEOPage.create({
        data: {
            path: data.path.trim(),
            title: data.title ?? null,
            description: data.description ?? null,
            keywords:
                data.keywords && data.keywords.length > 0
                    ? data.keywords
                          .map((keyword) => keyword.trim())
                          .filter(Boolean)
                          .join(", ")
                    : null,
            canonical: data.canonical ?? null,
            noIndex: data.noIndex ?? false,
            noFollow: data.noFollow ?? false,
            ogTitle: data.ogTitle ?? null,
            ogDescription:
                data.ogDescription ?? null,
            ogImage: data.ogImage ?? null,
        },
        select: seoPageSelect,
    });
}

export async function updateSEOPage(
    id: string,
    data: SEOPageData
) {
    const updateData: Prisma.SEOPageUpdateInput =
        {};

    if (data.path !== undefined) {
        updateData.path = data.path.trim();
    }

    if (data.title !== undefined) {
        updateData.title = data.title;
    }

    if (data.description !== undefined) {
        updateData.description =
            data.description;
    }

    if (data.keywords !== undefined) {
        updateData.keywords =
            data.keywords && data.keywords.length > 0
                ? data.keywords
                      .map((keyword) => keyword.trim())
                      .filter(Boolean)
                      .join(", ")
                : null;
    }

    if (data.canonical !== undefined) {
        updateData.canonical = data.canonical;
    }

    if (data.noIndex !== undefined) {
        updateData.noIndex = data.noIndex;
    }

    if (data.noFollow !== undefined) {
        updateData.noFollow = data.noFollow;
    }

    if (data.ogTitle !== undefined) {
        updateData.ogTitle = data.ogTitle;
    }

    if (data.ogDescription !== undefined) {
        updateData.ogDescription =
            data.ogDescription;
    }

    if (data.ogImage !== undefined) {
        updateData.ogImage = data.ogImage;
    }

    return prisma.sEOPage.update({
        where: { id },
        data: updateData,
        select: seoPageSelect,
    });
}

export async function deleteSEOPage(id: string) {
    return prisma.sEOPage.delete({
        where: { id },
        select: seoPageSelect,
    });
}

export async function analyzeSEOPageById(
    id: string
): Promise<SEOAnalysisResult | null> {
    const page = await getSEOPageById(id);

    if (!page) {
        return null;
    }

    return analyzeSEO({
        title: page.title ?? "",
        description: page.description ?? "",
        content: "",
        canonicalUrl: page.canonical,
        noIndex: page.noIndex,
        noFollow: page.noFollow,
        ogTitle: page.ogTitle,
        ogDescription: page.ogDescription,
        ogImage: page.ogImage,
    });
}

export async function analyzeSEOPageByPath(
    path: string
): Promise<SEOAnalysisResult | null> {
    const page = await getSEOPageByPath(path);

    if (!page) {
        return null;
    }

    return analyzeSEO({
        title: page.title ?? "",
        description: page.description ?? "",
        content: "",
        canonicalUrl: page.canonical,
        noIndex: page.noIndex,
        noFollow: page.noFollow,
        ogTitle: page.ogTitle,
        ogDescription: page.ogDescription,
        ogImage: page.ogImage,
    });
}

export function analyzeSEOPageData(
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
        ogDescription:
            data.ogDescription ?? null,
        ogImage: data.ogImage ?? null,
    });
}