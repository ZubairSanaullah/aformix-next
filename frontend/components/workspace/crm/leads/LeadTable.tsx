"use client";

import Link from "next/link";

import {
    Building2,
    ExternalLink,
    Mail,
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

import DeleteLeadButton from "@/components/workspace/crm/leads/DeleteLeadButton";

interface LeadContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface LeadCompany {
    id: string;
    name: string;
}

interface LeadOwner {
    id: string;
    name: string | null;
    email: string;
}

interface LeadCounts {
    activities: number;
    notes: number;
    deal: number;
}

export interface CRMLead {
    id: string;
    title: string;
    description: string | null;
    status:
    | "NEW"
    | "CONTACTED"
    | "QUALIFIED"
    | "CONVERTED"
    | "LOST";
    source:
    | "WEBSITE"
    | "LINKEDIN"
    | "INSTAGRAM"
    | "FACEBOOK"
    | "REFERRAL"
    | "EMAIL"
    | "COLD_OUTREACH"
    | "GOOGLE"
    | "OTHER"
    | null;
    value: unknown;
    contactId: string | null;
    companyId: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    contact: LeadContact | null;
    company: LeadCompany | null;
    owner: LeadOwner;
    _count: LeadCounts;
}

interface LeadTableProps {
    leads: CRMLead[];
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function formatValue(value: unknown) {
    if (
        value === null ||
        value === undefined
    ) {
        return "—";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return "—";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(numericValue);
}

function formatStatus(
    status: CRMLead["status"]
) {
    const labels = {
        NEW: "New",
        CONTACTED: "Contacted",
        QUALIFIED: "Qualified",
        CONVERTED: "Converted",
        LOST: "Lost",
    };

    return labels[status];
}

function getStatusClasses(
    status: CRMLead["status"]
) {
    switch (status) {
        case "NEW":
            return "bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]";

        case "CONTACTED":
            return "bg-blue-50 text-blue-700";

        case "QUALIFIED":
            return "bg-emerald-50 text-emerald-700";

        case "CONVERTED":
            return "bg-violet-50 text-violet-700";

        case "LOST":
            return "bg-red-50 text-red-700";

        default:
            return "bg-[var(--workspace-background)] text-[var(--workspace-text-muted)]";
    }
}

function formatSource(
    source: CRMLead["source"]
) {
    if (!source) {
        return "—";
    }

    const labels: Record<
        Exclude<CRMLead["source"], null>,
        string
    > = {
        WEBSITE: "Website",
        LINKEDIN: "LinkedIn",
        INSTAGRAM: "Instagram",
        FACEBOOK: "Facebook",
        REFERRAL: "Referral",
        EMAIL: "Email",
        COLD_OUTREACH: "Cold Outreach",
        GOOGLE: "Google",
        OTHER: "Other",
    };

    return labels[source];
}

export default function LeadTable({
    leads,
}: LeadTableProps) {
    if (!leads.length) {
        return (
            <WorkspaceEmptyState
                title="No leads found"
                description="No leads match your current filters. Add a lead or adjust your search criteria."
            />
        );
    }

    return (
        <WorkspaceTable>
            <WorkspaceTableHeader>
                <WorkspaceTableRow>
                    <WorkspaceTableHead>
                        Lead
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Contact
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Company
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Source
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Value
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Status
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Owner
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Created
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Actions
                    </WorkspaceTableHead>
                </WorkspaceTableRow>
            </WorkspaceTableHeader>

            <WorkspaceTableBody>
                {leads.map((lead) => (
                    <WorkspaceTableRow
                        key={lead.id}
                    >
                        {/* Lead */}
                        <WorkspaceTableCell>
                            <div className="min-w-[220px]">
                                <Link
                                    href={`/workspace/crm/leads/${lead.id}`}
                                    className="group inline-flex items-center gap-2 text-xs font-semibold text-[var(--workspace-text)] transition-colors hover:text-[var(--workspace-primary)]"
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </span>

                                    <span className="truncate">
                                        {lead.title}
                                    </span>
                                </Link>

                                {lead.description && (
                                    <div className="mt-1 pl-9 text-[10px] text-[var(--workspace-text-subtle)]">
                                        <span className="line-clamp-1">
                                            {
                                                lead.description
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        </WorkspaceTableCell>

                        {/* Contact */}
                        <WorkspaceTableCell>
                            {lead.contact ? (
                                <div className="min-w-[150px]">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]">
                                        <User className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-muted)]" />

                                        <span className="truncate">
                                            {
                                                lead
                                                    .contact
                                                    .firstName
                                            }{" "}
                                            {
                                                lead
                                                    .contact
                                                    .lastName ??
                                                ""
                                            }
                                        </span>
                                    </div>

                                    {lead.contact.email && (
                                        <div className="mt-1 flex items-center gap-1.5 pl-5 text-[10px] text-[var(--workspace-text-subtle)]">
                                            <Mail className="h-3 w-3" />

                                            <span className="truncate">
                                                {
                                                    lead
                                                        .contact
                                                        .email
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span className="text-xs text-[var(--workspace-text-subtle)]">
                                    —
                                </span>
                            )}
                        </WorkspaceTableCell>

                        {/* Company */}
                        <WorkspaceTableCell>
                            {lead.company ? (
                                <Link
                                    href={`/workspace/crm/companies/${lead.company.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                                >
                                    <Building2 className="h-3.5 w-3.5 shrink-0" />

                                    <span className="max-w-[150px] truncate">
                                        {
                                            lead
                                                .company
                                                .name
                                        }
                                    </span>
                                </Link>
                            ) : (
                                <span className="text-xs text-[var(--workspace-text-subtle)]">
                                    —
                                </span>
                            )}
                        </WorkspaceTableCell>

                        {/* Source */}
                        <WorkspaceTableCell>
                            <span className="text-xs text-[var(--workspace-text-muted)]">
                                {formatSource(
                                    lead.source
                                )}
                            </span>
                        </WorkspaceTableCell>

                        {/* Value */}
                        <WorkspaceTableCell>
                            <span className="whitespace-nowrap text-xs font-medium text-[var(--workspace-text)]">
                                {formatValue(
                                    lead.value
                                )}
                            </span>
                        </WorkspaceTableCell>

                        {/* Status */}
                        <WorkspaceTableCell>
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusClasses(
                                    lead.status
                                )}`}
                            >
                                {formatStatus(
                                    lead.status
                                )}
                            </span>
                        </WorkspaceTableCell>

                        {/* Owner */}
                        <WorkspaceTableCell>
                            <div className="min-w-[120px]">
                                <span className="text-xs text-[var(--workspace-text-muted)]">
                                    {
                                        lead
                                            .owner
                                            .name
                                    }
                                </span>
                            </div>
                        </WorkspaceTableCell>

                        {/* Created */}
                        <WorkspaceTableCell>
                            <span className="whitespace-nowrap text-xs text-[var(--workspace-text-muted)]">
                                {formatDate(
                                    lead.createdAt
                                )}
                            </span>
                        </WorkspaceTableCell>

                        {/* Actions */}
                        <WorkspaceTableCell>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/workspace/crm/leads/${lead.id}`}
                                    aria-label={`View ${lead.title}`}
                                    title="View lead"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>

                                <DeleteLeadButton
                                    leadId={lead.id}
                                    leadTitle={lead.title}
                                />
                            </div>
                        </WorkspaceTableCell>
                    </WorkspaceTableRow>
                ))}
            </WorkspaceTableBody>
        </WorkspaceTable>
    );
}
