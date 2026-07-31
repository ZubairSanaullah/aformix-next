import DashboardHero from "@/components/dashboard/DashboardHero";
import StatsSection from "@/components/dashboard/StatsSection";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import QuickActionsSection from "@/components/dashboard/QuickActionsSection";
import ActivitySection from "@/components/dashboard/ActivitySection";
import AIInsightsSection from "@/components/dashboard/AIInsightsSection";

export default function WorkspacePage() {
  return (
    <div className="space-y-10 py-8">

      {/* Hero */}
      <DashboardHero />


      {/* Stats */}
      <StatsSection />


      {/* Analytics */}
      <AnalyticsSection />


      {/* Quick Actions */}
      <QuickActionsSection />

      {/* Recent Activity */}
      <ActivitySection />

      {/* AI Insights */}
      <AIInsightsSection />

    </div>
  );
}