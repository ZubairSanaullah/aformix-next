import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createFinanceAuditLog } from "./finance-audit";
import type {
    CreateFinanceCategoryInput,
    FinanceCategoryListQuery,
    UpdateFinanceCategoryInput,
} from "@/lib/validations/finance";

export class FinanceCategoryServiceError extends Error {
    status: 400 | 404 | 409 | 500;

    constructor(message: string, status: 400 | 404 | 409 | 500) {
        super(message);
        this.name = "FinanceCategoryServiceError";
        this.status = status;
    }
}

export interface FinanceCategoryListResult {
    categories: Awaited<
        ReturnType<typeof prisma.financeCategory.findMany>
    >;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

function normalizeCategoryData(
    input: CreateFinanceCategoryInput | UpdateFinanceCategoryInput
) {
    return {
        ...input,
        name: input.name !== undefined ? input.name.trim() : undefined,
        slug: input.slug !== undefined ? input.slug.trim().toLowerCase() : undefined,
        description:
            input.description === undefined
                ? undefined
                : input.description?.trim() || null,
        color:
            input.color === undefined
                ? undefined
                : input.color?.trim() || null,
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

export async function getFinanceCategories(
    query: FinanceCategoryListQuery
): Promise<FinanceCategoryListResult> {
    const { search, type, includeDeleted, page, limit, sortBy, sortOrder } = query;

    const where: Prisma.FinanceCategoryWhereInput = {
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(type ? { type } : {}),
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
        prisma.financeCategory.findMany({
            where,
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.financeCategory.count({ where }),
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

export async function getFinanceCategoryById(
    id: string,
    options?: { includeDeleted?: boolean }
) {
    const includeDeleted = options?.includeDeleted ?? false;

    const category = await prisma.financeCategory.findFirst({
        where: {
            id,
            ...(includeDeleted ? {} : { deletedAt: null }),
        },
    });

    if (!category) {
        throw new FinanceCategoryServiceError(
            "Finance category not found.",
            404
        );
    }

    return category;
}

export async function getFinanceCategoryBySlug(
    slug: string,
    options?: { includeDeleted?: boolean }
) {
    const normalizedSlug = slug.trim().toLowerCase();
    const includeDeleted = options?.includeDeleted ?? false;

    const category = await prisma.financeCategory.findFirst({
        where: {
            slug: normalizedSlug,
            ...(includeDeleted ? {} : { deletedAt: null }),
        },
    });

    if (!category) {
        throw new FinanceCategoryServiceError(
            "Finance category not found.",
            404
        );
    }

    return category;
}

export async function createFinanceCategory(
    data: CreateFinanceCategoryInput,
    auditUserId?: string
) {
    const payload = normalizeCategoryData(data);

    try {
        const category = await prisma.financeCategory.create({
            data: payload as Prisma.FinanceCategoryCreateInput,
        });

        if (auditUserId) {
            await createFinanceAuditLog({
                userId: auditUserId,
                action: "CREATE",
                resource: "FinanceCategory",
                resourceId: category.id,
                metadata: {
                    name: category.name,
                    type: category.type,
                    slug: category.slug,
                },
            }).catch((err) => {
                console.error("[AUDIT_LOG_ERROR]", err);
            });
        }

        return category;
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new FinanceCategoryServiceError(
                "A finance category with this slug already exists.",
                409
            );
        }

        throw error;
    }
}

export async function updateFinanceCategory(
    id: string,
    data: UpdateFinanceCategoryInput,
    auditUserId?: string
) {
    const existing = await prisma.financeCategory.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new FinanceCategoryServiceError(
            "Finance category not found.",
            404
        );
    }

    const payload = normalizeCategoryData(data);

    try {
        const category = await prisma.financeCategory.update({
            where: { id },
            data: payload,
        });

        if (auditUserId) {
            await createFinanceAuditLog({
                userId: auditUserId,
                action: "UPDATE",
                resource: "FinanceCategory",
                resourceId: category.id,
                metadata: {
                    name: category.name,
                    type: category.type,
                },
            }).catch((err) => {
                console.error("[AUDIT_LOG_ERROR]", err);
            });
        }

        return category;
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new FinanceCategoryServiceError(
                "A finance category with this slug already exists.",
                409
            );
        }

        throw error;
    }
}

export async function archiveFinanceCategory(
    id: string,
    auditUserId?: string
) {
    const existing = await prisma.financeCategory.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new FinanceCategoryServiceError(
            "Finance category not found.",
            404
        );
    }

    const category = await prisma.financeCategory.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: "ARCHIVE",
            resource: "FinanceCategory",
            resourceId: category.id,
            metadata: {
                name: category.name,
                type: category.type,
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return category;
}

export async function restoreFinanceCategory(
    id: string,
    auditUserId?: string
) {
    const existing = await prisma.financeCategory.findFirst({
        where: {
            id,
            deletedAt: { not: null },
        },
    });

    if (!existing) {
        throw new FinanceCategoryServiceError(
            "Archived finance category not found.",
            404
        );
    }

    const category = await prisma.financeCategory.update({
        where: { id },
        data: {
            deletedAt: null,
        },
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: "RESTORE",
            resource: "FinanceCategory",
            resourceId: category.id,
            metadata: {
                name: category.name,
                type: category.type,
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return category;
}

export async function deleteFinanceCategory(
    id: string,
    auditUserId?: string
) {
    const existing = await prisma.financeCategory.findFirst({
        where: { id },
    });

    if (!existing) {
        throw new FinanceCategoryServiceError(
            "Finance category not found.",
            404
        );
    }

    const transactionCount = await prisma.financeTransaction.count({
        where: { categoryId: id },
    });

    if (transactionCount > 0) {
        throw new FinanceCategoryServiceError(
            "Cannot delete a finance category that has transaction history.",
            409
        );
    }

    const category = await prisma.financeCategory.delete({
        where: { id },
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: "PERMANENTLY_DELETE",
            resource: "FinanceCategory",
            resourceId: category.id,
            metadata: {
                name: category.name,
                type: category.type,
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return category;
}
