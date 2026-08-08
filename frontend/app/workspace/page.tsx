import DashboardHero from "@/components/dashboard/DashboardHero";
import StatsSection from "@/components/dashboard/StatsSection";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import QuickActionsSection from "@/components/dashboard/QuickActionsSection";
import ActivitySection from "@/components/dashboard/ActivitySection";
import AIInsightsSection from "@/components/dashboard/AIInsightsSection";

export default function WorkspacePage() {
  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="space-y-8">
        <DashboardHero />

        <StatsSection />

        <AnalyticsSection />

        <QuickActionsSection />

        <ActivitySection />

        <AIInsightsSection />
      </div>
    </div>
  );
}