import { describe, expect, it } from "vitest";

import {
    normalizeFinanceImportRow,
    summarizeFinanceTransactions,
} from "./finance-reports";

describe("finance reporting service", () => {
    it("normalizes imported row values into a transaction payload", () => {
        const parsed = normalizeFinanceImportRow({
            type: "INCOME",
            amount: "125.50",
            paidAmount: "25",
            reference: "INV-1001",
            description: "Website retainer",
            currency: "usd",
            transactionDate: "2026-08-10",
            category: "Retainer",
        });

        expect(parsed.type).toBe("INCOME");
        expect(parsed.amount).toBe(125.5);
        expect(parsed.paidAmount).toBe(25);
        expect(parsed.pendingAmount).toBe(100.5);
        expect(parsed.currency).toBe("USD");
        expect(parsed.reference).toBe("INV-1001");
    });

    it("summarizes transactions into totals and balance metrics", () => {
        const summary = summarizeFinanceTransactions([
            { type: "INCOME", amount: 500, paidAmount: 500, pendingAmount: 0 },
            { type: "INCOME", amount: 250, paidAmount: 100, pendingAmount: 150 },
            { type: "EXPENSE", amount: 300, paidAmount: 300, pendingAmount: 0 },
            { type: "EXPENSE", amount: 150, paidAmount: 50, pendingAmount: 100 },
        ]);

        expect(summary.totalIncome).toBe(750);
        expect(summary.totalExpenses).toBe(450);
        expect(summary.netCashFlow).toBe(300);
        expect(summary.totalCollected).toBe(950);
        expect(summary.totalPending).toBe(250);
    });
});
