import { Prisma, FinanceImportStatus } from "@prisma/client";

import { prisma } from "../prisma";
import { createFinanceAuditLog } from "./finance-audit";

export interface ImportProcessResult {
    importId: string;
    totalRows: number;
    successfulRows: number;
    failedRows: number;
    skippedRows: number;
    errorSummary: string | null;
    errors: Array<{
        rowNumber: number;
        error: string;
        data?: Record<string, unknown>;
    }>;
}

export interface ImportRowData {
    type?: string;
    amount?: string | number;
    paidAmount?: string | number;
    reference?: string;
    invoiceNumber?: string;
    invoiceReference?: string;
    description?: string;
    notes?: string;
    currency?: string;
    transactionDate?: string;
    dueDate?: string;
    paidAt?: string;
    categoryName?: string;
    companyName?: string;
    [key: string]: unknown;
}

export async function normalizeAndValidateImportRow(
    row: ImportRowData,
    rowNumber: number,
    categoryMap: Map<string, string>,
    companyMap: Map<string, string>
): Promise<{ valid: boolean; error?: string; data?: Record<string, unknown> }> {
    const errors: string[] = [];

    const type = row.type?.toString().toUpperCase();
    if (!type || !["INCOME", "EXPENSE"].includes(type)) {
        errors.push("Transaction type must be INCOME or EXPENSE");
    }

    const amountRaw = row.amount?.toString().replace(/[$,]/g, "");
    const amount = Number(amountRaw);
    if (!amountRaw || isNaN(amount) || amount <= 0) {
        errors.push("Amount must be a positive number");
    }

    const transactionDateRaw = row.transactionDate?.toString();
    if (!transactionDateRaw) {
        errors.push("Transaction date is required");
    }

    if (errors.length > 0) {
        return {
            valid: false,
            error: errors.join("; "),
            data: row,
        };
    }

    const paidAmountRaw = row.paidAmount?.toString().replace(/[$,]/g, "") ?? "0";
    const paidAmount = Number(paidAmountRaw);
    if (isNaN(paidAmount) || paidAmount < 0) {
        return {
            valid: false,
            error: "Paid amount must be a non-negative number",
            data: row,
        };
    }

    if (paidAmount > amount) {
        return {
            valid: false,
            error: "Paid amount cannot exceed total amount",
            data: row,
        };
    }

    const categoryName = row.categoryName?.toString().trim();
    let categoryId = null;
    if (categoryName) {
        categoryId = categoryMap.get(categoryName.toLowerCase());
        if (!categoryId) {
            return {
                valid: false,
                error: `Category "${categoryName}" not found in system`,
                data: row,
            };
        }
    }

    const companyName = row.companyName?.toString().trim();
    let companyId = null;
    if (companyName) {
        companyId = companyMap.get(companyName.toLowerCase());
        if (!companyId) {
            return {
                valid: false,
                error: `Company "${companyName}" not found in system`,
                data: row,
            };
        }
    }

    return {
        valid: true,
        data: {
            type,
            amount: Number(amount.toFixed(2)),
            paidAmount: Number(paidAmount.toFixed(2)),
            pendingAmount: Number((amount - paidAmount).toFixed(2)),
            reference: row.reference?.toString().trim() || null,
            invoiceNumber: row.invoiceNumber?.toString().trim() || null,
            invoiceReference: row.invoiceReference?.toString().trim() || null,
            description: row.description?.toString().trim() || null,
            notes: row.notes?.toString().trim() || null,
            currency: (row.currency?.toString().trim().toUpperCase() || "USD"),
            transactionDate: new Date(transactionDateRaw!),
            dueDate: row.dueDate ? new Date(row.dueDate.toString()) : null,
            paidAt: row.paidAt ? new Date(row.paidAt.toString()) : null,
            categoryId: categoryId || null,
            companyId: companyId || null,
        },
    };
}

export async function getFinanceImportById(importId: string) {
    return prisma.financeImport.findUnique({
        where: { id: importId },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            transactions: {
                select: {
                    id: true,
                    reference: true,
                    amount: true,
                    status: true,
                    createdAt: true,
                },
            },
        },
    });
}

export async function getFinanceImports(
    page: number = 1,
    limit: number = 20,
    status?: FinanceImportStatus
) {
    const where: Prisma.FinanceImportWhereInput = {
        ...(status ? { status } : {}),
    };

    const [imports, total] = await prisma.$transaction([
        prisma.financeImport.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
        prisma.financeImport.count({ where }),
    ]);

    return {
        imports,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function createFinanceImport(
    filename: string,
    originalFilename: string,
    createdById: string,
    options?: {
        fileSize?: number;
        mimeType?: string;
        sourceHash?: string;
        sheetName?: string;
    },
    auditUserId?: string
) {
    const financeImport = await prisma.financeImport.create({
        data: {
            filename,
            originalFilename,
            createdById,
            fileSize: options?.fileSize,
            mimeType: options?.mimeType,
            sourceHash: options?.sourceHash,
            sheetName: options?.sheetName,
            status: "UPLOADED",
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: "CREATE_IMPORT",
            resource: "FinanceImport",
            resourceId: financeImport.id,
            metadata: {
                filename: financeImport.filename,
                originalFilename: financeImport.originalFilename,
                mimeType: financeImport.mimeType,
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return financeImport;
}

export async function updateFinanceImportStatus(
    importId: string,
    status: "PROCESSING" | "COMPLETED" | "PARTIAL" | "FAILED",
    result?: {
        totalRows: number;
        successfulRows: number;
        failedRows: number;
        skippedRows: number;
        errorSummary?: string;
    },
    auditUserId?: string
) {
    const financeImport = await prisma.financeImport.update({
        where: { id: importId },
        data: {
            status,
            ...(result && {
                totalRows: result.totalRows,
                successfulRows: result.successfulRows,
                failedRows: result.failedRows,
                skippedRows: result.skippedRows,
                errorSummary: result.errorSummary || null,
                startedAt: new Date(),
                completedAt: new Date(),
            }),
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    if (auditUserId) {
        await createFinanceAuditLog({
            userId: auditUserId,
            action: `IMPORT_${status}`,
            resource: "FinanceImport",
            resourceId: financeImport.id,
            metadata: {
                status,
                totalRows: result?.totalRows,
                successfulRows: result?.successfulRows,
                failedRows: result?.failedRows,
            },
        }).catch((err) => {
            console.error("[AUDIT_LOG_ERROR]", err);
        });
    }

    return financeImport;
}
