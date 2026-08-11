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

import DeleteDealButton from "@/components/workspace/crm/deals/DeleteDealButton";

interface DealContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface DealCompany {
    id: string;
    name: string;
}

interface DealOwner {
    id: string;
    name: string | null;
    email: string;
}

interface DealPipeline {
    id: string;
    name: string;
}

interface DealStage {
    id: string;
    name: string;
    color: string | null;
}

interface DealCounts {
    activities: number;
    notes: number;
}

export interface CRMDeal {
    id: string;
    title: string;
    description: string | null;
    value: unknown;
    contactId: string | null;
    companyId: string | null;
    leadId: string | null;
    pipelineId: string;
    stageId: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date | null;
    contact: DealContact | null;
    company: DealCompany | null;
    owner: DealOwner;
    pipeline: DealPipeline;
    stage: DealStage;
    _count: DealCounts;
}

interface DealTableProps {
    deals: CRMDeal[];
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

// Fallback classes if a stage has no color set in the database
function getStageClasses(color: string | null) {
    if (color) {
        return "";
    }

    return "bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]";
}

function getStageStyle(color: string | null) {
    if (!color) {
        return undefined;
    }

    return {
        backgroundColor: `${color}1a`,
        color,
    };
}

export default function DealTable({
    deals,
}: DealTableProps) {
    if (!deals.length) {
        return (
            <WorkspaceEmptyState
                title="No deals found"
                description="No deals match your current filters. Add a deal or adjust your search criteria."
            />
        );
    }

    return (
        <WorkspaceTable>
            <WorkspaceTableHeader>
                <WorkspaceTableRow>
                    <WorkspaceTableHead>
                        Deal
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Contact
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Company
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Pipeline
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Value
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Stage
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
                {deals.map((deal) => (
                    <WorkspaceTableRow
                        key={deal.id}
                    >
                        {/* Deal */}
                        <WorkspaceTableCell>
                            <div className="min-w-[220px]">
                                <Link
                                    href={`/workspace/crm/deals/${deal.id}`}
                                    className="group inline-flex items-center gap-2 text-xs font-semibold text-[var(--workspace-text)] transition-colors hover:text-[var(--workspace-primary)]"
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </span>

                                    <span className="truncate">
                                        {deal.title}
                                    </span>
                                </Link>

                                {deal.description && (
                                    <div className="mt-1 pl-9 text-[10px] text-[var(--workspace-text-subtle)]">
                                        <span className="line-clamp-1">
                                            {
                                                deal.description
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        </WorkspaceTableCell>

                        {/* Contact */}
                        <WorkspaceTableCell>
                            {deal.contact ? (
                                <div className="min-w-[150px]">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]">
                                        <User className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-muted)]" />

                                        <span className="truncate">
                                            {
                                                deal
                                                    .contact
                                                    .firstName
                                            }{" "}
                                            {
                                                deal
                                                    .contact
                                                    .lastName ??
                                                ""
                                            }
                                        </span>
                                    </div>

                                    {deal.contact.email && (
                                        <div className="mt-1 flex items-center gap-1.5 pl-5 text-[10px] text-[var(--workspace-text-subtle)]">
                                            <Mail className="h-3 w-3" />

                                            <span className="truncate">
                                                {
                                                    deal
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
                            {deal.company ? (
                                <Link
                                    href={`/workspace/crm/companies/${deal.company.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                                >
                                    <Building2 className="h-3.5 w-3.5 shrink-0" />

                                    <span className="max-w-[150px] truncate">
                                        {
                                            deal
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

                        {/* Pipeline */}
                        <WorkspaceTableCell>
                            <span className="text-xs text-[var(--workspace-text-muted)]">
                                {deal.pipeline.name}
                            </span>
                        </WorkspaceTableCell>

                        {/* Value */}
                        <WorkspaceTableCell>
                            <span className="whitespace-nowrap text-xs font-medium text-[var(--workspace-text)]">
                                {formatValue(
                                    deal.value
                                )}
                            </span>
                        </WorkspaceTableCell>

                        {/* Stage */}
                        <WorkspaceTableCell>
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold ${getStageClasses(
                                    deal.stage.color
                                )}`}
                                style={getStageStyle(
                                    deal.stage.color
                                )}
                            >
                                {deal.stage.name}
                            </span>
                        </WorkspaceTableCell>

                        {/* Owner */}
                        <WorkspaceTableCell>
                            <div className="min-w-[120px]">
                                <span className="text-xs text-[var(--workspace-text-muted)]">
                                    {
                                        deal
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
                                    deal.createdAt
                                )}
                            </span>
                        </WorkspaceTableCell>

                        {/* Actions */}
                        <WorkspaceTableCell>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/workspace/crm/deals/${deal.id}`}
                                    aria-label={`View ${deal.title}`}
                                    title="View deal"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>

                                <DeleteDealButton
                                    dealId={deal.id}
                                    dealTitle={deal.title}
                                />
                            </div>
                        </WorkspaceTableCell>
                    </WorkspaceTableRow>
                ))}
            </WorkspaceTableBody>
        </WorkspaceTable>
    );
}