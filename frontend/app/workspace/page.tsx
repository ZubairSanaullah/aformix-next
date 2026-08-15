import DashboardHero from "@/components/dashboard/DashboardHero";
import StatsSection from "@/components/dashboard/StatsSection";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import QuickActionsSection from "@/components/dashboard/QuickActionsSection";
import ActivitySection from "@/components/dashboard/ActivitySection";
import AIInsightsSection from "@/components/dashboard/AIInsightsSection";
import AutoRefresh from "@/components/dashboard/AutoRefresh";
import { getAnalyticsOverview } from "@/lib/services/analytics/overview";
import { getActivities } from "@/lib/services/activity";

export default async function WorkspacePage() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const overview = await getAnalyticsOverview(startDate, endDate, true);
  const recentActivities = await getActivities();
  const activities = recentActivities.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <AutoRefresh interval={30000} />
      <div className="space-y-8">
        <DashboardHero />
        <StatsSection stats={overview} />
        <AnalyticsSection />
        <QuickActionsSection />
        <ActivitySection activities={activities} />
        <AIInsightsSection stats={overview} />
      </div>
    </div>
  );
}