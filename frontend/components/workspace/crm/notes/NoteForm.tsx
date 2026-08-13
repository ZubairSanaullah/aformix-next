"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Building2,
    Target,
    User,
    BriefcaseBusiness,
    X,
} from "lucide-react";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

interface NoteFormCompany {
    id: string;
    name: string;
}

interface NoteFormContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface NoteFormLead {
    id: string;
    title: string;
}

interface NoteFormDeal {
    id: string;
    title: string;
}

interface NoteFormProps {
    companies: NoteFormCompany[];
    contacts: NoteFormContact[];
    leads: NoteFormLead[];
    deals: NoteFormDeal[];
    onCancel: () => void;
    // Optional pre-selected relationship, used when adding a note
    // directly from a Contact/Company/Lead/Deal detail page.
    defaultRelation?: {
        contactId?: string;
        companyId?: string;
        leadId?: string;
        dealId?: string;
    };
}

export default function NoteForm({
    companies,
    contacts,
    leads,
    deals,
    onCancel,
    defaultRelation,
}: NoteFormProps) {
    const router = useRouter();

    const [content, setContent] = useState("");

    const [contactId, setContactId] = useState(
        defaultRelation?.contactId ?? ""
    );
    const [companyId, setCompanyId] = useState(
        defaultRelation?.companyId ?? ""
    );
    const [leadId, setLeadId] = useState(
        defaultRelation?.leadId ?? ""
    );
    const [dealId, setDealId] = useState(
        defaultRelation?.dealId ?? ""
    );

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (!content.trim()) {
            setError("Note content is required.");
            return;
        }

        if (!contactId && !companyId && !leadId && !dealId) {
            setError(
                "Link this note to at least one contact, company, lead, or deal."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/crm/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: content.trim(),
                    contactId: contactId || undefined,
                    companyId: companyId || undefined,
                    leadId: leadId || undefined,
                    dealId: dealId || undefined,
                }),
            });

            const rawText = await response.text();
            const data = rawText ? JSON.parse(rawText) : null;

            if (!response.ok) {
                throw new Error(
                    data?.error || "Failed to add note"
                );
            }

            router.refresh();
            onCancel();
        } catch (err) {
            console.error("Create note error:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to add note"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title="Add Note"
                description="Write a freeform note and link it to a CRM record."
                action={
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Close note form"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                }
            />

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {/* Content */}
                <div>
                    <label
                        htmlFor="note-content"
                        className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                    >
                        Note
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <textarea
                        id="note-content"
                        rows={6}
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        placeholder="Write your note..."
                        className="w-full resize-none rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm leading-6 text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                    />
                </div>

                {/* Relationships */}
                <div className="space-y-4 border-t border-[var(--workspace-border)] pt-6">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Link To
                        </h3>

                        <p className="mt-1 text-xs text-[var(--workspace-text-subtle)]">
                            Attach this note to at least one contact,
                            company, lead, or deal.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Contact */}
                        <div>
                            <label
                                htmlFor="note-contact"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <User className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Contact
                            </label>

                            <select
                                id="note-contact"
                                value={contactId}
                                onChange={(event) =>
                                    setContactId(event.target.value)
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                <option value="">No contact</option>
                                {contacts.map((contact) => {
                                    const name = [
                                        contact.firstName,
                                        contact.lastName,
                                    ]
                                        .filter(Boolean)
                                        .join(" ");

                                    return (
                                        <option
                                            key={contact.id}
                                            value={contact.id}
                                        >
                                            {name ||
                                                contact.email ||
                                                "Unnamed Contact"}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Company */}
                        <div>
                            <label
                                htmlFor="note-company"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <Building2 className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Company
                            </label>

                            <select
                                id="note-company"
                                value={companyId}
                                onChange={(event) =>
                                    setCompanyId(event.target.value)
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                <option value="">No company</option>
                                {companies.map((company) => (
                                    <option
                                        key={company.id}
                                        value={company.id}
                                    >
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Lead */}
                        <div>
                            <label
                                htmlFor="note-lead"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <Target className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Lead
                            </label>

                            <select
                                id="note-lead"
                                value={leadId}
                                onChange={(event) =>
                                    setLeadId(event.target.value)
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                <option value="">No lead</option>
                                {leads.map((lead) => (
                                    <option
                                        key={lead.id}
                                        value={lead.id}
                                    >
                                        {lead.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Deal */}
                        <div>
                            <label
                                htmlFor="note-deal"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <BriefcaseBusiness className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Deal
                            </label>

                            <select
                                id="note-deal"
                                value={dealId}
                                onChange={(event) =>
                                    setDealId(event.target.value)
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                <option value="">No deal</option>
                                {deals.map((deal) => (
                                    <option
                                        key={deal.id}
                                        value={deal.id}
                                    >
                                        {deal.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col-reverse gap-2 border-t border-[var(--workspace-border)] pt-5 sm:flex-row sm:justify-end">
                    <WorkspaceButton
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </WorkspaceButton>

                    <WorkspaceButton
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Add Note"}
                    </WorkspaceButton>
                </div>
            </form>
        </WorkspaceCard>
    );
}