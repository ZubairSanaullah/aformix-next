import { Prisma, KnowledgeCategory } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type {
    CategoryListQuery,
    CreateCategoryInput,
    UpdateCategoryInput,
} from "@/lib/validations/knowledge-base";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export class KnowledgeCategoryServiceError extends Error {
    status: 400 | 404 | 409 | 500;

    constructor(
        message: string,
        status: 400 | 404 | 409 | 500
    ) {
        super(message);
        this.name = "KnowledgeCategoryServiceError";
        this.status = status;
    }
}

export interface KnowledgeCategoryListResult {
    categories: KnowledgeCategory[];
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

function normalizeCategoryData(
    input: CreateCategoryInput | UpdateCategoryInput
) {
    return {
        ...input,
        name: input.name?.trim(),
        slug: input.slug?.trim().toLowerCase(),
        description:
            input.description === undefined
                ? undefined
                : input.description?.trim() || null,
        icon:
            input.icon === undefined
                ? undefined
                : input.icon?.trim() || null,
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
/* Get categories                                                             */
/* -------------------------------------------------------------------------- */

export async function getCategories(
    query: CategoryListQuery
): Promise<KnowledgeCategoryListResult> {
    const {
        search,
        includeDeleted,
        page,
        limit,
        sortBy,
        sortOrder,
    } = query;

    const where: Prisma.KnowledgeCategoryWhereInput = {
        ...(includeDeleted
            ? {}
            : {
                deletedAt: null,
            }),
        ...(search
            ? {
                OR: [
                    {
                        name: {
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
                        description: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {}),
    };

    const [categories, total] = await prisma.$transaction([
        prisma.knowledgeCategory.findMany({
            where,
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.knowledgeCategory.count({
            where,
        }),
    ]);

    return {
        categories,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/* -------------------------------------------------------------------------- */
/* Get category by ID                                                         */
/* -------------------------------------------------------------------------- */

export async function getCategoryById(
    id: string,
    options?: {
        includeDeleted?: boolean;
        includeArticleCount?: boolean;
    }
) {
    const includeDeleted = options?.includeDeleted ?? false;
    const includeArticleCount =
        options?.includeArticleCount ?? false;

    const category = await prisma.knowledgeCategory.findFirst({
        where: {
            id,
            ...(includeDeleted
                ? {}
                : {
                    deletedAt: null,
                }),
        },
        include: includeArticleCount
            ? {
                _count: {
                    select: {
                        articles: {
                            where: {
                                deletedAt: null,
                            },
                        },
                    },
                },
            }
            : undefined,
    });

    if (!category) {
        throw new KnowledgeCategoryServiceError(
            "Knowledge category not found.",
            404
        );
    }

    return category;
}

/* -------------------------------------------------------------------------- */
/* Get category by slug                                                       */
/* -------------------------------------------------------------------------- */

export async function getCategoryBySlug(
    slug: string,
    options?: {
        includeDeleted?: boolean;
        includeArticleCount?: boolean;
    }
) {
    const normalizedSlug = slug.trim().toLowerCase();

    const includeDeleted = options?.includeDeleted ?? false;
    const includeArticleCount =
        options?.includeArticleCount ?? false;

    const category =
        await prisma.knowledgeCategory.findFirst({
            where: {
                slug: normalizedSlug,
                ...(includeDeleted
                    ? {}
                    : {
                        deletedAt: null,
                    }),
            },
            include: includeArticleCount
                ? {
                    _count: {
                        select: {
                            articles: {
                                where: {
                                    deletedAt: null,
                                },
                            },
                        },
                    },
                }
                : undefined,
        });

    if (!category) {
        throw new KnowledgeCategoryServiceError(
            "Knowledge category not found.",
            404
        );
    }

    return category;
}

/* -------------------------------------------------------------------------- */
/* Create category                                                            */
/* -------------------------------------------------------------------------- */

export async function createCategory(
    input: CreateCategoryInput
) {
    const data = normalizeCategoryData(input);

    try {
        return await prisma.knowledgeCategory.create({
            data: {
                name: data.name ?? "",
                slug: data.slug ?? "",
                description: data.description ?? null,
                icon: data.icon ?? null,
                sortOrder: data.sortOrder ?? 0,
            },
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new KnowledgeCategoryServiceError(
                "A knowledge category with this name or slug already exists.",
                409
            );
        }

        throw error;
    }
}

/* -------------------------------------------------------------------------- */
/* Update category                                                            */
/* -------------------------------------------------------------------------- */

export async function updateCategory(
    id: string,
    input: UpdateCategoryInput
) {
    const existing = await prisma.knowledgeCategory.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new KnowledgeCategoryServiceError(
            "Knowledge category not found.",
            404
        );
    }

    const data = normalizeCategoryData(input);

    try {
        return await prisma.knowledgeCategory.update({
            where: {
                id,
            },
            data: {
                name: data.name ?? undefined,
                slug: data.slug ?? undefined,
                description: data.description ?? undefined,
                icon: data.icon ?? undefined,
                sortOrder: data.sortOrder ?? undefined,
            },
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new KnowledgeCategoryServiceError(
                "A knowledge category with this name or slug already exists.",
                409
            );
        }

        throw error;
    }
}

/* -------------------------------------------------------------------------- */
/* Archive category                                                           */
/* -------------------------------------------------------------------------- */

export async function archiveCategory(id: string) {
    const existing = await prisma.knowledgeCategory.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new KnowledgeCategoryServiceError(
            "Knowledge category not found.",
            404
        );
    }

    return prisma.knowledgeCategory.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

/* -------------------------------------------------------------------------- */
/* Restore category                                                           */
/* -------------------------------------------------------------------------- */

export async function restoreCategory(id: string) {
    const existing = await prisma.knowledgeCategory.findFirst({
        where: {
            id,
            deletedAt: {
                not: null,
            },
        },
    });

    if (!existing) {
        throw new KnowledgeCategoryServiceError(
            "Deleted knowledge category not found.",
            404
        );
    }

    try {
        return await prisma.knowledgeCategory.update({
            where: {
                id,
            },
            data: {
                deletedAt: null,
            },
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new KnowledgeCategoryServiceError(
                "This category cannot be restored because its name or slug conflicts with another category.",
                409
            );
        }

        throw error;
    }
}

/* -------------------------------------------------------------------------- */
/* Delete category                                                            */
/* -------------------------------------------------------------------------- */

export async function deleteCategory(id: string) {
    const existing = await prisma.knowledgeCategory.findFirst({
        where: {
            id,
        },
        include: {
            _count: {
                select: {
                    articles: true,
                },
            },
        },
    });

    if (!existing) {
        throw new KnowledgeCategoryServiceError(
            "Knowledge category not found.",
            404
        );
    }

    if (existing._count.articles > 0) {
        throw new KnowledgeCategoryServiceError(
            "This category cannot be permanently deleted because it still has knowledge articles. Archive it instead.",
            409
        );
    }

    try {
        return await prisma.knowledgeCategory.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        if (isForeignKeyConstraintError(error)) {
            throw new KnowledgeCategoryServiceError(
                "This category cannot be deleted because it is still referenced by knowledge articles.",
                409
            );
        }

        throw error;
    }
}

/* -------------------------------------------------------------------------- */
/* Category article count                                                     */
/* -------------------------------------------------------------------------- */

export async function getCategoryArticleCount(
    categoryId: string
) {
    const category = await prisma.knowledgeCategory.findFirst({
        where: {
            id: categoryId,
            deletedAt: null,
        },
    });

    if (!category) {
        throw new KnowledgeCategoryServiceError(
            "Knowledge category not found.",
            404
        );
    }

    return prisma.knowledgeArticle.count({
        where: {
            categoryId,
            deletedAt: null,
        },
    });
}