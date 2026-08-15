import { prisma } from "@/lib/prisma";
import { getMonthsInRange } from "./utils";

export async function getAnalyticsTrends(startDate: Date, endDate: Date) {
    const months = getMonthsInRange(startDate, endDate);
    
    // Initialize periods dictionary
    const trendsData: Record<string, {
        period: string;
        revenue: number;
        expenses: number;
        pending: number;
        net: number;
        leads: number;
        deals: number;
        projectsCompleted: number;
    }> = {};

    for (const month of months) {
        trendsData[month] = {
            period: month,
            revenue: 0,
            expenses: 0,
            pending: 0,
            net: 0,
            leads: 0,
            deals: 0,
            projectsCompleted: 0
        };
    }

    // 1. Finance Transactions
    const transactions = await prisma.financeTransaction.findMany({
        where: {
            transactionDate: { gte: startDate, lte: endDate },
            deletedAt: null,
            status: { not: "CANCELLED" }
        },
        select: { type: true, amount: true, pendingAmount: true, transactionDate: true, status: true }
    });

    for (const t of transactions) {
        const year = t.transactionDate.getFullYear();
        const month = String(t.transactionDate.getMonth() + 1).padStart(2, '0');
        const period = `${year}-${month}`;

        if (trendsData[period]) {
            const amount = Number(t.amount) || 0;
            const pending = Number(t.pendingAmount) || 0;

            if (t.type === "INCOME") {
                trendsData[period].revenue += amount;
                if (t.status === "PENDING" || t.status === "PARTIALLY_PAID") {
                    trendsData[period].pending += pending;
                }
            } else if (t.type === "EXPENSE") {
                trendsData[period].expenses += amount;
            }
            trendsData[period].net = trendsData[period].revenue - trendsData[period].expenses;
        }
    }

    // 2. CRM Leads
    const leads = await prisma.lead.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true }
    });

    for (const lead of leads) {
        const year = lead.createdAt.getFullYear();
        const month = String(lead.createdAt.getMonth() + 1).padStart(2, '0');
        const period = `${year}-${month}`;
        if (trendsData[period]) trendsData[period].leads++;
    }

    // 3. CRM Deals
    const deals = await prisma.deal.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true }
    });

    for (const deal of deals) {
        const year = deal.createdAt.getFullYear();
        const month = String(deal.createdAt.getMonth() + 1).padStart(2, '0');
        const period = `${year}-${month}`;
        if (trendsData[period]) trendsData[period].deals++;
    }

    // 4. Projects Completed
    const projects = await prisma.project.findMany({
        where: { 
            completedAt: { gte: startDate, lte: endDate },
            status: "COMPLETED",
            deletedAt: null
        },
        select: { completedAt: true }
    });

    for (const project of projects) {
        if (project.completedAt) {
            const year = project.completedAt.getFullYear();
            const month = String(project.completedAt.getMonth() + 1).padStart(2, '0');
            const period = `${year}-${month}`;
            if (trendsData[period]) trendsData[period].projectsCompleted++;
        }
    }

    // Return array ordered by period
    return Object.values(trendsData).sort((a, b) => a.period.localeCompare(b.period));
}
