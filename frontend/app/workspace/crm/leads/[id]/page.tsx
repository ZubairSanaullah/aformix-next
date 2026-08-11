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
} from "lucide-react";

import {
    WorkspaceBreadcrumbs,
    WorkspaceCard,
    WorkspaceCardHeader,
    WorkspacePageActions,
} from "@/components/workspace/ui";

import LeadStatusBadge from "@/components/workspace/crm/leads/LeadStatusBadge";
import DeleteLeadButton from "@/components/workspace/crm/leads/DeleteLeadButton";

interface LeadPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getLead(id: string) {
    const headersList = await headers();

    const cookie = headersList.get("cookie");

    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ??
        "http://localhost:3000";

    const response = await fetch(
        `${baseUrl}/api/crm/leads/${id}`,
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

    const data = await response.json();

    return data.lead;
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

function formatSource(
    source: string | null
) {
    if (!source) {
        return "Not specified";
    }

    return source
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
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

export default async function LeadDetailPage({
    params,
}: LeadPageProps) {
    const { id } = await params;

    const lead = await getLead(id);

    if (!lead) {
        notFound();
    }

    const contactName =
        getContactName(lead.contact);

    const ownerName =
        lead.owner?.name ||
        lead.owner?.email ||
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
                        label: "Leads",
                        href: "/workspace/crm/leads",
                    },
                    {
                        label: lead.title,
                    },
                ]}
            />

            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                            <Target className="h-4 w-4" />
                        </span>

                        <h1 className="truncate text-xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-2xl">
                            {lead.title}
                        </h1>

                        <LeadStatusBadge
                            status={lead.status}
                        />
                    </div>

                    <p className="mt-1.5 text-sm text-[var(--workspace-text-muted)]">
                        {lead.source
                            ? `Lead from ${formatSource(
                                lead.source
                            )}`
                            : "Lead profile and CRM relationships"}
                    </p>
                </div>

                <WorkspacePageActions className="shrink-0">
                    <Link
                        href="/workspace/crm/leads"
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />

                        Back
                    </Link>

                    <Link
                        href={`/workspace/crm/leads/${lead.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--workspace-primary)] px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                    >
                        Edit Lead
                    </Link>

                    <DeleteLeadButton
                        leadId={lead.id}
                        leadTitle={lead.title}
                    />
                </WorkspacePageActions>
            </div>

            {/* Main Overview */}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="Lead Overview"
                        description="Core information about this lead."
                    />

                    <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                        {/* Lead */}

                        <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                <Target className="h-4 w-4" />
                            </span>

                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                    Lead
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-[var(--workspace-text)]">
                                    {lead.title}
                                </p>
                            </div>
                        </div>

                        {/* Status */}

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Status
                            </p>

                            <div className="mt-2">
                                <LeadStatusBadge
                                    status={
                                        lead.status
                                    }
                                />
                            </div>
                        </div>

                        {/* Source */}

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Source
                            </p>

                            <p className="mt-1 text-sm text-[var(--workspace-text)]">
                                {formatSource(
                                    lead.source
                                )}
                            </p>
                        </div>

                        {/* Value */}

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Estimated Value
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[var(--workspace-text)]">
                                {formatCurrency(
                                    lead.value
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
                                    lead.createdAt
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
                                    lead.updatedAt
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}

                    {lead.description && (
                        <div className="border-t border-[var(--workspace-border)] px-6 py-5">
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Description
                            </p>

                            <p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-[var(--workspace-text-muted)]">
                                {
                                    lead.description
                                }
                            </p>
                        </div>
                    )}
                </WorkspaceCard>

                {/* Owner */}

                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="Lead Owner"
                        description="User responsible for this lead."
                    />

                    <div className="p-6">
                        {lead.owner ? (
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
                                            lead
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
                        description="Person associated with this lead."
                    />

                    <div className="p-6">
                        {lead.contact ? (
                            <Link
                                href={`/workspace/crm/contacts/${lead.contact.id}`}
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
                                        {lead
                                            .contact
                                            .jobTitle ||
                                            lead
                                                .contact
                                                .email ||
                                            "Contact"}
                                    </p>

                                    {lead
                                        .contact
                                        .phone && (
                                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                                <Phone className="h-3 w-3" />

                                                {
                                                    lead
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
                                    This lead is not currently associated with a contact.
                                </p>
                            </div>
                        )}
                    </div>
                </WorkspaceCard>

                {/* Company */}

                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="Company"
                        description="Organization associated with this lead."
                    />

                    <div className="p-6">
                        {lead.company ? (
                            <Link
                                href={`/workspace/crm/companies/${lead.company.id}`}
                                className="group -mx-2 flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-[var(--workspace-border)] hover:bg-[var(--workspace-surface)]"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                    <Building2 className="h-4 w-4" />
                                </span>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[var(--workspace-text)] group-hover:text-[var(--workspace-primary)]">
                                        {
                                            lead
                                                .company
                                                .name
                                        }
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                        {lead
                                            .company
                                            .industry ||
                                            lead
                                                .company
                                                .website ||
                                            "Company"}
                                    </p>

                                    {lead
                                        .company
                                        .phone && (
                                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                                <Phone className="h-3 w-3" />

                                                {
                                                    lead
                                                        .company
                                                        .phone
                                                }
                                            </div>
                                        )}

                                    {lead
                                        .company
                                        .email && (
                                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                                <Mail className="h-3 w-3" />

                                                {
                                                    lead
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
                                    This lead is not currently associated with a company.
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
                                Status
                            </p>

                            <p className="text-sm font-semibold text-[var(--workspace-text)]">
                                {formatSource(
                                    lead.status
                                )}
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
                                {lead
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
                                Deals
                            </p>

                            <p className="text-xl font-semibold text-[var(--workspace-text)]">
                                {
                                    lead
                                        .deal
                                        ?.length ??
                                    0
                                }
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard>
                    <div className="p-5">
                        <p className="text-xs text-[var(--workspace-text-subtle)]">
                            Lead Value
                        </p>

                        <p className="mt-1 text-xl font-semibold text-[var(--workspace-text)]">
                            {formatCurrency(
                                lead.value
                            )}
                        </p>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Deals */}

            <WorkspaceCard>
                <WorkspaceCardHeader
                    title={`Deals (${lead.deal?.length ??
                        0
                        })`}
                    description="Deals associated with this lead."
                />

                <div className="divide-y divide-[var(--workspace-border)]">
                    {!lead.deal?.length ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                                <BriefcaseBusiness className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                                No deals yet
                            </h3>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                                There are no deals associated with this lead yet.
                            </p>

                            <Link
                                href="/workspace/crm/deals"
                                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)]"
                            >
                                View Deals
                            </Link>
                        </div>
                    ) : (
                        lead.deal.map(
                            (deal: any) => (
                                <Link
                                    key={
                                        deal.id
                                    }
                                    href={`/workspace/crm/deals/${deal.id}`}
                                    className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--workspace-background)]"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                            <BriefcaseBusiness className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-[var(--workspace-text)] transition-colors group-hover:text-[var(--workspace-primary)]">
                                                {
                                                    deal.title
                                                }
                                            </p>

                                            <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                                {deal.status ||
                                                    "Deal"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="text-sm font-semibold text-[var(--workspace-text)]">
                                            {formatCurrency(
                                                deal.value
                                            )}
                                        </p>

                                        {deal.createdAt && (
                                            <p className="mt-0.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                                {formatDate(
                                                    deal.createdAt
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            )
                        )
                    )}
                </div>
            </WorkspaceCard>

            {/* Activities */}

            <WorkspaceCard>
                <WorkspaceCardHeader
                    title={`Activities (${lead.activities
                        ?.length ??
                        0
                        })`}
                    description="Calls, emails, meetings and follow-ups related to this lead."
                />

                <div className="divide-y divide-[var(--workspace-border)]">
                    {!lead.activities?.length ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                                <CalendarDays className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                                No activities yet
                            </h3>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                                Activities related to this lead will appear here.
                            </p>
                        </div>
                    ) : (
                        lead.activities.map(
                            (
                                activity: any
                            ) => (
                                <div
                                    key={
                                        activity.id
                                    }
                                    className="flex items-start justify-between gap-4 px-5 py-4"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[var(--workspace-text)]">
                                            {getActivityTitle(
                                                activity
                                            )}
                                        </p>

                                        {activity.type && (
                                            <p className="mt-0.5 text-xs text-[var(--workspace-text-muted)]">
                                                {
                                                    activity.type
                                                }
                                            </p>
                                        )}

                                        {activity.description && (
                                            <p className="mt-2 text-xs leading-5 text-[var(--workspace-text-muted)]">
                                                {
                                                    activity.description
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="shrink-0 text-right">
                                        {activity.dueAt ? (
                                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                                {formatDate(
                                                    activity.dueAt
                                                )}
                                            </p>
                                        ) : activity.createdAt ? (
                                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                                {formatDate(
                                                    activity.createdAt
                                                )}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-[var(--workspace-text-subtle)]">
                                                No date
                                            </p>
                                        )}

                                        {activity.completedAt && (
                                            <p className="mt-1 text-[11px] text-[var(--workspace-primary)]">
                                                Completed
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        )
                    )}
                </div>
            </WorkspaceCard>

            {/* Notes */}

            <WorkspaceCard>
                <WorkspaceCardHeader
                    title={`Notes (${lead.notes?.length ??
                        0
                        })`}
                    description="Notes associated with this lead."
                />

                <div className="divide-y divide-[var(--workspace-border)]">
                    {!lead.notes?.length ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                                <Mail className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                                No notes yet
                            </h3>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                                Notes associated with this lead will appear here.
                            </p>
                        </div>
                    ) : (
                        lead.notes.map(
                            (note: any) => (
                                <div
                                    key={
                                        note.id
                                    }
                                    className="px-5 py-4"
                                >
                                    <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--workspace-text-muted)]">
                                        {
                                            note.content
                                        }
                                    </p>

                                    {note.createdAt && (
                                        <p className="mt-2 text-[11px] text-[var(--workspace-text-subtle)]">
                                            {formatDate(
                                                note.createdAt
                                            )}
                                        </p>
                                    )}
                                </div>
                            )
                        )
                    )}
                </div>
            </WorkspaceCard>
        </div>
    );
}