import {
    KnowledgeArticleStatus,
    KnowledgeArticleVisibility,
    Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type {
    ArticleListQuery,
} from "@/lib/validations/knowledge-base";

export class KnowledgeSearchServiceError extends Error {
    status: 400 | 500;

    constructor(
        message: string,
        status: 400 | 500
    ) {
        super(message);
        this.name = "KnowledgeSearchServiceError";
        this.status = status;
    }
}

export interface KnowledgeSearchResult {
    articles: Array<{
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        status: KnowledgeArticleStatus;
        visibility: KnowledgeArticleVisibility;
        featured: boolean;
        sortOrder: number;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        author: {
            id: string;
            name: string | null;
            email: string;
            image: string | null;
        };
    }>;

    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const articleSelect = {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    content: true,
    status: true,
    visibility: true,
    featured: true,
    sortOrder: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,

    category: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },

    author: {
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
        },
    },
} satisfies Prisma.KnowledgeArticleSelect;

/**
 * Searches Knowledge Base articles.
 *
 * Searchable fields:
 * - title
 * - slug
 * - excerpt
 * - content
 *
 * Supports the standard Knowledge Base article filters,
 * pagination, and sorting while excluding soft-deleted
 * records by default.
 */
export async function searchKnowledgeArticles(
    query: ArticleListQuery
): Promise<KnowledgeSearchResult> {
    const {
        search,
        categoryId,
        status,
        visibility,
        authorId,
        featured,
        includeDeleted,
        page,
        limit,
        sortBy,
        sortOrder,
    } = query;

    const normalizedSearch =
        search?.trim() || undefined;

    const where: Prisma.KnowledgeArticleWhereInput = {
        ...(includeDeleted
            ? {}
            : {
                deletedAt: null,
            }),

        ...(normalizedSearch
            ? {
                OR: [
                    {
                        title: {
                            contains: normalizedSearch,
                            mode: "insensitive",
                        },
                    },
                    {
                        slug: {
                            contains: normalizedSearch,
                            mode: "insensitive",
                        },
                    },
                    {
                        excerpt: {
                            contains: normalizedSearch,
                            mode: "insensitive",
                        },
                    },
                    {
                        content: {
                            contains: normalizedSearch,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {}),

        ...(categoryId
            ? {
                categoryId,
            }
            : {}),

        ...(status
            ? {
                status,
            }
            : {}),

        ...(visibility
            ? {
                visibility,
            }
            : {}),

        ...(authorId
            ? {
                authorId,
            }
            : {}),

        ...(featured !== undefined
            ? {
                featured,
            }
            : {}),
    };

    try {
        const [articles, total] =
            await prisma.$transaction([
                prisma.knowledgeArticle.findMany({
                    where,
                    select: articleSelect,
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                }),

                prisma.knowledgeArticle.count({
                    where,
                }),
            ]);

        return {
            articles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(
                    total / limit
                ),
            },
        };
    } catch (error) {
        console.error(
            "[KNOWLEDGE_SEARCH_SERVICE]",
            error
        );

        throw new KnowledgeSearchServiceError(
            "Failed to search knowledge articles.",
            500
        );
    }
}