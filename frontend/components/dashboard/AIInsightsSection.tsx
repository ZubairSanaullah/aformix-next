import SectionHeader from "@/components/ui/SectionHeader";

import { aiInsights } from "@/constants/dashboard";

import AIInsightCard from "./AIInsightCard";

export default function AIInsightsSection() {
    return (
        <section className="space-y-6">
            <SectionHeader
                title="AI Insights"
                description="Smart recommendations for your workspace."
            />

            <AIInsightCard
                title="Workspace Growth Opportunities"
                description="AI analyzed your workspace activity and found these suggestions."
                insights={aiInsights}
            />
        </section>
    );
}