import { prisma } from "@/lib/prisma";

export async function getFinanceAnalytics(startDate: Date, endDate: Date) {
    const transactions = await prisma.financeTransaction.findMany({
        where: {
            transactionDate: {
                gte: startDate,
                lte: endDate,
            },
            deletedAt: null,
            status: {
                not: "CANCELLED"
            }
        },
        select: {
            type: true,
            status: true,
            amount: true,
            paidAmount: true,
            pendingAmount: true,
        }
    });

    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalPending = 0;
    let outstandingAmount = 0;
    let paidIncome = 0;

    for (const t of transactions) {
        const amount = Number(t.amount) || 0;
        const paid = Number(t.paidAmount) || 0;
        const pending = Number(t.pendingAmount) || 0;

        if (t.type === "INCOME") {
            totalRevenue += amount;
            paidIncome += paid;
            outstandingAmount += pending;
            if (t.status === "PENDING" || t.status === "PARTIALLY_PAID") {
                totalPending += pending;
            }
        } else if (t.type === "EXPENSE") {
            totalExpenses += amount;
        }
    }

    const netIncome = totalRevenue - totalExpenses;
    const collectionRate = totalRevenue > 0 ? (paidIncome / totalRevenue) * 100 : 0;

    return {
        totalRevenue,
        totalExpenses,
        totalPending,
        netIncome,
        collectionRate: Number(collectionRate.toFixed(2)),
        outstandingAmount
    };
}
