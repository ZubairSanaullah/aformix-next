import { FolderKanban, Users, DollarSign, Target } from "lucide-react";
import StatCard from "./StatCard";

interface StatsSectionProps {
    stats: any;
}

export default function StatsSection({ stats }: StatsSectionProps) {
    const { current, comparisons } = stats;

    const formatChange = (val: number | null | undefined) => {
        if (val === null || val === undefined) return "No data yet";
        if (val > 0) return `+${val}% from last period`;
        if (val < 0) return `${val}% from last period`;
        return "Same as last period";
    };

    const dashboardStats = [
        {
            title: "Projects",
            value: String(current?.projects?.projects?.total || 0),
            description: formatChange(comparisons?.projects),
            icon: FolderKanban,
        },
        {
            title: "Clients",
            value: String(current?.crm?.contacts?.total || 0), // Adjust if contacts isn't correct
            description: "Total contacts in CRM",
            icon: Users,
        },
        {
            title: "Revenue",
            value: `$${(current?.finance?.totalRevenue || 0).toLocaleString()}`,
            description: formatChange(comparisons?.revenue),
            icon: DollarSign,
        },
        {
            title: "Leads",
            value: String(current?.crm?.leads?.total || 0),
            description: formatChange(comparisons?.leads),
            icon: Target,
        },
    ];

    return (
        <section>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                        At a glance
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Key numbers across your workspace.
                    </p>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardStats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        {...stat}
                    />
                ))}
            </div>
        </section>
    );
}