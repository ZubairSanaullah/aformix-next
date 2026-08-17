"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchAnalyticsData } from "./actions";
import { DateRangeValue } from "@/components/workspace/analytics/AnalyticsDateRange";
import AnalyticsHeader from "@/components/workspace/analytics/AnalyticsHeader";
import AnalyticsOverview from "@/components/workspace/analytics/AnalyticsOverview";
import AnalyticsFinance from "@/components/workspace/analytics/AnalyticsFinance";
import AnalyticsCRM from "@/components/workspace/analytics/AnalyticsCRM";
import AnalyticsProjects from "@/components/workspace/analytics/AnalyticsProjects";
import AnalyticsContent from "@/components/workspace/analytics/AnalyticsContent";
import AnalyticsActivity from "@/components/workspace/analytics/AnalyticsActivity";
import AnalyticsTrendChart from "@/components/workspace/analytics/AnalyticsTrendChart";
import AnalyticsTopPerformers, { TopPerformerItem } from "@/components/workspace/analytics/AnalyticsTopPerformers";
import { trackPostHogEvent, POSTHOG_EVENTS } from "@/lib/analytics/events";

function getDatesFromPeriod(period: string, customStart?: string, customEnd?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start = new Date(today);
    let end = new Date(today);
    end.setHours(23, 59, 59, 999);

    switch (period) {
        case "today":
            break;
        case "yesterday":
            start.setDate(start.getDate() - 1);
            end.setDate(end.getDate() - 1);
            break;
        case "this_week":
            const day = start.getDay() || 7; // Get current day number, converting Sun. to 7
            if (day !== 1) start.setHours(-24 * (day - 1)); // Set to Monday
            break;
        case "last_week":
            const lastWeekDay = start.getDay() || 7;
            start.setHours(-24 * (lastWeekDay - 1 + 7));
            end = new Date(start);
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;
        case "this_month":
            start.setDate(1);
            break;
        case "last_month":
            start.setMonth(start.getMonth() - 1);
            start.setDate(1);
            end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            end.setHours(23, 59, 59, 999);
            break;
        case "this_quarter":
            const quarterMonth = Math.floor(start.getMonth() / 3) * 3;
            start.setMonth(quarterMonth, 1);
            break;
        case "last_quarter":
            const lastQuarterMonth = Math.floor(start.getMonth() / 3) * 3 - 3;
            start.setMonth(lastQuarterMonth, 1);
            end = new Date(start);
            end.setMonth(end.getMonth() + 3);
            end.setDate(0);
            end.setHours(23, 59, 59, 999);
            break;
        case "this_year":
            start.setMonth(0, 1);
            break;
        case "last_year":
            start.setFullYear(start.getFullYear() - 1, 0, 1);
            end = new Date(start);
            end.setFullYear(end.getFullYear(), 11, 31);
            end.setHours(23, 59, 59, 999);
            break;
        case "custom":
            if (customStart) start = new Date(customStart);
            if (customEnd) {
                end = new Date(customEnd);
                end.setHours(23, 59, 59, 999);
            }
            break;
    }

    return { startDate: start, endDate: end };
}

// The analytics data shape is validated by the server action and the
// analytics service layer. We store it as `unknown` here and cast at
// the component boundary — the child components enforce their own types.
// This avoids duplicating the full type tree in this orchestration layer.
type AnalyticsResult = Awaited<ReturnType<typeof fetchAnalyticsData>>;

export default function AnalyticsDashboardClient() {
    const [dateRange, setDateRange] = useState<DateRangeValue>({
        period: "this_month",
    });
    const [compare, setCompare] = useState(true);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [data, setData] = useState<AnalyticsResult | null>(null);
    const viewTrackedRef = useRef(false);

    const loadData = useCallback(async (isInitial = false) => {
        if (isInitial) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const { startDate, endDate } = getDatesFromPeriod(
                dateRange.period,
                dateRange.startDate,
                dateRange.endDate
            );

            // Fetch data via server action
            const result = await fetchAnalyticsData(
                startDate.toISOString(),
                endDate.toISOString(),
                compare
            );

            setData(result);
        } catch (error) {
            console.error("Failed to fetch analytics data", error);
            toast.error("Failed to load analytics data");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [dateRange, compare]);

    useEffect(() => {
        // If custom period is selected but dates are missing, don't fetch yet
        if (dateRange.period === "custom" && (!dateRange.startDate || !dateRange.endDate)) {
            return;
        }
        
        loadData(true);
    }, [dateRange, compare, loadData]);

    // Track analytics_viewed once per mount (not on every filter change)
    useEffect(() => {
        if (viewTrackedRef.current) return;
        viewTrackedRef.current = true;
        trackPostHogEvent(POSTHOG_EVENTS.ANALYTICS_VIEWED, {
            date_range: dateRange.period,
            compare_enabled: compare,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRefresh = () => {
        loadData(false);
    };

    const topLeadSources: TopPerformerItem[] = data?.overview?.current?.crm?.leads?.sources
        ?.slice(0, 5)
        ?.map((item) => ({
            id: item.source,
            name: item.source,
            value: item.leadCount,
        })) || [];

    const topProjects: TopPerformerItem[] = data?.overview?.current?.projects?.projects?.byStatus
        ?.slice(0, 5)
        ?.map((item) => ({
            id: item.status,
            name: item.status,
            value: item.count,
            subtitle: "Projects"
        })) || [];

    return (
        <div className="space-y-6 pb-12">
            <AnalyticsHeader
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                compare={compare}
                onCompareChange={setCompare}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing || isLoading}
            />

            <AnalyticsOverview 
                key={`overview-${isLoading ? 'loading' : 'loaded'}`}
                data={data?.overview} 
                isLoading={isLoading} 
            />

            <AnalyticsFinance 
                key={`finance-${isLoading ? 'loading' : 'loaded'}`}
                data={data?.overview?.current?.finance} 
                trendsData={data?.trends}
                isLoading={isLoading} 
            />

            <AnalyticsTrendChart
                key={`trend-${isLoading ? 'loading' : 'loaded'}`}
                data={data?.trends}
                isLoading={isLoading}
            />

            <AnalyticsCRM 
                key={`crm-${isLoading ? 'loading' : 'loaded'}`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={data?.overview?.current?.crm as any} 
                isLoading={isLoading} 
            />

            <AnalyticsProjects 
                key={`projects-${isLoading ? 'loading' : 'loaded'}`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={data?.overview?.current?.projects as any} 
                isLoading={isLoading} 
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AnalyticsContent 
                    key={`content-${isLoading ? 'loading' : 'loaded'}`}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data={data?.overview?.current?.content as any} 
                    isLoading={isLoading} 
                />
                
                <AnalyticsActivity 
                    key={`activity-${isLoading ? 'loading' : 'loaded'}`}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data={data?.overview?.current?.activity as any} 
                    isLoading={isLoading} 
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AnalyticsTopPerformers 
                    key={`top-leads-${isLoading ? 'loading' : 'loaded'}`}
                    title="Lead Sources" 
                    items={topLeadSources} 
                    isLoading={isLoading} 
                />
                
                <AnalyticsTopPerformers 
                    key={`top-projects-${isLoading ? 'loading' : 'loaded'}`}
                    title="Project Statuses" 
                    items={topProjects} 
                    isLoading={isLoading} 
                />
            </div>
        </div>
    );
}
