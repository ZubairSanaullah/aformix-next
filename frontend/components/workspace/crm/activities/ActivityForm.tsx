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

interface ActivityFormCompany {
    id: string;
    name: string;
}

interface ActivityFormContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface ActivityFormLead {
    id: string;
    title: string;
}

interface ActivityFormDeal {
    id: string;
    title: string;
}

interface ActivityFormProps {
    companies: ActivityFormCompany[];
    contacts: ActivityFormContact[];
    leads: ActivityFormLead[];
    deals: ActivityFormDeal[];
    onCancel: () => void;
    // Optional pre-selected relationship, used when logging an activity
    // directly from a Contact/Company/Lead/Deal detail page.
    defaultRelation?: {
        contactId?: string;
        companyId?: string;
        leadId?: string;
        dealId?: string;
    };
}

const typeOptions = [
    { value: "CALL", label: "Call" },
    { value: "EMAIL", label: "Email" },
    { value: "MEETING", label: "Meeting" },
    { value: "FOLLOW_UP", label: "Follow-up" },
    { value: "NOTE", label: "Note" },
    { value: "OTHER", label: "Other" },
] as const;

type ActivityFormType = (typeof typeOptions)[number]["value"];

function toDateTimeLocal(value: string) {
    if (!value) return undefined;
    return new Date(value).toISOString();
}

export default function ActivityForm({
    companies,
    contacts,
    leads,
    deals,
    onCancel,
    defaultRelation,
}: ActivityFormProps) {
    const router = useRouter();

    const [type, setType] = useState<ActivityFormType>("CALL");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueAt, setDueAt] = useState("");

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

        if (!title.trim()) {
            setError("Activity title is required.");
            return;
        }

        if (!contactId && !companyId && !leadId && !dealId) {
            setError(
                "Link this activity to at least one contact, company, lead, or deal."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/crm/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    title: title.trim(),
                    description: description.trim() || undefined,
                    dueAt: toDateTimeLocal(dueAt),
                    contactId: contactId || undefined,
                    companyId: companyId || undefined,
                    leadId: leadId || undefined,
                    dealId: dealId || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error || "Failed to log activity"
                );
            }

            router.refresh();
            onCancel();
        } catch (err) {
            console.error("Create activity error:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to log activity"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title="Log Activity"
                description="Record a call, email, meeting, or follow-up."
                action={
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Close activity form"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                }
            />

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="activity-title"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Title
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <input
                            id="activity-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="e.g. Discovery call with client"
                            className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label
                            htmlFor="activity-type"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Type
                        </label>

                        <select
                            id="activity-type"
                            value={type}
                            onChange={(event) =>
                                setType(
                                    event.target
                                        .value as ActivityFormType
                                )
                            }
                            className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                        >
                            {typeOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Due date */}
                    <div>
                        <label
                            htmlFor="activity-due"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Due Date
                        </label>

                        <input
                            id="activity-due"
                            type="datetime-local"
                            value={dueAt}
                            onChange={(event) =>
                                setDueAt(event.target.value)
                            }
                            className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="activity-description"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Description
                        </label>

                        <textarea
                            id="activity-description"
                            rows={4}
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Notes about this activity..."
                            className="w-full resize-none rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm leading-6 text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                        />
                    </div>
                </div>

                {/* Relationships */}
                <div className="space-y-4 border-t border-[var(--workspace-border)] pt-6">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Link To
                        </h3>

                        <p className="mt-1 text-xs text-[var(--workspace-text-subtle)]">
                            Attach this activity to at least one
                            contact, company, lead, or deal.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Contact */}
                        <div>
                            <label
                                htmlFor="activity-contact"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <User className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Contact
                            </label>

                            <select
                                id="activity-contact"
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
                                htmlFor="activity-company"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <Building2 className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Company
                            </label>

                            <select
                                id="activity-company"
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
                                htmlFor="activity-lead"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <Target className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Lead
                            </label>

                            <select
                                id="activity-lead"
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
                                htmlFor="activity-deal"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <BriefcaseBusiness className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Deal
                            </label>

                            <select
                                id="activity-deal"
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
                        {isSubmitting
                            ? "Logging..."
                            : "Log Activity"}
                    </WorkspaceButton>
                </div>
            </form>
        </WorkspaceCard>
    );
}