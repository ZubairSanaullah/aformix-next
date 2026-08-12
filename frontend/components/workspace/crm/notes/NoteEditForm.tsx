"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

interface NoteEditFormProps {
    note: {
        id: string;
        content: string;
        contactId: string | null;
        companyId: string | null;
        leadId: string | null;
        dealId: string | null;
    };

    companies: {
        id: string;
        name: string;
    }[];

    contacts: {
        id: string;
        firstName: string;
        lastName: string | null;
        email: string | null;
    }[];

    leads: {
        id: string;
        title: string;
    }[];

    deals: {
        id: string;
        title: string;
    }[];
}

export default function NoteEditForm({
    note,
    companies,
    contacts,
    leads,
    deals,
}: NoteEditFormProps) {
    const router = useRouter();

    const [content, setContent] = useState(note.content);

    const [contactId, setContactId] = useState(
        note.contactId ?? ""
    );
    const [companyId, setCompanyId] = useState(
        note.companyId ?? ""
    );
    const [leadId, setLeadId] = useState(note.leadId ?? "");
    const [dealId, setDealId] = useState(note.dealId ?? "");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

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
            const response = await fetch(
                `/api/crm/notes/${note.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: content.trim(),
                        contactId: contactId || undefined,
                        companyId: companyId || undefined,
                        leadId: leadId || undefined,
                        dealId: dealId || undefined,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error || "Failed to update note."
                );
            }

            router.push("/workspace/crm/notes");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update note."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCancel() {
        router.push("/workspace/crm/notes");
    }

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title="Note"
                description="Update the note content and its relationships."
            />

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                        {error}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="note-content"
                        className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                    >
                        Note
                    </label>

                    <textarea
                        id="note-content"
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        rows={8}
                        disabled={isSubmitting}
                        className="w-full resize-none rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 py-2.5 text-sm leading-6 text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                    />
                </div>

                <div className="grid gap-5 border-t border-[var(--workspace-border)] pt-5 md:grid-cols-2">
                    {/* Contact */}
                    <div>
                        <label
                            htmlFor="note-contact"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Contact
                        </label>

                        <select
                            id="note-contact"
                            value={contactId}
                            onChange={(event) =>
                                setContactId(event.target.value)
                            }
                            disabled={isSubmitting}
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        >
                            <option value="">No contact</option>
                            {contacts.map((contact) => (
                                <option
                                    key={contact.id}
                                    value={contact.id}
                                >
                                    {[
                                        contact.firstName,
                                        contact.lastName,
                                    ]
                                        .filter(Boolean)
                                        .join(" ") ||
                                        contact.email ||
                                        "Unnamed Contact"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Company */}
                    <div>
                        <label
                            htmlFor="note-company"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Company
                        </label>

                        <select
                            id="note-company"
                            value={companyId}
                            onChange={(event) =>
                                setCompanyId(event.target.value)
                            }
                            disabled={isSubmitting}
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
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
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Lead
                        </label>

                        <select
                            id="note-lead"
                            value={leadId}
                            onChange={(event) =>
                                setLeadId(event.target.value)
                            }
                            disabled={isSubmitting}
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        >
                            <option value="">No lead</option>
                            {leads.map((lead) => (
                                <option key={lead.id} value={lead.id}>
                                    {lead.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Deal */}
                    <div>
                        <label
                            htmlFor="note-deal"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Deal
                        </label>

                        <select
                            id="note-deal"
                            value={dealId}
                            onChange={(event) =>
                                setDealId(event.target.value)
                            }
                            disabled={isSubmitting}
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        >
                            <option value="">No deal</option>
                            {deals.map((deal) => (
                                <option key={deal.id} value={deal.id}>
                                    {deal.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[var(--workspace-border)] pt-5">
                    <WorkspaceButton
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </WorkspaceButton>

                    <WorkspaceButton
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </WorkspaceButton>
                </div>
            </form>
        </WorkspaceCard>
    );
}