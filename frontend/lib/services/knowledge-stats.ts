import {
    KnowledgeArticleStatus,
    KnowledgeArticleVisibility,
    Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class KnowledgeStatsServiceError extends Error {
    status: 500;

    constructor(message: string) {
        super(message);
        this.name = "KnowledgeStatsServiceError";
        this.status = 500;
    }
}

export interface KnowledgeBaseStats {
    totalArticles: number;
    draftArticles: number;
    publishedArticles: number;
    archivedArticles: number;
    internalArticles: number;
    publicArticles: number;
    featuredArticles: number;
    totalCategories: number;
}

const recentArticleSelect = {
    id: true,
    title: true,
    slug: true,
    publishedAt: true,
} satisfies Prisma.KnowledgeArticleSelect;

const recentUpdatedArticleSelect = {
    id: true,
    title: true,
    slug: true,
    updatedAt: true,
} satisfies Prisma.KnowledgeArticleSelect;

/**
 * Returns administrative Knowledge Base statistics.
 *
 * Soft-deleted articles and categories are excluded from the
 * primary statistics.
 */
export async function getKnowledgeBaseStats(): Promise<KnowledgeBaseStats> {
    try {
        const [
            totalArticles,
            draftArticles,
            publishedArticles,
            archivedArticles,
            internalArticles,
            publicArticles,
            featuredArticles,
            totalCategories,
            recentlyPublished,
            recentlyUpdated,
        ] = await prisma.$transaction([
            prisma.knowledgeArticle.count({
                where: {
                    deletedAt: null,
                },
            }),

            prisma.knowledgeArticle.count({
                where: {
                    deletedAt: null,
                    status: KnowledgeArticleStatus.DRAFT,
                },
            }),

            prisma.knowledgeArticle.count({
                where: {
                    deletedAt: null,
                    status: KnowledgeArticleStatus.PUBLISHED,
                },
            }),

            prisma.knowledgeArticle.count({
                where: {
                    deletedAt: null,
                    status: KnowledgeArticleStatus.ARCHIVED,
                },
            }),

            prisma.knowledgeArticle.count({
                where: {
                    deletedAt: null,
                    visibility:
                        KnowledgeArticleVisibility.INTERNAL,
                },
            }),

            prisma.knowledgeArticle.count({
                where: {
                    deletedAt: null,
                    visibility:
                        KnowledgeArticleVisibility.PUBLIC,
                },
            }),

            prisma.knowledgeArticle.count({
                where: {
                    deletedAt: null,
                    featured: true,
                },
            }),

            prisma.knowledgeCategory.count({
                where: {
                    deletedAt: null,
                },
            }),

            prisma.knowledgeArticle.findMany({
                where: {
                    deletedAt: null,
                    status: KnowledgeArticleStatus.PUBLISHED,
                    publishedAt: {
                        not: null,
                    },
                },
                orderBy: {
                    publishedAt: "desc",
                },
                take: 5,
                select: recentArticleSelect,
            }),

            prisma.knowledgeArticle.findMany({
                where: {
                    deletedAt: null,
                },
                orderBy: {
                    updatedAt: "desc",
                },
                take: 5,
                select: recentUpdatedArticleSelect,
            }),
        ]);

        return {
            totalArticles,
            draftArticles,
            publishedArticles,
            archivedArticles,
            internalArticles,
            publicArticles,
            featuredArticles,
            totalCategories,
        };
    } catch (error) {
        console.error(
            "[KNOWLEDGE_STATS_SERVICE]",
            error
        );

        throw new KnowledgeStatsServiceError(
            "Failed to retrieve Knowledge Base statistics."
        );
    }
}