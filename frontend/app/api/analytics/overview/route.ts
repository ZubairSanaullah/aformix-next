import { NextResponse } from "next/server";
import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { getAnalyticsOverview } from "@/lib/services/analytics/overview";
import { analyticsQuerySchema } from "@/lib/validations/analytics";
import { getDateRange } from "@/lib/services/analytics/utils";

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

        const data = await getAnalyticsOverview(startDate, endDate, compare);

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error("[ANALYTICS_OVERVIEW_API]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
