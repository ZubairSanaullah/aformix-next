import { Prisma } from "@prisma/client";

import { prisma } from "../prisma";

export interface FinanceDashboardStats {
    totalTransactions: number;
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    totalCollected: number;
    totalPending: number;
    pendingOverdue: number;
    paidCount: number;
    pendingCount: number;
    partiallyPaidCount: number;
    cancelledCount: number;
    topCategories: Array<{
        id: string;
        name: string;
        type: string;
        transactionCount: number;
        totalAmount: number;
    }>;
    topCompanies: Array<{
        id: string;
        name: string;
        transactionCount: number;
        totalAmount: number;
    }>;
    recentTransactions: Array<{
        id: string;
        reference: string | null;
        amount: number;
        type: string;
        status: string;
        transactionDate: Date;
    }>;
}

export async function getFinanceDashboardStats(): Promise<FinanceDashboardStats> {
    const now = new Date();

    const [
        allTransactions,
        incomeTransactions,
        expenseTransactions,
        paidTransactions,
        pendingTransactions,
        partiallyPaidTransactions,
        cancelledTransactions,
        topCategories,
        topCompanies,
        recentTransactions,
    ] = await prisma.$transaction([
        prisma.financeTransaction.findMany({
            where: { deletedAt: null },
            select: {
                amount: true,
                paidAmount: true,
                pendingAmount: true,
                dueDate: true,
            },
        }),

        prisma.financeTransaction.findMany({
            where: { deletedAt: null, type: "INCOME" },
            select: { amount: true },
        }),

        prisma.financeTransaction.findMany({
            where: { deletedAt: null, type: "EXPENSE" },
            select: { amount: true },
        }),

        prisma.financeTransaction.count({
            where: { deletedAt: null, status: "PAID" },
        }),

        prisma.financeTransaction.count({
            where: { deletedAt: null, status: "PENDING" },
        }),

        prisma.financeTransaction.count({
            where: { deletedAt: null, status: "PARTIALLY_PAID" },
        }),

        prisma.financeTransaction.count({
            where: { deletedAt: null, status: "CANCELLED" },
        }),

        prisma.financeTransaction.groupBy({
            by: ["categoryId"],
            where: { deletedAt: null, categoryId: { not: null } },
            _count: { id: true },
            _sum: { amount: true },
            orderBy: { _count: { id: "desc" } },
            take: 5,
        }),

        prisma.financeTransaction.groupBy({
            by: ["companyId"],
            where: { deletedAt: null, companyId: { not: null } },
            _count: { id: true },
            _sum: { amount: true },
            orderBy: { _count: { id: "desc" } },
            take: 5,
        }),

        prisma.financeTransaction.findMany({
            where: { deletedAt: null },
            orderBy: { transactionDate: "desc" },
            take: 10,
            select: {
                id: true,
                reference: true,
                amount: true,
                type: true,
                status: true,
                transactionDate: true,
            },
        }),
    ]);

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalCollected = allTransactions.reduce((sum, t) => sum + Number(t.paidAmount), 0);
    const totalPending = allTransactions.reduce((sum, t) => sum + Number(t.pendingAmount), 0);
    const pendingOverdue = allTransactions.filter((t) => t.dueDate && t.dueDate < now && Number(t.pendingAmount) > 0).length;

    const topCategoriesData = await Promise.all(
        topCategories.map(async (group) => {
            const category = await prisma.financeCategory.findUnique({
                where: { id: group.categoryId ?? "" },
                select: { id: true, name: true, type: true },
            });

            return {
                id: category?.id ?? "",
                name: category?.name ?? "Unknown",
                type: category?.type ?? "ALL",
                transactionCount: (group._count as { id: number }).id ?? 0,
                totalAmount: Number((group._sum as { amount: unknown } | null)?.amount ?? 0),
            };
        })
    );

    const topCompaniesData = await Promise.all(
        topCompanies.map(async (group) => {
            const company = await prisma.company.findUnique({
                where: { id: group.companyId ?? "" },
                select: { id: true, name: true },
            });

            return {
                id: company?.id ?? "",
                name: company?.name ?? "Unknown",
                transactionCount: (group._count as { id: number }).id ?? 0,
                totalAmount: Number((group._sum as { amount: unknown } | null)?.amount ?? 0),
            };
        })
    );

    return {
        totalTransactions: allTransactions.length,
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        netCashFlow: Number((totalIncome - totalExpenses).toFixed(2)),
        totalCollected: Number(totalCollected.toFixed(2)),
        totalPending: Number(totalPending.toFixed(2)),
        pendingOverdue,
        paidCount: paidTransactions,
        pendingCount: pendingTransactions,
        partiallyPaidCount: partiallyPaidTransactions,
        cancelledCount: cancelledTransactions,
        topCategories: topCategoriesData,
        topCompanies: topCompaniesData,
        recentTransactions: recentTransactions.map((t) => ({
            ...t,
            amount: Number(t.amount),
        })),
    };
}
