import {
    CalendarClock,
    CheckCircle2,
} from "lucide-react";

import {
    WorkspaceCard,
    WorkspaceEmptyState,
    WorkspaceSectionHeader,
} from "@/components/workspace/ui";

const activities: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
}> = [];

export default function CRMUpcomingActivities() {
    return (
        <WorkspaceCard className="p-5">
            <WorkspaceSectionHeader
                title="Upcoming Activities"
                description="Your next CRM follow-ups, meetings, and reminders."
            />

            {activities.length === 0 ? (
                <div className="mt-4">
                    <WorkspaceEmptyState
                        title="Nothing scheduled"
                        description="Upcoming CRM activities will appear here."
                    />
                </div>
            ) : (
                <div className="mt-4 space-y-2">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="
                flex
                items-center
                gap-3
                rounded-lg
                border
                border-[var(--workspace-border)]
                p-3
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
                                <CalendarClock
                                    className="h-3.5 w-3.5"
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-[var(--workspace-text)]">
                                    {activity.title}
                                </p>

                                <p className="mt-0.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                    {activity.date}
                                </p>
                            </div>

                            <CheckCircle2
                                className="h-4 w-4 shrink-0 text-[var(--workspace-text-subtle)]"
                                strokeWidth={1.7}
                            />
                        </div>
                    ))}
                </div>
            )}
        </WorkspaceCard>
    );
}