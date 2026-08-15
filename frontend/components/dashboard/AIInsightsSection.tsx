import AIInsightCard from "./AIInsightCard";

interface AIInsightsSectionProps {
    stats: any;
}

export default function AIInsightsSection({ stats }: AIInsightsSectionProps) {
    const { current, comparisons } = stats || {};

    const generateInsights = () => {
        const insights: string[] = [];

        if (current?.projects?.projects?.overdue > 0) {
            insights.push(`You have ${current.projects.projects.overdue} overdue projects needing attention.`);
        }

        if (current?.projects?.tasks?.overdue > 0) {
            insights.push(`${current.projects.tasks.overdue} tasks are overdue this period.`);
        }

        if (comparisons?.revenue > 0) {
            insights.push(`Great job! Revenue is up ${comparisons.revenue}% compared to last period.`);
        } else if (comparisons?.revenue < 0) {
            insights.push(`Revenue is down ${Math.abs(comparisons.revenue)}% compared to last period.`);
        }

        if (current?.crm?.leads?.total > 0) {
            insights.push(`You acquired ${current.crm.leads.total} new leads this period. Make sure to follow up!`);
        }

        if (insights.length === 0) {
            insights.push("Keep up the good work! Your workspace is looking healthy.");
            insights.push("Consider creating a new project or reaching out to a new lead.");
        }

        return insights.slice(0, 3); // Max 3 insights
    };

    const dynamicInsights = generateInsights();

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
                insights={dynamicInsights}
            />
        </section>
    );
}