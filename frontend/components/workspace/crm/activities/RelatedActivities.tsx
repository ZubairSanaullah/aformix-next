"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, CalendarDays } from "lucide-react";

import {
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

import ActivityForm from "@/components/workspace/crm/activities/ActivityForm";
import ActivityCompleteToggle from "@/components/workspace/crm/activities/ActivityCompleteToggle";
import DeleteActivityButton from "@/components/workspace/crm/activities/DeleteActivityButton";
import ActivityStatusBadge, {
    ActivityTypeIcon,
    formatActivityType,
    type ActivityType,
} from "@/components/workspace/crm/activities/ActivityStatusBadge";

interface RelatedActivity {
    id: string;
    type: ActivityType;
    title: string;
    description?: string | null;
    dueAt: string | Date | null;
    completedAt: string | Date | null;
}

interface RelatedActivitiesProps {
    activities: RelatedActivity[];
    // Exactly one of these should be set to the current record's id,
    // so newly logged activities attach to it automatically.
    defaultRelation: {
        contactId?: string;
        companyId?: string;
        leadId?: string;
        dealId?: string;
    };
}

function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function RelatedActivities({
    activities,
    defaultRelation,
}: RelatedActivitiesProps) {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title={`Activities (${activities.length})`}
                description="Calls, emails, meetings and follow-ups related to this record."
                action={
                    <button
                        type="button"
                        onClick={() => setIsAdding((current) => !current)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-1.5 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)]"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Log Activity
                    </button>
                }
            />

            {isAdding && (
                <div className="border-b border-[var(--workspace-border)] p-6">
                    <ActivityForm
                        companies={[]}
                        contacts={[]}
                        leads={[]}
                        deals={[]}
                        defaultRelation={defaultRelation}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            )}

            <div className="divide-y divide-[var(--workspace-border)]">
                {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                            <CalendarDays className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                            No activities yet
                        </h3>

                        <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                            Log a call, email, meeting, or follow-up to
                            start tracking activity here.
                        </p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start justify-between gap-4 px-5 py-4"
                        >
                            <div className="flex min-w-0 items-start gap-3">
                                <ActivityCompleteToggle
                                    activityId={activity.id}
                                    completed={Boolean(
                                        activity.completedAt
                                    )}
                                />

                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <ActivityTypeIcon
                                            type={activity.type}
                                            className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]"
                                        />

                                        <Link
                                            href={`/workspace/crm/activities/${activity.id}/edit`}
                                            className="truncate text-sm font-medium text-[var(--workspace-text)] hover:text-[var(--workspace-primary)]"
                                        >
                                            {activity.title}
                                        </Link>
                                    </div>

                                    <p className="mt-0.5 text-xs text-[var(--workspace-text-muted)]">
                                        {formatActivityType(
                                            activity.type
                                        )}
                                    </p>

                                    {activity.description && (
                                        <p className="mt-2 text-xs leading-5 text-[var(--workspace-text-muted)]">
                                            {activity.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-2">
                                <ActivityStatusBadge
                                    dueAt={activity.dueAt}
                                    completedAt={activity.completedAt}
                                />

                                {activity.dueAt && (
                                    <p className="text-[11px] text-[var(--workspace-text-subtle)]">
                                        {formatDate(activity.dueAt)}
                                    </p>
                                )}

                                <DeleteActivityButton
                                    activityId={activity.id}
                                    activityTitle={activity.title}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </WorkspaceCard>
    );
}