import { NextResponse } from "next/server";
import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { getFinanceAnalytics } from "@/lib/services/analytics/finance";
import { analyticsQuerySchema } from "@/lib/validations/analytics";
import { getDateRange, getPreviousPeriod, calculatePercentageChange } from "@/lib/services/analytics/utils";

export async function GET(request: Request) {
    try {
        await requireAdmin();

        const url = new URL(request.url);
        const periodParam = url.searchParams.get("period") || undefined;
        const startDateParam = url.searchParams.get("startDate") || undefined;
        const endDateParam = url.searchParams.get("endDate") || undefined;
        const compare = url.searchParams.get("compare") === "true";

        const parsed = analyticsQuerySchema.safeParse({
            period: periodParam,
            startDate: startDateParam,
            endDate: endDateParam,
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid date range parameters", details: parsed.error.format() },
                { status: 400 }
            );
        }

        const { period, startDate: parsedStart, endDate: parsedEnd } = parsed.data;
        const { startDate, endDate } = getDateRange(period, parsedStart, parsedEnd);

        const current = await getFinanceAnalytics(startDate, endDate);
        let previous = null;
        let comparisons = null;

        if (compare) {
            const { prevStartDate, prevEndDate } = getPreviousPeriod(startDate, endDate);
            previous = await getFinanceAnalytics(prevStartDate, prevEndDate);

            comparisons = {
                revenue: calculatePercentageChange(current.totalRevenue, previous.totalRevenue),
                expenses: calculatePercentageChange(current.totalExpenses, previous.totalExpenses),
                netIncome: calculatePercentageChange(current.netIncome, previous.netIncome),
                pending: calculatePercentageChange(current.totalPending, previous.totalPending)
            };
        }

        return NextResponse.json({ 
            data: { current, previous, comparisons } 
        }, { status: 200 });
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error("[ANALYTICS_FINANCE_API]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
