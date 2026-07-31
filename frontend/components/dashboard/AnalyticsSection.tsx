import SectionHeader from "@/components/ui/SectionHeader";

import ChartCard from "./ChartCard";
import ProjectGrowthChart from "./ProjectGrowthChart";

export default function AnalyticsSection() {
    return (
        <section className="space-y-6">
            <SectionHeader
                title="Analytics"
                description="Track your workspace performance."
            />

            <ChartCard
                title="Workspace Growth"
                description="Projects, clients, and revenue trends."
            >
                <ProjectGrowthChart />
            </ChartCard>
        </section>
    );
}