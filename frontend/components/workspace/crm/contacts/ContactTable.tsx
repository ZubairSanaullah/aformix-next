import Link from "next/link";

import {
    WorkspaceTable,
    WorkspaceTableHeader,
    WorkspaceTableHead,
    WorkspaceTableBody,
    WorkspaceTableRow,
    WorkspaceTableCell,
} from "@/components/workspace/ui";

import ContactStatusBadge from "./ContactStatusBadge";
import ContactActions from "./ContactActions";

interface Contact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    jobTitle: string | null;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    company: {
        id: string;
        name: string;
    } | null;
}

interface ContactTableProps {
    contacts: Contact[];
}

export default function ContactTable({
    contacts,
}: ContactTableProps) {
    if (contacts.length === 0) {
        return (
            <div className="rounded-2xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-6 py-12 text-center">
                <p className="text-sm font-medium text-[var(--workspace-text)]">
                    No contacts found
                </p>

                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    Add your first contact to start building your CRM.
                </p>
            </div>
        );
    }

    return (
        <WorkspaceTable>
            <WorkspaceTableHeader>
                <WorkspaceTableRow>
                    <WorkspaceTableHead>
                        Contact
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Company
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Contact Info
                    </WorkspaceTableHead>

                    <WorkspaceTableHead>
                        Status
                    </WorkspaceTableHead>

                    <WorkspaceTableHead className="text-right">
                        Actions
                    </WorkspaceTableHead>
                </WorkspaceTableRow>
            </WorkspaceTableHeader>

            <WorkspaceTableBody>
                {contacts.map((contact) => {
                    const fullName = [
                        contact.firstName,
                        contact.lastName,
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <WorkspaceTableRow key={contact.id}>
                            {/* Contact */}
                            <WorkspaceTableCell>
                                <div className="min-w-0">
                                    <Link
                                        href={`/workspace/crm/contacts/${contact.id}`}
                                        className="
                                            block
                                            truncate
                                            text-sm
                                            font-medium
                                            text-[var(--workspace-text)]
                                            transition-colors
                                            hover:text-[var(--workspace-primary)]
                                        "
                                    >
                                        {fullName}
                                    </Link>

                                    {contact.jobTitle && (
                                        <p className="mt-0.5 truncate text-xs text-[var(--workspace-text-muted)]">
                                            {contact.jobTitle}
                                        </p>
                                    )}
                                </div>
                            </WorkspaceTableCell>

                            {/* Company */}
                            <WorkspaceTableCell>
                                {contact.company ? (
                                    <Link
                                        href={`/workspace/crm/companies/${contact.company.id}`}
                                        className="
                                            text-xs
                                            font-medium
                                            text-[var(--workspace-text-muted)]
                                            transition-colors
                                            hover:text-[var(--workspace-primary)]
                                        "
                                    >
                                        {contact.company.name}
                                    </Link>
                                ) : (
                                    <span className="text-xs text-[var(--workspace-text-subtle)]">
                                        No company
                                    </span>
                                )}
                            </WorkspaceTableCell>

                            {/* Contact Info */}
                            <WorkspaceTableCell>
                                <div className="space-y-0.5">
                                    {contact.email && (
                                        <p className="truncate text-xs text-[var(--workspace-text-muted)]">
                                            {contact.email}
                                        </p>
                                    )}

                                    {contact.phone && (
                                        <p className="text-xs text-[var(--workspace-text-subtle)]">
                                            {contact.phone}
                                        </p>
                                    )}

                                    {!contact.email &&
                                        !contact.phone && (
                                            <span className="text-xs text-[var(--workspace-text-subtle)]">
                                                No contact info
                                            </span>
                                        )}
                                </div>
                            </WorkspaceTableCell>

                            {/* Status */}
                            <WorkspaceTableCell>
                                <ContactStatusBadge
                                    status={contact.status}
                                />
                            </WorkspaceTableCell>

                            {/* Actions */}
                            <WorkspaceTableCell className="text-right">
                                <ContactActions
                                    contactId={contact.id}
                                />
                            </WorkspaceTableCell>
                        </WorkspaceTableRow>
                    );
                })}
            </WorkspaceTableBody>
        </WorkspaceTable>
    );
}