import {
    CircleDollarSign,
    Handshake,
    UserPlus,
    Users,
} from "lucide-react";

import { WorkspaceCard } from "@/components/workspace/ui";

interface CRMMetricCardsProps {
    metrics: {
        contacts: number;
        activeLeads: number;
        openDeals: number;
        pipelineValue: number;
    };
}

export default function CRMMetricCards({
    metrics,
}: CRMMetricCardsProps) {
    const cards = [
        {
            title: "Contacts",
            value: metrics.contacts.toLocaleString(),
            description: "Total contacts",
            icon: Users,
        },
        {
            title: "Active Leads",
            value: metrics.activeLeads.toLocaleString(),
            description: "Currently active",
            icon: UserPlus,
        },
        {
            title: "Open Deals",
            value: metrics.openDeals.toLocaleString(),
            description: "Currently open",
            icon: Handshake,
        },
        {
            title: "Pipeline Value",
            value: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
            }).format(metrics.pipelineValue),
            description: "Total open value",
            icon: CircleDollarSign,
        },
    ];

    return (
        <section
            aria-label="CRM metrics"
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <WorkspaceCard
                        key={card.title}
                        className="p-4"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                                    {card.title}
                                </p>

                                <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                                    {card.value}
                                </p>

                                <p className="mt-1 text-[11px] text-[var(--workspace-text-subtle)]">
                                    {card.description}
                                </p>
                            </div>

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[var(--workspace-primary-soft)]
                                    text-[var(--workspace-primary)]
                                "
                            >
                                <Icon
                                    className="h-4 w-4"
                                    strokeWidth={1.8}
                                />
                            </div>
                        </div>
                    </WorkspaceCard>
                );
            })}
        </section>
    );
}