import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createFinanceAuditLog } from "./finance-audit";
import type {
    CreateFinanceTransactionInput,
    FinanceTransactionListQuery,
    UpdateFinanceTransactionInput,
} from "@/lib/validations/finance";

export class FinanceTransactionServiceError extends Error {
    status: 400 | 404 | 409 | 500;

    constructor(message: string, status: 400 | 404 | 409 | 500) {
        super(message);
        this.name = "FinanceTransactionServiceError";
        this.status = status;
    }
}

function toDecimal(value: Prisma.Decimal | string | number): Prisma.Decimal {
    if (value instanceof Prisma.Decimal) {
        return value;
    }

    return new Prisma.Decimal(value.toString());
}

function normalizeAmount(value: number | string | Prisma.Decimal): Prisma.Decimal {
    return toDecimal(value).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

function derivePendingAmount(amount: Prisma.Decimal, paidAmount: Prisma.Decimal) {
    return amount.sub(paidAmount).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

function derivePaymentStatus(
    amount: Prisma.Decimal,
    paidAmount: Prisma.Decimal,
    pendingAmount: Prisma.Decimal
) {
    if (paidAmount.equals(0) && pendingAmount.equals(amount)) {
        return "PENDING";
    }

    if (paidAmount.equals(amount) && pendingAmount.equals(0)) {
        return "PAID";
    }

    if (paidAmount.gt(0) && pendingAmount.gt(0) && paidAmount.lt(amount)) {
        return "PARTIALLY_PAID";
    }

    if (pendingAmount.equals(0) && paidAmount.equals(0)) {
        return "PENDING";
    }

    return "PENDING";
}

function resolveTransactionPayload<T extends CreateFinanceTransactionInput | UpdateFinanceTransactionInput>(input: T) {
    const amount = normalizeAmount(input.amount ?? 0);
    const paidAmount = normalizeAmount(input.paidAmount ?? 0);
    const pendingAmount =
        input.pendingAmount !== undefined
            ? normalizeAmount(input.pendingAmount)
            : derivePendingAmount(amount, paidAmount);

    const nextStatus =
        input.status ??
        derivePaymentStatus(amount, paidAmount, pendingAmount);

    return {
        ...input,
        amount,
        paidAmount,
        pendingAmount,
        status: nextStatus,
        reference: input.reference?.trim() || null,
        invoiceNumber: input.invoiceNumber?.trim() || null,
        invoiceReference: input.invoiceReference?.trim() || null,
        description: input.description?.trim() || null,
        notes: input.notes?.trim() || null,
        currency: input.currency?.trim().toUpperCase() || "USD",
        categoryId: input.categoryId || null,
        companyId: input.companyId || null,
        sourceImportId: input.sourceImportId || null,
    };
}

const includeRelations = {
    category: {
        select: {
            id: true,
            name: true,
            slug: true,
            type: true,
        },
    },
    company: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
    createdBy: {
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    },
    sourceImport: {
        select: {
            id: true,
            filename: true,
            status: true,
        },
    },
} as const;

export async function getFinanceTransactions(
    query: FinanceTransactionListQuery = {
        page: 1,
        limit: 20,
        sortBy: "transactionDate",
        sortOrder: "desc",
        includeDeleted: false,
    }
) {
    const {
        search,
        type,
        status,
        categoryId,
        companyId,
        dateFrom,
        dateTo,
        dueDateFrom,
        dueDateTo,
        minAmount,
        maxAmount,
        includeDeleted,
        page,
        limit,
        sortBy,
        sortOrder,
    } = query;

    const where: Prisma.FinanceTransactionWhereInput = {
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(type ? { type } : {}),
        ...(status ? { status } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(companyId ? { companyId } : {}),
        ...(search
            ? {
                  OR: [
                      { reference: { contains: search, mode: "insensitive" } },
                      { description: { contains: search, mode: "insensitive" } },
                      { notes: { contains: search, mode: "insensitive" } },
                      { invoiceNumber: { contains: search, mode: "insensitive" } },
                      { invoiceReference: { contains: search, mode: "insensitive" } },
                      { company: { name: { contains: search, mode: "insensitive" } } },
                  ],
              }
            : {}),
        ...(dateFrom || dateTo
            ? {
                  transactionDate: {
                      ...(dateFrom ? { gte: dateFrom } : {}),
                      ...(dateTo ? { lte: dateTo } : {}),
                  },
              }
            : {}),
        ...(dueDateFrom || dueDateTo
            ? {
                  dueDate: {
                      ...(dueDateFrom ? { gte: dueDateFrom } : {}),
                      ...(dueDateTo ? { lte: dueDateTo } : {}),
                  },
              }
            : {}),
        ...(minAmount !== undefined || maxAmount !== undefined
            ? {
                  amount: {
                      ...(minAmount !== undefined ? { gte: normalizeAmount(minAmount) } : {}),
                      ...(maxAmount !== undefined ? { lte: normalizeAmount(maxAmount) } : {}),
                  },
              }
            : {}),
    };

    const [transactions, total] = await prisma.$transaction([
        prisma.financeTransaction.findMany({
            where,
            include: includeRelations,
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.financeTransaction.count({ where }),
    ]);

    return {
        transactions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getFinanceTransactionById(
    id: string,
    options?: { includeDeleted?: boolean }
) {
    const includeDeleted = options?.includeDeleted ?? false;

    const transaction = await prisma.financeTransaction.findFirst({
        where: {
            id,
            ...(includeDeleted ? {} : { deletedAt: null }),
        },
        include: includeRelations,
    });

    if (!transaction) {
        throw new FinanceTransactionServiceError(
            "Finance transaction not found.",
            404
        );
    }

    return transaction;
}

export async function createFinanceTransaction(
    data: CreateFinanceTransactionInput,
    auditUserId?: string
) {
    if (!auditUserId) {
        throw new Error("auditUserId is required to create a finance transaction.");
    }

    const payload = resolveTransactionPayload(data);

    const transaction = await prisma.financeTransaction.create({
        data: {
            ...payload,
            amount: payload.amount,
            paidAmount: payload.paidAmount,
            pendingAmount: payload.pendingAmount,
            categoryId: payload.categoryId ?? undefined,
            companyId: payload.companyId ?? undefined,
            sourceImportId: payload.sourceImportId ?? undefined,
            createdById: auditUserId,
            transactionDate: data.transactionDate,
            dueDate: data.dueDate ?? undefined,
            paidAt: data.paidAt ?? undefined,
        },
        include: includeRelations,
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: "CREATE",
            resource: "FinanceTransaction",
            resourceId: transaction.id,
            metadata: {
                amount: transaction.amount.toString(),
                type: transaction.type,
                invoiceNumber: transaction.invoiceNumber,
                description: transaction.description,
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return transaction;
}

export async function updateFinanceTransaction(
    id: string,
    data: UpdateFinanceTransactionInput,
    auditUserId?: string
) {
    const existing = await prisma.financeTransaction.findFirst({
        where: { id, deletedAt: null },
    });

    if (!existing) {
        throw new FinanceTransactionServiceError(
            "Finance transaction not found.",
            404
        );
    }

    const payload = resolveTransactionPayload({
        ...existing,
        ...data,
        amount: data.amount ?? Number(existing.amount),
        paidAmount: data.paidAmount ?? Number(existing.paidAmount),
        pendingAmount: data.pendingAmount ?? Number(existing.pendingAmount),
        status: data.status ?? existing.status,
        createdById: existing.createdById,
        currency: data.currency ?? existing.currency,
        transactionDate: data.transactionDate ?? existing.transactionDate,
        dueDate: data.dueDate ?? existing.dueDate,
        paidAt: data.paidAt ?? existing.paidAt,
        categoryId: data.categoryId ?? existing.categoryId,
        companyId: data.companyId ?? existing.companyId,
    });

    const transaction = await prisma.financeTransaction.update({
        where: { id },
        data: {
            ...payload,
            amount: payload.amount,
            paidAmount: payload.paidAmount,
            pendingAmount: payload.pendingAmount,
            categoryId: payload.categoryId ?? undefined,
            companyId: payload.companyId ?? undefined,
            sourceImportId: payload.sourceImportId ?? undefined,
            transactionDate: data.transactionDate ?? existing.transactionDate,
            dueDate: data.dueDate ?? existing.dueDate,
            paidAt: data.paidAt ?? existing.paidAt,
            reference: payload.reference ?? undefined,
            description: payload.description ?? undefined,
            notes: payload.notes ?? undefined,
            invoiceNumber: payload.invoiceNumber ?? undefined,
            invoiceReference: payload.invoiceReference ?? undefined,
        },
        include: includeRelations,
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: "UPDATE",
            resource: "FinanceTransaction",
            resourceId: transaction.id,
            metadata: {
                changes: {
                    amount: data.amount !== undefined ? transaction.amount.toString() : undefined,
                    status: data.status !== undefined ? transaction.status : undefined,
                    paidAmount: data.paidAmount !== undefined ? transaction.paidAmount.toString() : undefined,
                },
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return transaction;
}

export async function archiveFinanceTransaction(
    id: string,
    auditUserId?: string
) {
    const existing = await prisma.financeTransaction.findFirst({
        where: { id, deletedAt: null },
    });

    if (!existing) {
        throw new FinanceTransactionServiceError(
            "Finance transaction not found.",
            404
        );
    }

    const transaction = await prisma.financeTransaction.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
        include: includeRelations,
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: "ARCHIVE",
            resource: "FinanceTransaction",
            resourceId: transaction.id,
            metadata: {
                amount: transaction.amount.toString(),
                type: transaction.type,
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return transaction;
}

export async function restoreFinanceTransaction(
    id: string,
    auditUserId?: string
) {
    const existing = await prisma.financeTransaction.findFirst({
        where: { id, deletedAt: { not: null } },
    });

    if (!existing) {
        throw new FinanceTransactionServiceError(
            "Archived finance transaction not found.",
            404
        );
    }

    const transaction = await prisma.financeTransaction.update({
        where: { id },
        data: {
            deletedAt: null,
        },
        include: includeRelations,
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: "RESTORE",
            resource: "FinanceTransaction",
            resourceId: transaction.id,
            metadata: {
                amount: transaction.amount.toString(),
                type: transaction.type,
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return transaction;
}

export async function deleteFinanceTransaction(
    id: string,
    auditUserId?: string
) {
    const existing = await prisma.financeTransaction.findFirst({
        where: { id },
    });

    if (!existing) {
        throw new FinanceTransactionServiceError(
            "Finance transaction not found.",
            404
        );
    }

    const transaction = await prisma.financeTransaction.delete({
        where: { id },
        include: includeRelations,
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: "PERMANENTLY_DELETE",
            resource: "FinanceTransaction",
            resourceId: transaction.id,
            metadata: {
                amount: transaction.amount.toString(),
                type: transaction.type,
                invoiceNumber: transaction.invoiceNumber,
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return transaction;
}
