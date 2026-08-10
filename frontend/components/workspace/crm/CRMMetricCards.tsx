import {
    CircleDollarSign,
    Handshake,
    UserPlus,
    Users,
} from "lucide-react";

import { WorkspaceCard } from "@/components/workspace/ui";

const metrics = [
    {
        title: "Contacts",
        value: "0",
        description: "Total contacts",
        icon: Users,
    },
    {
        title: "Active Leads",
        value: "0",
        description: "Currently active",
        icon: UserPlus,
    },
    {
        title: "Open Deals",
        value: "0",
        description: "Currently open",
        icon: Handshake,
    },
    {
        title: "Pipeline Value",
        value: "$0",
        description: "Total open value",
        icon: CircleDollarSign,
    },
];

export default function CRMMetricCards() {
    return (
        <section
            aria-label="CRM metrics"
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
            {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                    <WorkspaceCard key={metric.title} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                                    {metric.title}
                                </p>

                                <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                                    {metric.value}
                                </p>

                                <p className="mt-1 text-[11px] text-[var(--workspace-text-subtle)]">
                                    {metric.description}
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
                                <Icon className="h-4 w-4" strokeWidth={1.8} />
                            </div>
                        </div>
                    </WorkspaceCard>
                );
            })}
        </section>
    );
}