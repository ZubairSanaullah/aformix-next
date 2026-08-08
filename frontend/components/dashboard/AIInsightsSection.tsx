import { aiInsights } from "@/constants/dashboard";

import AIInsightCard from "./AIInsightCard";

export default function AIInsightsSection() {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                    AI Insights
                </h2>

                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    Suggestions based on your workspace activity.
                </p>
            </div>

            <AIInsightCard
                title="Workspace Growth Opportunities"
                description="AI analyzed your workspace activity and found these suggestions."
                insights={aiInsights}
            />
        </section>
    );
}