"use server";

import { requireAdmin } from "@/lib/auth/authorization";
import { getAnalyticsOverview } from "@/lib/services/analytics/overview";
import { getAnalyticsTrends } from "@/lib/services/analytics/trends";

export async function fetchAnalyticsData(startDateStr: string, endDateStr: string, compare: boolean = false) {
    await requireAdmin();

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const overview = await getAnalyticsOverview(startDate, endDate, compare);
    
    // We get trend data for finance and business trend charts
    const trends = await getAnalyticsTrends(startDate, endDate);

    return {
        overview,
        trends
    };
}
