import {
    Activity,
    ArrowRight,
    UserPlus,
} from "lucide-react";

import {
    WorkspaceCard,
    WorkspaceSectionHeader,
} from "@/components/workspace/ui";

const activities = [
    {
        type: "contact",
        title: "New contact added",
        description: "No recent activity",
        time: "—",
    },
    {
        type: "deal",
        title: "Deal activity",
        description: "No recent activity",
        time: "—",
    },
    {
        type: "follow-up",
        title: "Follow-up",
        description: "No recent activity",
        time: "—",
    },
];

export default function CRMRecentActivity() {
    return (
        <WorkspaceCard className="p-5">
            <WorkspaceSectionHeader
                title="Recent Activity"
                description="Stay up to date with recent CRM activity."
            />

            <div className="mt-5 space-y-1">
                {activities.map((activity) => {
                    const Icon =
                        activity.type === "contact"
                            ? UserPlus
                            : activity.type === "deal"
                                ? ArrowRight
                                : Activity;

                    return (
                        <div
                            key={activity.type}
                            className="
                flex
                items-center
                gap-3
                rounded-lg
                px-2
                py-2.5
              "
                        >
                            <div
                                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[var(--workspace-primary-soft)]
                  text-[var(--workspace-primary)]
                "
                            >
                                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-[var(--workspace-text)]">
                                    {activity.title}
                                </p>

                                <p className="mt-0.5 truncate text-[11px] text-[var(--workspace-text-subtle)]">
                                    {activity.description}
                                </p>
                            </div>

                            <span className="shrink-0 text-[10px] text-[var(--workspace-text-subtle)]">
                                {activity.time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </WorkspaceCard>
    );
}