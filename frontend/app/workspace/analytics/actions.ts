"use server";

import { requireAdmin } from "@/lib/auth/authorization";
import { getAnalyticsOverview } from "@/lib/services/analytics/overview";
import { getAnalyticsTrends } from "@/lib/services/analytics/trends";

export async function fetchAnalyticsData(startDateStr: string, endDateStr: string, compare: boolean = false) {
    await requireAdmin();

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const [overview, trends] = await Promise.all([
        getAnalyticsOverview(startDate, endDate, compare),
        getAnalyticsTrends(startDate, endDate)
    ]);

    return {
        overview,
        trends
    };
}
