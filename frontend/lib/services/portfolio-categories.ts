import { Prisma, PortfolioCategory } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type {
    CreatePortfolioCategoryInput,
    PortfolioCategoryListQuery,
    UpdatePortfolioCategoryInput,
} from "@/lib/validations/portfolio";

export class PortfolioCategoryServiceError extends Error {
    status: 400 | 404 | 409 | 500;

    constructor(message: string, status: 400 | 404 | 409 | 500) {
        super(message);
        this.name = "PortfolioCategoryServiceError";
        this.status = status;
    }
}

export interface PortfolioCategoryListResult {
    categories: PortfolioCategory[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

function normalizeCategoryData(input: CreatePortfolioCategoryInput | UpdatePortfolioCategoryInput) {
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
    error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    );
}

export async function getPortfolioCategories(
    query: PortfolioCategoryListQuery,
): Promise<PortfolioCategoryListResult> {
    const { search, includeDeleted, page, limit, sortBy, sortOrder } = query;

    const where: Prisma.PortfolioCategoryWhereInput = {
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { slug: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
    };

    const [categories, total] = await prisma.$transaction([
        prisma.portfolioCategory.findMany({
            where,
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.portfolioCategory.count({ where }),
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

export async function getPortfolioCategoryById(
    id: string,
    options?: { includeDeleted?: boolean },
) {
    const category = await prisma.portfolioCategory.findFirst({
        where: {
            id,
            ...(options?.includeDeleted ? {} : { deletedAt: null }),
        },
    });

    if (!category) {
        throw new PortfolioCategoryServiceError(
            "Portfolio category not found.",
            404,
        );
    }

    return category;
}

export async function getPortfolioCategoryBySlug(
    slug: string,
    options?: { includeDeleted?: boolean },
) {
    const normalized = slug.trim().toLowerCase();

    const category = await prisma.portfolioCategory.findFirst({
        where: {
            slug: normalized,
            ...(options?.includeDeleted ? {} : { deletedAt: null }),
        },
    });

    if (!category) {
        throw new PortfolioCategoryServiceError(
            "Portfolio category not found.",
            404,
        );
    }

    return category;
}

export async function createPortfolioCategory(input: CreatePortfolioCategoryInput) {
    const data = normalizeCategoryData(input);

    const createPayload: Prisma.PortfolioCategoryCreateInput = {
        name: data.name ?? "",
        slug: data.slug ?? "",
        description: data.description ?? null,
        icon: data.icon ?? null,
        sortOrder: data.sortOrder ?? 0,
    };

    try {
        return await prisma.portfolioCategory.create({
            data: createPayload,
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new PortfolioCategoryServiceError(
                "A portfolio category with this name or slug already exists.",
                409,
            );
        }

        console.error("[PORTFOLIO_CATEGORY_SERVICE_CREATE]", error);
        throw new PortfolioCategoryServiceError(
            "Failed to create portfolio category.",
            500,
        );
    }
}

export async function updatePortfolioCategory(
    id: string,
    input: UpdatePortfolioCategoryInput,
) {
    const data = normalizeCategoryData(input);

    const existing = await prisma.portfolioCategory.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new PortfolioCategoryServiceError(
            "Portfolio category not found.",
            404,
        );
    }

    const updatePayload: Prisma.PortfolioCategoryUpdateInput = {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.description !== undefined ? { description: data.description ?? null } : {}),
        ...(data.icon !== undefined ? { icon: data.icon ?? null } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    };

    try {
        return await prisma.portfolioCategory.update({
            where: { id },
            data: updatePayload,
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new PortfolioCategoryServiceError(
                "A portfolio category with this name or slug already exists.",
                409,
            );
        }

        console.error("[PORTFOLIO_CATEGORY_SERVICE_UPDATE]", error);
        throw new PortfolioCategoryServiceError(
            "Failed to update portfolio category.",
            500,
        );
    }
}

export async function archivePortfolioCategory(id: string) {
    const existing = await prisma.portfolioCategory.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new PortfolioCategoryServiceError(
            "Portfolio category not found.",
            404,
        );
    }

    if (existing.deletedAt) {
        throw new PortfolioCategoryServiceError(
            "Portfolio category is already archived.",
            409,
        );
    }

    return prisma.portfolioCategory.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
    });
}

export async function restorePortfolioCategory(id: string) {
    const existing = await prisma.portfolioCategory.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new PortfolioCategoryServiceError(
            "Portfolio category not found.",
            404,
        );
    }

    if (!existing.deletedAt) {
        throw new PortfolioCategoryServiceError(
            "Portfolio category is not archived.",
            409,
        );
    }

    return prisma.portfolioCategory.update({
        where: { id },
        data: {
            deletedAt: null,
        },
    });
}

export async function getPortfolioCategoryProjectCount(id: string) {
    const category = await prisma.portfolioCategory.findUnique({
        where: { id },
        select: { id: true },
    });

    if (!category) {
        throw new PortfolioCategoryServiceError(
            "Portfolio category not found.",
            404,
        );
    }

    return prisma.portfolioProject.count({
        where: {
            categoryId: id,
        },
    });
}

export async function deletePortfolioCategory(id: string) {
    const existing = await prisma.portfolioCategory.findUnique({
        where: { id },
        select: {
            id: true,
            deletedAt: true,
        },
    });

    if (!existing) {
        throw new PortfolioCategoryServiceError(
            "Portfolio category not found.",
            404,
        );
    }

    const activeProjectCount = await prisma.portfolioProject.count({
        where: {
            categoryId: id,
            deletedAt: null,
        },
    });

    if (activeProjectCount > 0) {
        throw new PortfolioCategoryServiceError(
            "Cannot permanently delete a category that still has active portfolio projects.",
            409,
        );
    }

    return prisma.portfolioCategory.delete({
        where: { id },
    });
}
