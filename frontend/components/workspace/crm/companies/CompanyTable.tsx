"use client";

import Link from "next/link";
import {
    Building2,
    ExternalLink,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

import {
    WorkspaceTable,
    WorkspaceTableBody,
    WorkspaceTableCell,
    WorkspaceTableHead,
    WorkspaceTableHeader,
    WorkspaceEmptyState,
    WorkspaceTableRow,
} from "@/components/workspace/ui";

import CompanyStatusBadge from "./CompanyStatusBadge";

interface CompanyOwner {
    id: string;
    name: string | null;
    email: string;
}

interface CompanyCounts {
    contacts: number;
    leads: number;
    deals: number;
}

export interface CRMCompany {
    id: string;
    name: string;
    website: string | null;
    industry: string | null;
    size: string | null;
    phone: string | null;
    email: string | null;
    location: string | null;
    description: string | null;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    owner: CompanyOwner;
    _count: CompanyCounts;
}

interface CompanyTableProps {
    companies: CRMCompany[];
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function CompanyTable({
    companies,
}: CompanyTableProps) {
    if (!companies.length) {
        return (
            <WorkspaceEmptyState
                title="No companies found"
                description="No companies match your current filters. Add a company or adjust your search criteria."
            />
        );
    }

    return (
        <WorkspaceTable>
            <WorkspaceTableHeader>
                <WorkspaceTableRow>
                    <WorkspaceTableHead>
                        Company
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Industry
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Location
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Contacts
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Leads
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Deals
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Status
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
                {companies.map((company) => (
                    <WorkspaceTableRow key={company.id}>
                        {/* Company */}
                        <WorkspaceTableCell>
                            <div className="min-w-[220px]">
                                <Link
                                    href={`/workspace/crm/companies/${company.id}`}
                                    className="group inline-flex items-center gap-2 text-xs font-semibold text-[var(--workspace-text)] transition-colors hover:text-[var(--workspace-primary)]"
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                        <Building2 className="h-3.5 w-3.5" />
                                    </span>

                                    <span className="truncate">
                                        {company.name}
                                    </span>
                                </Link>

                                {company.email && (
                                    <div className="mt-1 flex items-center gap-1.5 pl-9 text-[10px] text-[var(--workspace-text-subtle)]">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">
                                            {company.email}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </WorkspaceTableCell>

                        {/* Industry */}
                        <WorkspaceTableCell>
                            <span className="text-xs text-[var(--workspace-text-muted)]">
                                {company.industry || "—"}
                            </span>
                        </WorkspaceTableCell>

                        {/* Location */}
                        <WorkspaceTableCell>
                            {company.location ? (
                                <div className="flex items-center gap-1.5 text-xs text-[var(--workspace-text-muted)]">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                    <span className="max-w-[160px] truncate">
                                        {company.location}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xs text-[var(--workspace-text-subtle)]">
                                    —
                                </span>
                            )}
                        </WorkspaceTableCell>

                        {/* Contacts */}
                        <WorkspaceTableCell>
                            <span className="text-xs font-medium text-[var(--workspace-text)]">
                                {company._count.contacts}
                            </span>
                        </WorkspaceTableCell>

                        {/* Leads */}
                        <WorkspaceTableCell>
                            <span className="text-xs font-medium text-[var(--workspace-text)]">
                                {company._count.leads}
                            </span>
                        </WorkspaceTableCell>

                        {/* Deals */}
                        <WorkspaceTableCell>
                            <span className="text-xs font-medium text-[var(--workspace-text)]">
                                {company._count.deals}
                            </span>
                        </WorkspaceTableCell>

                        {/* Status */}
                        <WorkspaceTableCell>
                            <CompanyStatusBadge status={company.status} />
                        </WorkspaceTableCell>

                        {/* Created */}
                        <WorkspaceTableCell>
                            <span className="whitespace-nowrap text-xs text-[var(--workspace-text-muted)]">
                                {formatDate(company.createdAt)}
                            </span>
                        </WorkspaceTableCell>

                        {/* Actions */}
                        <WorkspaceTableCell>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/workspace/crm/companies/${company.id}`}
                                    aria-label={`View ${company.name}`}
                                    title="View company"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>

                                {company.phone && (
                                    <a
                                        href={`tel:${company.phone}`}
                                        aria-label={`Call ${company.name}`}
                                        title="Call company"
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                                    >
                                        <Phone className="h-3.5 w-3.5" />
                                    </a>
                                )}
                            </div>
                        </WorkspaceTableCell>
                    </WorkspaceTableRow>
                ))}
            </WorkspaceTableBody>
        </WorkspaceTable>
    );
}