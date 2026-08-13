import { Prisma, KnowledgeArticle } from "@prisma/client";

import type { KnowledgeArticleListItem } from "@/components/workspace/knowledge/types";
import { prisma } from "@/lib/prisma";

import type {
    ArticleListQuery,
    CreateArticleInput,
    UpdateArticleInput,
} from "@/lib/validations/knowledge-base";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export class KnowledgeArticleServiceError extends Error {
    status: 400 | 404 | 409 | 500;

    constructor(
        message: string,
        status: 400 | 404 | 409 | 500
    ) {
        super(message);
        this.name = "KnowledgeArticleServiceError";
        this.status = status;
    }
}

export interface KnowledgeArticleListResult {
    articles: KnowledgeArticleListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeArticleData(
    input: CreateArticleInput | UpdateArticleInput
) {
    return {
        ...input,

        title:
            input.title !== undefined
                ? input.title.trim()
                : undefined,

        slug:
            input.slug !== undefined
                ? input.slug.trim().toLowerCase()
                : undefined,

        excerpt:
            input.excerpt === undefined
                ? undefined
                : input.excerpt?.trim() || null,

        content:
            input.content !== undefined
                ? input.content.trim()
                : undefined,

        metaTitle:
            input.metaTitle === undefined
                ? undefined
                : input.metaTitle?.trim() || null,

        metaDescription:
            input.metaDescription === undefined
                ? undefined
                : input.metaDescription?.trim() || null,

        canonicalUrl:
            input.canonicalUrl === undefined
                ? undefined
                : input.canonicalUrl?.trim() || null,
    };
}

function isUniqueConstraintError(
    error: unknown
): error is Prisma.PrismaClientKnownRequestError {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    );
}

function isForeignKeyConstraintError(
    error: unknown
): error is Prisma.PrismaClientKnownRequestError {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
    );
}

/* -------------------------------------------------------------------------- */
/* Publishing normalization                                                   */
/* -------------------------------------------------------------------------- */

function normalizePublishingState<
    T extends {
        status?: CreateArticleInput["status"];
        publishedAt?: Date | null;
    },
>(data: T) {
    if (data.status === "DRAFT") {
        return {
            ...data,
            publishedAt: null,
        };
    }

    if (data.status === "PUBLISHED") {
        return {
            ...data,
            publishedAt: data.publishedAt ?? new Date(),
        };
    }

    if (data.status === "ARCHIVED") {
        return data;
    }

    return data;
}

/* -------------------------------------------------------------------------- */
/* Validate category                                                          */
/* -------------------------------------------------------------------------- */

async function ensureCategoryExists(categoryId: string) {
    const category = await prisma.knowledgeCategory.findFirst({
        where: {
            id: categoryId,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!category) {
        throw new KnowledgeArticleServiceError(
            "Knowledge category not found or is archived.",
            404
        );
    }
}

/* -------------------------------------------------------------------------- */
/* Validate author                                                            */
/* -------------------------------------------------------------------------- */

async function ensureAuthorExists(authorId: string) {
    const author = await prisma.user.findUnique({
        where: {
            id: authorId,
        },
        select: {
            id: true,
        },
    });

    if (!author) {
        throw new KnowledgeArticleServiceError(
            "Article author not found.",
            404
        );
    }
}

/* -------------------------------------------------------------------------- */
/* Get articles                                                               */
/* -------------------------------------------------------------------------- */

export async function getArticles(
    query: ArticleListQuery
): Promise<KnowledgeArticleListResult> {
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

    const where: Prisma.KnowledgeArticleWhereInput = {
        ...(includeDeleted
            ? {}
            : {
                deletedAt: null,
            }),

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

        ...(search
            ? {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        slug: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        excerpt: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        content: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {}),
    };

    const [articles, total] = await prisma.$transaction([
        prisma.knowledgeArticle.findMany({
            where,
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip: (page - 1) * limit,
            take: limit,
            include: {
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
            },
        }),
        prisma.knowledgeArticle.count({
            where,
        }),
    ]);

    const mappedArticles: KnowledgeArticleListItem[] = articles.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        status: article.status,
        visibility: article.visibility,
        featured: article.featured,
        sortOrder: article.sortOrder,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        deletedAt: article.deletedAt,
        category: article.category ?? null,
        author: article.author ?? null,
    }));

    return {
        articles: mappedArticles,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/* -------------------------------------------------------------------------- */
/* Get article by ID                                                          */
/* -------------------------------------------------------------------------- */

export async function getArticleById(
    id: string,
    options?: {
        includeDeleted?: boolean;
    }
) {
    const includeDeleted = options?.includeDeleted ?? false;

    const article = await prisma.knowledgeArticle.findFirst({
        where: {
            id,

            ...(includeDeleted
                ? {}
                : {
                    deletedAt: null,
                }),
        },

        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    icon: true,
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
        },
    });

    if (!article) {
        throw new KnowledgeArticleServiceError(
            "Knowledge article not found.",
            404
        );
    }

    return article;
}

/* -------------------------------------------------------------------------- */
/* Get article by slug                                                        */
/* -------------------------------------------------------------------------- */

export async function getArticleBySlug(
    slug: string,
    options?: {
        includeDeleted?: boolean;
        publicOnly?: boolean;
    }
) {
    const normalizedSlug = slug.trim().toLowerCase();

    const includeDeleted = options?.includeDeleted ?? false;
    const publicOnly = options?.publicOnly ?? false;

    const article = await prisma.knowledgeArticle.findFirst({
        where: {
            slug: normalizedSlug,

            ...(includeDeleted
                ? {}
                : {
                    deletedAt: null,
                }),

            ...(publicOnly
                ? {
                    status: "PUBLISHED",
                    visibility: "PUBLIC",
                }
                : {}),
        },

        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    icon: true,
                },
            },

            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });

    if (!article) {
        throw new KnowledgeArticleServiceError(
            "Knowledge article not found.",
            404
        );
    }

    return article;
}

/* -------------------------------------------------------------------------- */
/* Create article                                                             */
/* -------------------------------------------------------------------------- */

export async function createArticle(
    input: CreateArticleInput,
    authorId: string
) {
    await ensureAuthorExists(authorId);
    await ensureCategoryExists(input.categoryId);

    const normalizedData = normalizeArticleData(input);

    const publishingData = normalizePublishingState({
        ...normalizedData,
        status: normalizedData.status ?? "DRAFT",
        publishedAt: normalizedData.publishedAt ?? null,
    });

    try {
        return await prisma.knowledgeArticle.create({
            data: {
                title: input.title.trim(),
                slug: input.slug.trim().toLowerCase(),
                excerpt: input.excerpt?.trim() || null,
                content: input.content.trim(),
                categoryId: input.categoryId,
                status: publishingData.status ?? "DRAFT",
                visibility: input.visibility ?? "INTERNAL",
                featured: input.featured ?? false,
                sortOrder: input.sortOrder ?? 0,
                publishedAt: publishingData.publishedAt ?? null,
                metaTitle: input.metaTitle?.trim() || null,
                metaDescription: input.metaDescription?.trim() || null,
                canonicalUrl: input.canonicalUrl?.trim() || null,
                authorId,
            },
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new KnowledgeArticleServiceError(
                "A knowledge article with this slug already exists.",
                409
            );
        }

        if (isForeignKeyConstraintError(error)) {
            throw new KnowledgeArticleServiceError(
                "The selected category or author does not exist.",
                400
            );
        }

        throw error;
    }
}

/* -------------------------------------------------------------------------- */
/* Update article                                                             */
/* -------------------------------------------------------------------------- */

export async function updateArticle(
    id: string,
    input: UpdateArticleInput
) {
    const existing = await prisma.knowledgeArticle.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new KnowledgeArticleServiceError(
            "Knowledge article not found.",
            404
        );
    }

    if (input.categoryId !== undefined) {
        await ensureCategoryExists(input.categoryId);
    }

    const normalizedData = normalizeArticleData(input);

    const nextStatus =
        normalizedData.status ?? existing.status;

    const nextPublishedAt =
        normalizedData.publishedAt !== undefined
            ? normalizedData.publishedAt
            : existing.publishedAt;

    const publishingData = normalizePublishingState({
        ...normalizedData,
        status: nextStatus,
        publishedAt: nextPublishedAt,
    });

    try {
        return await prisma.knowledgeArticle.update({
            where: {
                id,
            },
            data: publishingData,
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new KnowledgeArticleServiceError(
                "A knowledge article with this slug already exists.",
                409
            );
        }

        if (isForeignKeyConstraintError(error)) {
            throw new KnowledgeArticleServiceError(
                "The selected category does not exist.",
                400
            );
        }

        throw error;
    }
}

/* -------------------------------------------------------------------------- */
/* Publish article                                                            */
/* -------------------------------------------------------------------------- */

export async function publishArticle(
    id: string,
    publishedAt?: Date | null
) {
    const existing = await prisma.knowledgeArticle.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new KnowledgeArticleServiceError(
            "Knowledge article not found.",
            404
        );
    }

    return prisma.knowledgeArticle.update({
        where: {
            id,
        },
        data: {
            status: "PUBLISHED",
            publishedAt: publishedAt ?? existing.publishedAt ?? new Date(),
        },
    });
}

export async function unpublishArticle(id: string) {
    const existing = await prisma.knowledgeArticle.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new KnowledgeArticleServiceError(
            "Knowledge article not found.",
            404
        );
    }

    if (existing.status !== "PUBLISHED") {
        throw new KnowledgeArticleServiceError(
            "Only published knowledge articles can be unpublished.",
            400
        );
    }

    return prisma.knowledgeArticle.update({
        where: {
            id,
        },
        data: {
            status: "DRAFT",
            publishedAt: null,
        },
    });
}

/* -------------------------------------------------------------------------- */
/* Archive article                                                            */
/* -------------------------------------------------------------------------- */

export async function archiveArticle(id: string) {
    const existing = await prisma.knowledgeArticle.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new KnowledgeArticleServiceError(
            "Knowledge article not found.",
            404
        );
    }

    return prisma.knowledgeArticle.update({
        where: {
            id,
        },
        data: {
            status: "ARCHIVED",
            deletedAt: new Date(),
        },
    });
}

/* -------------------------------------------------------------------------- */
/* Restore article                                                            */
/* -------------------------------------------------------------------------- */

export async function restoreArticle(id: string) {
    const existing = await prisma.knowledgeArticle.findFirst({
        where: {
            id,
            deletedAt: {
                not: null,
            },
        },
    });

    if (!existing) {
        throw new KnowledgeArticleServiceError(
            "Deleted knowledge article not found.",
            404
        );
    }

    let restoredStatus:
        | "DRAFT"
        | "PUBLISHED"
        | "ARCHIVED";

    if (existing.status === "PUBLISHED") {
        restoredStatus = "PUBLISHED";
    } else if (existing.status === "DRAFT") {
        restoredStatus = "DRAFT";
    } else {
        restoredStatus = "DRAFT";
    }

    const restoredPublishedAt =
        restoredStatus === "PUBLISHED"
            ? existing.publishedAt ?? new Date()
            : null;

    return prisma.knowledgeArticle.update({
        where: {
            id,
        },
        data: {
            deletedAt: null,
            status: restoredStatus,
            publishedAt: restoredPublishedAt,
        },
    });
}

/* -------------------------------------------------------------------------- */
/* Delete article                                                             */
/* -------------------------------------------------------------------------- */

export async function deleteArticle(id: string) {
    const existing = await prisma.knowledgeArticle.findFirst({
        where: {
            id,
        },
    });

    if (!existing) {
        throw new KnowledgeArticleServiceError(
            "Knowledge article not found.",
            404
        );
    }

    try {
        return await prisma.knowledgeArticle.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        if (isForeignKeyConstraintError(error)) {
            throw new KnowledgeArticleServiceError(
                "This article cannot be permanently deleted because it is referenced by another record.",
                409
            );
        }

        throw error;
    }
}

/* -------------------------------------------------------------------------- */
/* Featured articles                                                          */
/* -------------------------------------------------------------------------- */

export async function getFeaturedArticles(
    limit = 6,
    options?: {
        visibility?: "INTERNAL" | "PUBLIC";
    }
) {
    const safeLimit = Math.min(
        Math.max(Math.floor(limit), 1),
        50
    );

    return prisma.knowledgeArticle.findMany({
        where: {
            deletedAt: null,
            featured: true,
            status: "PUBLISHED",

            ...(options?.visibility
                ? {
                    visibility: options.visibility,
                }
                : {}),
        },

        orderBy: [
            {
                sortOrder: "asc",
            },
            {
                publishedAt: "desc",
            },
        ],

        take: safeLimit,

        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });
}