"use client";

import Link from "next/link";
import {
    Building2,
    ExternalLink,
    Target,
    BriefcaseBusiness,
    User,
} from "lucide-react";

import {
    WorkspaceEmptyState,
    WorkspaceTable,
    WorkspaceTableBody,
    WorkspaceTableCell,
    WorkspaceTableHead,
    WorkspaceTableHeader,
    WorkspaceTableRow,
} from "@/components/workspace/ui";

import DeleteActivityButton from "@/components/workspace/crm/activities/DeleteActivityButton";
import ActivityCompleteToggle from "@/components/workspace/crm/activities/ActivityCompleteToggle";
import ActivityStatusBadge, {
    ActivityTypeIcon,
    formatActivityType,
    type ActivityType,
} from "@/components/workspace/crm/activities/ActivityStatusBadge";

interface ActivityContact {
    id: string;
    firstName: string;
    lastName: string | null;
}

interface ActivityCompany {
    id: string;
    name: string;
}

interface ActivityLead {
    id: string;
    title: string;
}

interface ActivityDeal {
    id: string;
    title: string;
}

interface ActivityOwner {
    id: string;
    name: string | null;
    email: string;
}

export interface CRMActivity {
    id: string;
    type: ActivityType;
    title: string;
    description: string | null;
    dueAt: string | null;
    completedAt: string | null;
    createdAt: string;
    contact: ActivityContact | null;
    company: ActivityCompany | null;
    lead: ActivityLead | null;
    deal: ActivityDeal | null;
    user: ActivityOwner;
}

interface ActivityTableProps {
    activities: CRMActivity[];
}

function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function RelatedTo({ activity }: { activity: CRMActivity }) {
    const items: {
        href: string;
        label: string;
        icon: typeof Building2;
    }[] = [];

    if (activity.contact) {
        const name = [
            activity.contact.firstName,
            activity.contact.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        items.push({
            href: `/workspace/crm/contacts/${activity.contact.id}`,
            label: name || "Contact",
            icon: User,
        });
    }

    if (activity.company) {
        items.push({
            href: `/workspace/crm/companies/${activity.company.id}`,
            label: activity.company.name,
            icon: Building2,
        });
    }

    if (activity.lead) {
        items.push({
            href: `/workspace/crm/leads/${activity.lead.id}`,
            label: activity.lead.title,
            icon: Target,
        });
    }

    if (activity.deal) {
        items.push({
            href: `/workspace/crm/deals/${activity.deal.id}`,
            label: activity.deal.title,
            icon: BriefcaseBusiness,
        });
    }

    if (items.length === 0) {
        return (
            <span className="text-xs text-[var(--workspace-text-subtle)]">
                —
            </span>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                >
                    <item.icon className="h-3 w-3 shrink-0" />
                    <span className="max-w-[140px] truncate">
                        {item.label}
                    </span>
                </Link>
            ))}
        </div>
    );
}

export default function ActivityTable({
    activities,
}: ActivityTableProps) {
    if (!activities.length) {
        return (
            <WorkspaceEmptyState
                title="No activities found"
                description="No activities match your current filters. Log an activity or adjust your search criteria."
            />
        );
    }

    return (
        <WorkspaceTable>
            <WorkspaceTableHeader>
                <WorkspaceTableRow>
                    <WorkspaceTableHead>Done</WorkspaceTableHead>
                    <WorkspaceTableHead>Activity</WorkspaceTableHead>
                    <WorkspaceTableHead>Related To</WorkspaceTableHead>
                    <WorkspaceTableHead>Due</WorkspaceTableHead>
                    <WorkspaceTableHead>Status</WorkspaceTableHead>
                    <WorkspaceTableHead>Owner</WorkspaceTableHead>
                    <WorkspaceTableHead>Actions</WorkspaceTableHead>
                </WorkspaceTableRow>
            </WorkspaceTableHeader>

            <WorkspaceTableBody>
                {activities.map((activity) => (
                    <WorkspaceTableRow key={activity.id}>
                        {/* Done */}
                        <WorkspaceTableCell>
                            <ActivityCompleteToggle
                                activityId={activity.id}
                                completed={Boolean(
                                    activity.completedAt
                                )}
                            />
                        </WorkspaceTableCell>

                        {/* Activity */}
                        <WorkspaceTableCell>
                            <div className="min-w-[200px]">
                                <Link
                                    href={`/workspace/crm/activities/${activity.id}/edit`}
                                    className="group inline-flex items-center gap-2 text-xs font-semibold text-[var(--workspace-text)] transition-colors hover:text-[var(--workspace-primary)]"
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                        <ActivityTypeIcon
                                            type={activity.type}
                                            className="h-3.5 w-3.5"
                                        />
                                    </span>

                                    <span className="truncate">
                                        {activity.title}
                                    </span>
                                </Link>

                                <p className="mt-1 pl-9 text-[10px] text-[var(--workspace-text-subtle)]">
                                    {formatActivityType(activity.type)}
                                </p>
                            </div>
                        </WorkspaceTableCell>

                        {/* Related To */}
                        <WorkspaceTableCell>
                            <RelatedTo activity={activity} />
                        </WorkspaceTableCell>

                        {/* Due */}
                        <WorkspaceTableCell>
                            <span className="whitespace-nowrap text-xs text-[var(--workspace-text-muted)]">
                                {activity.dueAt
                                    ? formatDate(activity.dueAt)
                                    : "—"}
                            </span>
                        </WorkspaceTableCell>

                        {/* Status */}
                        <WorkspaceTableCell>
                            <ActivityStatusBadge
                                dueAt={activity.dueAt}
                                completedAt={activity.completedAt}
                            />
                        </WorkspaceTableCell>

                        {/* Owner */}
                        <WorkspaceTableCell>
                            <span className="text-xs text-[var(--workspace-text-muted)]">
                                {activity.user?.name ||
                                    activity.user?.email}
                            </span>
                        </WorkspaceTableCell>

                        {/* Actions */}
                        <WorkspaceTableCell>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/workspace/crm/activities/${activity.id}/edit`}
                                    aria-label={`Edit ${activity.title}`}
                                    title="Edit activity"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>

                                <DeleteActivityButton
                                    activityId={activity.id}
                                    activityTitle={activity.title}
                                />
                            </div>
                        </WorkspaceTableCell>
                    </WorkspaceTableRow>
                ))}
            </WorkspaceTableBody>
        </WorkspaceTable>
    );
}