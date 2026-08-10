import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    Globe,
    Mail,
    Phone,
    UserRound,
} from "lucide-react";

import { FaLinkedin } from 'react-icons/fa';



import {
    WorkspaceBreadcrumbs,
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

import ContactStatusBadge from "@/components/workspace/crm/contacts/ContactStatusBadge";

interface ContactDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

import { headers } from "next/headers";

async function getContact(id: string) {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/crm/contacts/${id}`,
        {
            cache: "no-store",
            headers: {
                cookie,
            },
        }
    );

    if (response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        throw new Error("Failed to fetch contact");
    }

    const data = await response.json();

    return data.contact;
}

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Mail;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                <Icon
                    size={16}
                    className="text-[var(--workspace-text-muted)]"
                />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                    {label}
                </p>

                <div className="mt-1 truncate text-sm text-[var(--workspace-text)]">
                    {value}
                </div>
            </div>
        </div>
    );
}

export default async function ContactDetailPage({
    params,
}: ContactDetailPageProps) {
    const { id } = await params;

    const contact = await getContact(id);

    const fullName = [
        contact.firstName,
        contact.lastName,
    ]
        .filter(Boolean)
        .join(" ");

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
                        label: "Contacts",
                        href: "/workspace/crm/contacts",
                    },
                    {
                        label: fullName,
                    },
                ]}
            />

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                    <Link href="/workspace/crm/contacts">
                        <WorkspaceButton
                            variant="ghost"
                            size="icon"
                            aria-label="Back to contacts"
                        >
                            <ArrowLeft size={18} />
                        </WorkspaceButton>
                    </Link>

                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                                {fullName}
                            </h1>

                            <ContactStatusBadge
                                status={contact.status}
                            />
                        </div>

                        <p className="mt-1 text-sm text-[var(--workspace-text-muted)]">
                            {contact.jobTitle ||
                                "Contact"}
                            {contact.company
                                ? ` at ${contact.company.name}`
                                : ""}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href={`/workspace/crm/contacts/${contact.id}/edit`}>
                        <WorkspaceButton className="cursor-pointer">
                            Edit Contact
                        </WorkspaceButton>
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <WorkspaceCard>
                    <div className="flex items-center gap-3 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                            <Mail
                                size={18}
                                className="text-[var(--workspace-primary)]"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                Email
                            </p>

                            <p className="mt-0.5 truncate text-sm font-medium text-[var(--workspace-text)]">
                                {contact.email ||
                                    "Not provided"}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard>
                    <div className="flex items-center gap-3 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                            <Phone
                                size={18}
                                className="text-[var(--workspace-primary)]"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                Phone
                            </p>

                            <p className="mt-0.5 truncate text-sm font-medium text-[var(--workspace-text)]">
                                {contact.phone ||
                                    "Not provided"}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard>
                    <div className="flex items-center gap-3 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                            <Building2
                                size={18}
                                className="text-[var(--workspace-primary)]"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                Company
                            </p>

                            {contact.company ? (
                                <Link
                                    href={`/workspace/crm/companies/${contact.company.id}`}
                                    className="mt-0.5 block truncate text-sm font-medium text-[var(--workspace-text)] hover:text-[var(--workspace-primary)]"
                                >
                                    {contact.company.name}
                                </Link>
                            ) : (
                                <p className="mt-0.5 text-sm font-medium text-[var(--workspace-text)]">
                                    No company
                                </p>
                            )}
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard>
                    <div className="flex items-center gap-3 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                            <UserRound
                                size={18}
                                className="text-[var(--workspace-primary)]"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                Owner
                            </p>

                            <p className="mt-0.5 truncate text-sm font-medium text-[var(--workspace-text)]">
                                {contact.owner?.name ||
                                    contact.owner?.email ||
                                    "Not assigned"}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Main Information */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Contact Information */}
                <WorkspaceCard className="lg:col-span-2">
                    <WorkspaceCardHeader
                        title="Contact Information"
                        description="Primary details for this contact."
                    />

                    <div className="grid gap-6 p-6 sm:grid-cols-2">
                        <InfoItem
                            icon={Mail}
                            label="Email"
                            value={
                                contact.email ? (
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="hover:text-[var(--workspace-primary)]"
                                    >
                                        {contact.email}
                                    </a>
                                ) : (
                                    "Not provided"
                                )
                            }
                        />

                        <InfoItem
                            icon={Phone}
                            label="Phone"
                            value={
                                contact.phone ? (
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="hover:text-[var(--workspace-primary)]"
                                    >
                                        {contact.phone}
                                    </a>
                                ) : (
                                    "Not provided"
                                )
                            }
                        />

                        <InfoItem
                            icon={Globe}
                            label="Website"
                            value={
                                contact.website ? (
                                    <a
                                        href={contact.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[var(--workspace-primary)]"
                                    >
                                        Visit website
                                    </a>
                                ) : (
                                    "Not provided"
                                )
                            }
                        />

                        <InfoItem
                            icon={FaLinkedin}
                            label="LinkedIn"
                            value={
                                contact.linkedinUrl ? (
                                    <a
                                        href={contact.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[var(--workspace-primary)]"
                                    >
                                        View LinkedIn
                                    </a>
                                ) : (
                                    "Not provided"
                                )
                            }
                        />
                    </div>
                </WorkspaceCard>

                {/* CRM Information */}
                <WorkspaceCard>
                    <WorkspaceCardHeader
                        title="CRM Information"
                        description="Classification and ownership."
                    />

                    <div className="space-y-5 p-6">
                        <div>
                            <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                                Status
                            </p>

                            <div className="mt-2">
                                <ContactStatusBadge
                                    status={contact.status}
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                                Source
                            </p>

                            <p className="mt-1 text-sm text-[var(--workspace-text)]">
                                {contact.source ||
                                    "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                                Owner
                            </p>

                            <p className="mt-1 text-sm text-[var(--workspace-text)]">
                                {contact.owner?.name ||
                                    contact.owner?.email ||
                                    "Not assigned"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                                Created
                            </p>

                            <div className="mt-1 flex items-center gap-2 text-sm text-[var(--workspace-text)]">
                                <CalendarDays size={14} />

                                {new Date(
                                    contact.createdAt
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Company */}
            <WorkspaceCard>
                <WorkspaceCardHeader
                    title="Company"
                    description="Company associated with this contact."
                />

                <div className="p-6">
                    {contact.company ? (
                        <Link
                            href={`/workspace/crm/companies/${contact.company.id}`}
                            className="font-medium text-[var(--workspace-text)] hover:text-[var(--workspace-primary)]"
                        >
                            {contact.company.name}
                        </Link>
                    ) : (
                        <p className="text-sm text-[var(--workspace-text-muted)]">
                            No company associated with
                            this contact.
                        </p>
                    )}
                </div>
            </WorkspaceCard>

            {/* Description */}
            <WorkspaceCard>
                <WorkspaceCardHeader
                    title="Description"
                    description="Additional information about this contact."
                />

                <div className="p-6">
                    {contact.description ? (
                        <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--workspace-text-muted)]">
                            {contact.description}
                        </p>
                    ) : (
                        <p className="text-sm text-[var(--workspace-text-muted)]">
                            No description added.
                        </p>
                    )}
                </div>
            </WorkspaceCard>

            {/* Related Records */}
            <WorkspaceCard>
                <WorkspaceCardHeader
                    title="Related Records"
                    description="CRM records associated with this contact."
                />

                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: "Leads",
                            value:
                                contact.leads?.length ?? 0,
                        },
                        {
                            label: "Deals",
                            value:
                                contact.deals?.length ?? 0,
                        },
                        {
                            label: "Notes",
                            value:
                                contact.notes?.length ?? 0,
                        },
                        {
                            label: "Activities",
                            value:
                                contact.activities?.length ??
                                0,
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-4"
                        >
                            <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                                {item.label}
                            </p>

                            <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </WorkspaceCard>
        </div>
    );
}