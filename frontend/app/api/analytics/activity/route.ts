import { NextResponse } from "next/server";
import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { getActivityAnalytics } from "@/lib/services/analytics/activity";
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

        const current = await getActivityAnalytics(startDate, endDate);
        let previous = null;
        let comparisons = null;

        if (compare) {
            const { prevStartDate, prevEndDate } = getPreviousPeriod(startDate, endDate);
            previous = await getActivityAnalytics(prevStartDate, prevEndDate);

            comparisons = {
                activities: calculatePercentageChange(current.activity.total, previous.activity.total),
                completedActivities: calculatePercentageChange(current.activity.completed, previous.activity.completed),
                events: calculatePercentageChange(current.calendar.total, previous.calendar.total),
                completedEvents: calculatePercentageChange(current.calendar.completed, previous.calendar.completed),
            };
        }

        return NextResponse.json({ 
            data: { current, previous, comparisons } 
        }, { status: 200 });
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error("[ANALYTICS_ACTIVITY_API]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
