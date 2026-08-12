import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

import {
    ArrowLeft,
    Building2,
    CalendarDays,
    ExternalLink,
    Mail,
    Phone,
    Target,
    User,
    BriefcaseBusiness,
    Milestone,
} from "lucide-react";

import {
    WorkspaceBreadcrumbs,
    WorkspaceCard,
    WorkspaceCardHeader,
    WorkspacePageActions,
} from "@/components/workspace/ui";

import DealStageBadge from "@/components/workspace/crm/deals/DealStageBadge";
import DeleteDealButton from "@/components/workspace/crm/deals/DeleteDealButton";
import RelatedActivities from "@/components/workspace/crm/activities/RelatedActivities";
import RelatedNotes from "@/components/workspace/crm/notes/RelatedNotes";

interface DealPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getDeal(id: string) {
    const headersList = await headers();

    const cookie = headersList.get("cookie");

    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ??
        "http://localhost:3000";

    const response = await fetch(
        `${baseUrl}/api/crm/deals/${id}`,
        {
            cache: "no-store",
            headers: cookie
                ? {
                    cookie,
                }
                : undefined,
        }
    );

    if (!response.ok) {
        return null;
    }

    // NOTE: /api/crm/deals/[id] (built in 9.8.7) returns the deal object
    // directly, not wrapped in { deal }. If your Leads API wraps its
    // response as { lead }, adjust one of the two routes so they're
    // consistent — this page assumes the unwrapped shape.
    const data = await response.json();

    return data;
}

function formatDate(
    date: string | Date
) {
    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    ).format(new Date(date));
}

function formatCurrency(
    value: unknown
) {
    if (
        value === null ||
        value === undefined
    ) {
        return "—";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "—";
    }

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }
    ).format(number);
}

function getContactName(
    contact: any
) {
    if (!contact) {
        return "No contact";
    }

    return (
        [
            contact.firstName,
            contact.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        contact.email ||
        "Unnamed Contact"
    );
}

function getInitials(
    name: string
) {
    return (
        name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (part) =>
                    part[0]?.toUpperCase()
            )
            .join("") || "?"
    );
}

function getActivityTitle(
    activity: any
) {
    return (
        activity.title ||
        activity.subject ||
        activity.type ||
        "Activity"
    );
}

export default async function DealDetailPage({
    params,
}: DealPageProps) {
    const { id } = await params;

    const deal = await getDeal(id);

    if (!deal) {
        notFound();
    }

    const contactName =
        getContactName(deal.contact);

    const ownerName =
        deal.owner?.name ||
        deal.owner?.email ||
        "Unassigned";

    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}

            <WorkspaceBreadcrumbs
                items={[
                    {
                        label: "CRM",
                        href: "/workspace/crm",
                    },
                    {
                        label: "Deals",
                        href: "/workspace/crm/deals",
                    },
                    {
                        label: deal.title,
                    },
                ]}
            />

            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                            <BriefcaseBusiness className="h-4 w-4" />
                        </span>

                        <h1 className="truncate text-xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-2xl">
                            {deal.title}
                        </h1>

                        <DealStageBadge
                            name={deal.stage?.name}
                            color={deal.stage?.color}
                        />
                    </div>

                    <p className="mt-1.5 text-sm text-[var(--workspace-text-muted)]">
                        {deal.pipeline
                            ? `In ${deal.pipeline.name}`
                            : "Deal profile and CRM relationships"}
                    </p>
                </div>

                <WorkspacePageActions className="shrink-0">
                    <Link
                        href="/workspace/crm/deals"
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />

                        Back
                    </Link>

                    <Link
                        href={`/workspace/crm/deals/${deal.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--workspace-primary)] px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                    >
                        Edit Deal
                    </Link>

                    <DeleteDealButton
                        dealId={deal.id}
                        dealTitle={deal.title}
                    />
                </WorkspacePageActions>
            </div>

            {/* Main Overview */}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="Deal Overview"
                        description="Core information about this deal."
                    />

                    <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                        {/* Deal */}

                        <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                <BriefcaseBusiness className="h-4 w-4" />
                            </span>

                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                    Deal
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-[var(--workspace-text)]">
                                    {deal.title}
                                </p>
                            </div>
                        </div>

                        {/* Stage */}

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Stage
                            </p>

                            <div className="mt-2">
                                <DealStageBadge
                                    name={
                                        deal.stage?.name
                                    }
                                    color={
                                        deal.stage?.color
                                    }
                                />
                            </div>
                        </div>

                        {/* Pipeline */}

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Pipeline
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--workspace-text)]">
                                <Milestone className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-subtle)]" />

                                {deal.pipeline?.name ??
                                    "—"}
                            </div>
                        </div>

                        {/* Value */}

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Deal Value
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[var(--workspace-text)]">
                                {formatCurrency(
                                    deal.value
                                )}
                            </p>
                        </div>

                        {/* Created */}

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Created
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--workspace-text)]">
                                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-subtle)]" />

                                {formatDate(
                                    deal.createdAt
                                )}
                            </div>
                        </div>

                        {/* Updated */}

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Last Updated
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--workspace-text)]">
                                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-subtle)]" />

                                {formatDate(
                                    deal.updatedAt
                                )}
                            </div>
                        </div>

                        {/* Closed */}

                        {deal.closedAt && (
                            <div>
                                <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                    Closed
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--workspace-text)]">
                                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-subtle)]" />

                                    {formatDate(
                                        deal.closedAt
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}

                    {deal.description && (
                        <div className="border-t border-[var(--workspace-border)] px-6 py-5">
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Description
                            </p>

                            <p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-[var(--workspace-text-muted)]">
                                {
                                    deal.description
                                }
                            </p>
                        </div>
                    )}
                </WorkspaceCard>

                {/* Owner */}

                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="Deal Owner"
                        description="User responsible for this deal."
                    />

                    <div className="p-6">
                        {deal.owner ? (
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                    <User className="h-4 w-4" />
                                </span>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[var(--workspace-text)]">
                                        {
                                            ownerName
                                        }
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-subtle)]">
                                        {
                                            deal
                                                .owner
                                                .email
                                        }
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-[var(--workspace-text-muted)]">
                                No owner assigned
                            </div>
                        )}
                    </div>
                </WorkspaceCard>
            </div>

            {/* Contact & Company */}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Contact */}

                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="Contact"
                        description="Person associated with this deal."
                    />

                    <div className="p-6">
                        {deal.contact ? (
                            <Link
                                href={`/workspace/crm/contacts/${deal.contact.id}`}
                                className="group -mx-2 flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-[var(--workspace-border)] hover:bg-[var(--workspace-surface)]"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--workspace-primary-soft)] text-sm font-semibold text-[var(--workspace-primary)]">
                                    {getInitials(
                                        contactName
                                    )}
                                </span>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[var(--workspace-text)] group-hover:text-[var(--workspace-primary)]">
                                        {
                                            contactName
                                        }
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                        {deal
                                            .contact
                                            .jobTitle ||
                                            deal
                                                .contact
                                                .email ||
                                            "Contact"}
                                    </p>

                                    {deal
                                        .contact
                                        .phone && (
                                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                                <Phone className="h-3 w-3" />

                                                {
                                                    deal
                                                        .contact
                                                        .phone
                                                }
                                            </div>
                                        )}
                                </div>

                                <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-subtle)] transition-colors group-hover:text-[var(--workspace-primary)]" />
                            </Link>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--workspace-border)] px-6 py-8 text-center">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--workspace-surface)] text-[var(--workspace-text-subtle)]">
                                    <User className="h-5 w-5" />
                                </span>

                                <p className="mt-3 text-sm font-medium text-[var(--workspace-text)]">
                                    No contact linked
                                </p>

                                <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--workspace-text-subtle)]">
                                    This deal is not currently associated with a contact.
                                </p>
                            </div>
                        )}
                    </div>
                </WorkspaceCard>

                {/* Company */}

                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="Company"
                        description="Organization associated with this deal."
                    />

                    <div className="p-6">
                        {deal.company ? (
                            <Link
                                href={`/workspace/crm/companies/${deal.company.id}`}
                                className="group -mx-2 flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-[var(--workspace-border)] hover:bg-[var(--workspace-surface)]"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                    <Building2 className="h-4 w-4" />
                                </span>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[var(--workspace-text)] group-hover:text-[var(--workspace-primary)]">
                                        {
                                            deal
                                                .company
                                                .name
                                        }
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                        {deal
                                            .company
                                            .industry ||
                                            deal
                                                .company
                                                .website ||
                                            "Company"}
                                    </p>

                                    {deal
                                        .company
                                        .phone && (
                                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                                <Phone className="h-3 w-3" />

                                                {
                                                    deal
                                                        .company
                                                        .phone
                                                }
                                            </div>
                                        )}

                                    {deal
                                        .company
                                        .email && (
                                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                                <Mail className="h-3 w-3" />

                                                {
                                                    deal
                                                        .company
                                                        .email
                                                }
                                            </div>
                                        )}
                                </div>

                                <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-subtle)] transition-colors group-hover:text-[var(--workspace-primary)]" />
                            </Link>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--workspace-border)] px-6 py-8 text-center">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--workspace-surface)] text-[var(--workspace-text-subtle)]">
                                    <Building2 className="h-5 w-5" />
                                </span>

                                <p className="mt-3 text-sm font-medium text-[var(--workspace-text)]">
                                    No company linked
                                </p>

                                <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--workspace-text-subtle)]">
                                    This deal is not currently associated with a company.
                                </p>
                            </div>
                        )}
                    </div>
                </WorkspaceCard>
            </div>

            {/* Relationship Stats */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <WorkspaceCard>
                    <div className="flex items-center gap-3 p-5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                            <Target className="h-4 w-4" />
                        </span>

                        <div>
                            <p className="text-xs text-[var(--workspace-text-subtle)]">
                                Stage
                            </p>

                            <p className="text-sm font-semibold text-[var(--workspace-text)]">
                                {deal.stage
                                    ?.name ||
                                    "—"}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard>
                    <div className="flex items-center gap-3 p-5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                            <Building2 className="h-4 w-4" />
                        </span>

                        <div>
                            <p className="text-xs text-[var(--workspace-text-subtle)]">
                                Company
                            </p>

                            <p className="max-w-[150px] truncate text-sm font-semibold text-[var(--workspace-text)]">
                                {deal
                                    .company
                                    ?.name ||
                                    "—"}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard>
                    <div className="flex items-center gap-3 p-5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                            <BriefcaseBusiness className="h-4 w-4" />
                        </span>

                        <div>
                            <p className="text-xs text-[var(--workspace-text-subtle)]">
                                Activities
                            </p>

                            <p className="text-xl font-semibold text-[var(--workspace-text)]">
                                {deal
                                    .activities
                                    ?.length ??
                                    0}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard>
                    <div className="p-5">
                        <p className="text-xs text-[var(--workspace-text-subtle)]">
                            Deal Value
                        </p>

                        <p className="mt-1 text-xl font-semibold text-[var(--workspace-text)]">
                            {formatCurrency(
                                deal.value
                            )}
                        </p>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Originating Lead */}

            <WorkspaceCard>
                <WorkspaceCardHeader
                    title="Originating Lead"
                    description="The lead this deal was converted from, if any."
                />

                <div className="p-6">
                    {deal.lead ? (
                        <Link
                            href={`/workspace/crm/leads/${deal.lead.id}`}
                            className="group -mx-2 flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-[var(--workspace-border)] hover:bg-[var(--workspace-surface)]"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                <Target className="h-4 w-4" />
                            </span>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[var(--workspace-text)] group-hover:text-[var(--workspace-primary)]">
                                    {
                                        deal.lead
                                            .title
                                    }
                                </p>

                                <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                    Lead
                                </p>
                            </div>

                            <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-subtle)] transition-colors group-hover:text-[var(--workspace-primary)]" />
                        </Link>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--workspace-border)] px-6 py-8 text-center">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--workspace-surface)] text-[var(--workspace-text-subtle)]">
                                <Target className="h-5 w-5" />
                            </span>

                            <p className="mt-3 text-sm font-medium text-[var(--workspace-text)]">
                                No originating lead
                            </p>

                            <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--workspace-text-subtle)]">
                                This deal was not created from an existing lead.
                            </p>
                        </div>
                    )}
                </div>
            </WorkspaceCard>

            {/* Activities */}

            <RelatedActivities
                activities={deal.activities ?? []}
                defaultRelation={{ dealId: deal.id }}
            />

            {/* Notes */}

            <RelatedNotes
                notes={deal.notes ?? []}
                defaultRelation={{ dealId: deal.id }}
            />
        </div>
    );
}