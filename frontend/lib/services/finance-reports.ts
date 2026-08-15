import { Prisma } from "@prisma/client";

import { prisma } from "../prisma";
import type { FinanceReportQuery } from "../validations/finance";

export interface FinanceSummaryRow {
    type: "INCOME" | "EXPENSE";
    amount: number;
    paidAmount: number;
    pendingAmount: number;
    status?: "PENDING" | "PARTIALLY_PAID" | "PAID" | "CANCELLED";
}

export interface FinanceReportSummary {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    totalCollected: number;
    totalPending: number;
    incomeCount: number;
    expenseCount: number;
    overdueCount: number;
    paidCount: number;
    partiallyPaidCount: number;
    pendingCount: number;
}

export interface FinanceImportRow {
    type: "INCOME" | "EXPENSE";
    amount: number;
    paidAmount?: number;
    pendingAmount?: number;
    reference?: string | null;
    invoiceNumber?: string | null;
    description?: string | null;
    notes?: string | null;
    currency?: string | null;
    transactionDate: string | Date;
    dueDate?: string | Date | null;
    paidAt?: string | Date | null;
    category?: string | null;
    company?: string | null;
    createdById?: string;
    sourceImportId?: string | null;
    status?: "PENDING" | "PARTIALLY_PAID" | "PAID" | "CANCELLED";
}

export function normalizeFinanceImportRow(row: Record<string, unknown>): FinanceImportRow {
    const type = row.type === "EXPENSE" ? "EXPENSE" : "INCOME";
    const amountValue = Number(String(row.amount ?? 0).replace(/[$,]/g, ""));
    const paidValue = Number(String(row.paidAmount ?? row.paid ?? 0).replace(/[$,]/g, ""));
    const pendingValue = Number(String(row.pendingAmount ?? row.pending ?? Math.max(amountValue - paidValue, 0)).replace(/[$,]/g, ""));

    return {
        type,
        amount: Number(amountValue.toFixed(2)),
        paidAmount: Number(paidValue.toFixed(2)),
        pendingAmount: Number(pendingValue.toFixed(2)),
        reference: typeof row.reference === "string" ? row.reference.trim() || null : null,
        invoiceNumber: typeof row.invoiceNumber === "string" ? row.invoiceNumber.trim() || null : null,
        description: typeof row.description === "string" ? row.description.trim() || null : null,
        notes: typeof row.notes === "string" ? row.notes.trim() || null : null,
        currency: typeof row.currency === "string" ? row.currency.trim().toUpperCase() || "USD" : "USD",
        transactionDate: String(row.transactionDate ?? new Date()),
        dueDate: row.dueDate ? String(row.dueDate) : null,
        paidAt: row.paidAt ? String(row.paidAt) : null,
        category: typeof row.category === "string" ? row.category.trim() || null : null,
        company: typeof row.company === "string" ? row.company.trim() || null : null,
        status: row.status as FinanceImportRow["status"],
    };
}

export function summarizeFinanceTransactions(rows: FinanceSummaryRow[]): FinanceReportSummary {
    const totalIncome = rows
        .filter((row) => row.type === "INCOME")
        .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const totalExpenses = rows
        .filter((row) => row.type === "EXPENSE")
        .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const totalCollected = rows.reduce((sum, row) => sum + Number(row.paidAmount || 0), 0);
    const totalPending = rows.reduce((sum, row) => sum + Number(row.pendingAmount || 0), 0);

    const incomeCount = rows.filter((row) => row.type === "INCOME").length;
    const expenseCount = rows.filter((row) => row.type === "EXPENSE").length;
    const overdueCount = rows.filter((row) => row.status === "PENDING" && Number(row.pendingAmount || 0) > 0).length;
    const paidCount = rows.filter((row) => row.status === "PAID").length;
    const partiallyPaidCount = rows.filter((row) => row.status === "PARTIALLY_PAID").length;
    const pendingCount = rows.filter((row) => row.status === "PENDING").length;

    return {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        netCashFlow: Number((totalIncome - totalExpenses).toFixed(2)),
        totalCollected: Number(totalCollected.toFixed(2)),
        totalPending: Number(totalPending.toFixed(2)),
        incomeCount,
        expenseCount,
        overdueCount,
        paidCount,
        partiallyPaidCount,
        pendingCount,
    };
}

export async function getFinanceReport(query: FinanceReportQuery) {
    const { year, month, categoryId, companyId, compareYear } = query;

    const where: Prisma.FinanceTransactionWhereInput = {
        deletedAt: null,
        ...(categoryId ? { categoryId } : {}),
        ...(companyId ? { companyId } : {}),
        ...(year || month
            ? {
                  transactionDate: {
                      ...(year ? { gte: new Date(`${year}-01-01T00:00:00.000Z`) } : {}),
                      ...(year && month ? { lt: new Date(`${year}-${month + 1}-01T00:00:00.000Z`) } : {}),
                      ...(year && !month ? { lt: new Date(`${year + 1}-01-01T00:00:00.000Z`) } : {}),
                  },
              }
            : {}),
    };

    const transactions = await prisma.financeTransaction.findMany({
        where,
        select: {
            type: true,
            amount: true,
            paidAmount: true,
            pendingAmount: true,
            status: true,
            transactionDate: true,
        },
    });

    const rows = transactions.map((transaction) => ({
        type: transaction.type,
        amount: Number(transaction.amount.toString()),
        paidAmount: Number(transaction.paidAmount.toString()),
        pendingAmount: Number(transaction.pendingAmount.toString()),
        status: transaction.status,
    }));

    const summary = summarizeFinanceTransactions(rows);

    const comparison = compareYear
        ? await prisma.financeTransaction.groupBy({
              by: ["type"],
              where: {
                  deletedAt: null,
                  transactionDate: {
                      gte: new Date(`${compareYear}-01-01T00:00:00.000Z`),
                      lt: new Date(`${compareYear + 1}-01-01T00:00:00.000Z`),
                  },
              },
              _sum: {
                  amount: true,
              },
          })
        : [];

    return {
        summary,
        period: {
            year,
            month,
            compareYear,
        },
        comparison,
    };
}
