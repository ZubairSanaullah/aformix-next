import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
    ArrowLeft,
    Building2,
    ExternalLink,
    Mail,
    MapPin,
    Phone,
    Users,
    Target,
    BriefcaseBusiness,
    CalendarDays,
} from "lucide-react";

import {
    WorkspaceBreadcrumbs,
    WorkspaceCard,
    WorkspaceCardHeader,
    WorkspacePageActions,
} from "@/components/workspace/ui";

import CompanyStatusBadge from "@/components/workspace/crm/companies/CompanyStatusBadge";

interface CompanyPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getCompany(id: string) {
    const headersList = await headers();
    const cookie = headersList.get("cookie");

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/crm/companies/${id}`,
        {
            cache: "no-store",
            headers: cookie ? { cookie } : undefined,
        }
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    return data.company;
}

function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function formatCurrency(value: unknown) {
    if (value === null || value === undefined) {
        return "—";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "—";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(number);
}

export default async function CompanyDetailPage({
    params,
}: CompanyPageProps) {
    const { id } = await params;

    const company = await getCompany(id);

    if (!company) {
        notFound();
    }

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
                        label: "Companies",
                        href: "/workspace/crm/companies",
                    },
                    {
                        label: company.name,
                    },
                ]}
            />

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="truncate text-xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-2xl">
                            {company.name}
                        </h1>

                        <CompanyStatusBadge status={company.status} />
                    </div>

                    <p className="mt-1.5 text-sm text-[var(--workspace-text-muted)]">
                        {company.industry ||
                            "Company profile and CRM relationships"}
                    </p>
                </div>

                <WorkspacePageActions className="shrink-0">
                    <Link
                        href="/workspace/crm/companies"
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>

                    <Link
                        href={`/workspace/crm/companies/${company.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--workspace-primary)] px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                    >
                        Edit Company
                    </Link>
                </WorkspacePageActions>
            </div>

            {/* Overview */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="Company Overview"
                        description="Core information about this company."
                    />

                    <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                <Building2 className="h-4 w-4" />
                            </span>

                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                    Company
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-[var(--workspace-text)]">
                                    {company.name}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Status
                            </p>

                            <div className="mt-2">
                                <CompanyStatusBadge status={company.status} />
                            </div>
                        </div>

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Industry
                            </p>

                            <p className="mt-1 text-sm text-[var(--workspace-text)]">
                                {company.industry || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Company Size
                            </p>

                            <p className="mt-1 text-sm text-[var(--workspace-text)]">
                                {company.size || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Location
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--workspace-text)]">
                                {company.location && (
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-subtle)]" />
                                )}

                                <span>
                                    {company.location || "Not specified"}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Created
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--workspace-text)]">
                                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-subtle)]" />

                                {formatDate(company.createdAt)}
                            </div>
                        </div>
                    </div>

                    {company.description && (
                        <div className="border-t border-[var(--workspace-border)] px-6 py-5">
                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                Description
                            </p>

                            <p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-[var(--workspace-text-muted)]">
                                {company.description}
                            </p>
                        </div>
                    )}
                </WorkspaceCard>


                {/* Contact Information */}
                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="Contact Information"
                        description="Ways to reach this company."
                    />

                    <div className="p-6">
                        {company.email || company.phone || company.website ? (
                            <div className="space-y-4">
                                {company.email && (
                                    <a
                                        href={`mailto:${company.email}`}
                                        className="group flex items-center gap-3 rounded-xl border border-transparent p-2 -mx-2 transition-colors hover:border-[var(--workspace-border)] hover:bg-[var(--workspace-surface)]"
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                            <Mail className="h-4 w-4" />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                                Email
                                            </p>

                                            <p className="mt-0.5 truncate text-sm text-[var(--workspace-text)] group-hover:text-[var(--workspace-primary)]">
                                                {company.email}
                                            </p>
                                        </div>
                                    </a>
                                )}

                                {company.phone && (
                                    <a
                                        href={`tel:${company.phone}`}
                                        className="group flex items-center gap-3 rounded-xl border border-transparent p-2 -mx-2 transition-colors hover:border-[var(--workspace-border)] hover:bg-[var(--workspace-surface)]"
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                            <Phone className="h-4 w-4" />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                                Phone
                                            </p>

                                            <p className="mt-0.5 text-sm text-[var(--workspace-text)] group-hover:text-[var(--workspace-primary)]">
                                                {company.phone}
                                            </p>
                                        </div>
                                    </a>
                                )}

                                {company.website && (
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 rounded-xl border border-transparent p-2 -mx-2 transition-colors hover:border-[var(--workspace-border)] hover:bg-[var(--workspace-surface)]"
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                            <ExternalLink className="h-4 w-4" />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium text-[var(--workspace-text-subtle)]">
                                                Website
                                            </p>

                                            <p className="mt-0.5 truncate text-sm text-[var(--workspace-text)] group-hover:text-[var(--workspace-primary)]">
                                                {company.website}
                                            </p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--workspace-border)] px-6 py-8 text-center">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--workspace-surface)] text-[var(--workspace-text-subtle)]">
                                    <Building2 className="h-5 w-5" />
                                </span>

                                <p className="mt-3 text-sm font-medium text-[var(--workspace-text)]">
                                    No contact information
                                </p>

                                <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--workspace-text-subtle)]">
                                    Add an email, phone number, or website when editing this company.
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
                            <Users className="h-4 w-4" />
                        </span>

                        <div>
                            <p className="text-xs text-[var(--workspace-text-subtle)]">
                                Contacts
                            </p>
                            <p className="text-xl font-semibold text-[var(--workspace-text)]">
                                {company._count.contacts}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard>
                    <div className="flex items-center gap-3 p-5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                            <Target className="h-4 w-4" />
                        </span>

                        <div>
                            <p className="text-xs text-[var(--workspace-text-subtle)]">
                                Leads
                            </p>
                            <p className="text-xl font-semibold text-[var(--workspace-text)]">
                                {company._count.leads}
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
                                {company._count.deals}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard>
                    <div className="p-5">
                        <p className="text-xs text-[var(--workspace-text-subtle)]">
                            Owner
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-[var(--workspace-text)]">
                            {company.owner.name ||
                                company.owner.email}
                        </p>

                        <p className="mt-0.5 truncate text-[11px] text-[var(--workspace-text-subtle)]">
                            {company.owner.email}
                        </p>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Contacts */}
            <WorkspaceCard>
                <WorkspaceCardHeader
                    title={`Contacts (${company.contacts.length})`}
                    description="People associated with this company."
                />

                <div className="divide-y divide-[var(--workspace-border)]">
                    {company.contacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                                <Users className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                                No contacts yet
                            </h3>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                                There are no contacts associated with this company yet.
                            </p>

                            <Link
                                href={`/workspace/crm/contacts?companyId=${company.id}`}
                                className="mt-4 inline-flex items-center rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)]"
                            >
                                View Contacts
                            </Link>
                        </div>
                    ) : (
                        company.contacts.map((contact: any) => {
                            const name = [
                                contact.firstName,
                                contact.lastName,
                            ]
                                .filter(Boolean)
                                .join(" ");

                            const displayName =
                                name || contact.email || "Unnamed Contact";

                            const initials = displayName
                                .split(" ")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((part: string) => part[0]?.toUpperCase())
                                .join("");

                            return (
                                <Link
                                    key={contact.id}
                                    href={`/workspace/crm/contacts/${contact.id}`}
                                    className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--workspace-background)]"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-primary-soft)] text-xs font-semibold text-[var(--workspace-primary)]">
                                            {initials || "?"}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-[var(--workspace-text)] transition-colors group-hover:text-[var(--workspace-primary)]">
                                                {displayName}
                                            </p>

                                            <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                                {contact.jobTitle ||
                                                    contact.email ||
                                                    "Contact"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        <CompanyStatusBadge
                                            status={contact.status}
                                        />
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </WorkspaceCard>

            {/* Leads */}
            <WorkspaceCard>
                <WorkspaceCardHeader
                    title={`Leads (${company.leads.length})`}
                    description="Leads associated with this company."
                />

                <div className="divide-y divide-[var(--workspace-border)]">
                    {company.leads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                                <Target className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                                No leads yet
                            </h3>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                                There are no leads associated with this company yet.
                            </p>

                            <Link
                                href="/workspace/crm/leads"
                                className="mt-4 inline-flex items-center rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)]"
                            >
                                View Leads
                            </Link>
                        </div>
                    ) : (
                        company.leads.map((lead: any) => (
                            <Link
                                key={lead.id}
                                href={`/workspace/crm/leads/${lead.id}`}
                                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--workspace-background)]"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                        <Target className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-[var(--workspace-text)] transition-colors group-hover:text-[var(--workspace-primary)]">
                                            {lead.title}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                            {lead.source || lead.status || "Lead"}
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-semibold text-[var(--workspace-text)]">
                                        {formatCurrency(lead.value)}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                        {lead.status}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </WorkspaceCard>

            {/* Deals */}
            <WorkspaceCard>
                <WorkspaceCardHeader
                    title={`Deals (${company.deals.length})`}
                    description="Deals associated with this company."
                />

                <div className="divide-y divide-[var(--workspace-border)]">
                    {company.deals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                                <BriefcaseBusiness className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                                No deals yet
                            </h3>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                                There are no deals associated with this company yet.
                            </p>

                            <Link
                                href="/workspace/crm/deals"
                                className="mt-4 inline-flex items-center rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)]"
                            >
                                View Deals
                            </Link>
                        </div>
                    ) : (
                        company.deals.map((deal: any) => (
                            <Link
                                key={deal.id}
                                href={`/workspace/crm/deals/${deal.id}`}
                                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--workspace-background)]"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                        <BriefcaseBusiness className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-[var(--workspace-text)] transition-colors group-hover:text-[var(--workspace-primary)]">
                                            {deal.title}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                            {deal.stage || "Deal"}
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-semibold text-[var(--workspace-text)]">
                                        {formatCurrency(deal.value)}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-[var(--workspace-text-subtle)]">
                                        {formatDate(deal.createdAt)}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </WorkspaceCard>
        </div>
    );
}