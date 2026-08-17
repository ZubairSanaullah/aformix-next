import {
    Archive,
    Eye,
    FileText,
    Globe,
    LayoutGrid,
    Star,
} from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import type { PortfolioStats } from "@/lib/services/portfolio-stats";

interface PortfolioStatsCardsProps {
    stats: PortfolioStats;
}

export default function PortfolioStatsCards({
    stats,
}: PortfolioStatsCardsProps) {
    const cards = [
        {
            label: "Total projects",
            value: stats.totalProjects,
            icon: LayoutGrid,
        },
        {
            label: "Published",
            value: stats.publishedProjects,
            icon: Globe,
        },
        {
            label: "Draft",
            value: stats.draftProjects,
            icon: FileText,
        },
        {
            label: "Archived",
            value: stats.archivedProjects,
            icon: Archive,
        },
        {
            label: "Featured",
            value: stats.featuredProjects,
            icon: Star,
        },
        {
            label: "Categories",
            value: stats.totalCategories,
            icon: Eye,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <WorkspaceCard key={card.label} padding="md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                    {card.label}
                                </p>
                                <p className="mt-1.5 text-xl font-semibold text-[var(--workspace-text)]">
                                    {card.value}
                                </p>
                            </div>

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                <Icon className="h-4 w-4" />
                            </div>
                        </div>
                    </WorkspaceCard>
                );
            })}
        </div>
    );
}