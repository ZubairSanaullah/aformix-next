import ChartCard from "./ChartCard";
import ProjectGrowthChart from "./ProjectGrowthChart";

export default function AnalyticsSection() {
    return (
        <section>
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                        Performance
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Track how your workspace is growing over time.
                    </p>
                </div>

                <button
                    type="button"
                    className="
                        hidden
                        text-[10px]
                        font-medium
                        text-[var(--workspace-text-muted)]
                        transition-colors
                        hover:text-[var(--workspace-primary)]
                        sm:block
                    "
                >
                    View analytics
                </button>
            </div>

            <ChartCard
                title="Workspace Growth"
                description="Project activity over the last five months."
            >
                <ProjectGrowthChart />
            </ChartCard>
        </section>
    );
}