"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

type ActivityType =
    | "CALL"
    | "EMAIL"
    | "MEETING"
    | "FOLLOW_UP"
    | "NOTE"
    | "OTHER";

interface ActivityEditFormProps {
    activity: {
        id: string;
        type: ActivityType;
        title: string;
        description: string | null;
        dueAt: string | null;
        completedAt: string | null;
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

const typeOptions: { value: ActivityType; label: string }[] = [
    { value: "CALL", label: "Call" },
    { value: "EMAIL", label: "Email" },
    { value: "MEETING", label: "Meeting" },
    { value: "FOLLOW_UP", label: "Follow-up" },
    { value: "NOTE", label: "Note" },
    { value: "OTHER", label: "Other" },
];

function toLocalInputValue(value: string | null) {
    if (!value) return "";

    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);

    return local.toISOString().slice(0, 16);
}

export default function ActivityEditForm({
    activity,
    companies,
    contacts,
    leads,
    deals,
}: ActivityEditFormProps) {
    const router = useRouter();

    const [type, setType] = useState<ActivityType>(activity.type);
    const [title, setTitle] = useState(activity.title);
    const [description, setDescription] = useState(
        activity.description ?? ""
    );
    const [dueAt, setDueAt] = useState(
        toLocalInputValue(activity.dueAt)
    );
    const [completed, setCompleted] = useState(
        Boolean(activity.completedAt)
    );

    const [contactId, setContactId] = useState(
        activity.contactId ?? ""
    );
    const [companyId, setCompanyId] = useState(
        activity.companyId ?? ""
    );
    const [leadId, setLeadId] = useState(activity.leadId ?? "");
    const [dealId, setDealId] = useState(activity.dealId ?? "");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

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
            const response = await fetch(
                `/api/crm/activities/${activity.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type,
                        title: title.trim(),
                        description: description.trim() || undefined,
                        dueAt: dueAt
                            ? new Date(dueAt).toISOString()
                            : null,
                        completedAt: completed
                            ? activity.completedAt ??
                            new Date().toISOString()
                            : null,
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
                    data?.error || "Failed to update activity."
                );
            }

            router.push("/workspace/crm/activities");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update activity."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCancel() {
        router.push("/workspace/crm/activities");
    }

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title="Activity Information"
                description="Update the details of this activity."
            />

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="activity-title"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Title
                        </label>

                        <input
                            id="activity-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            disabled={isSubmitting}
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
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
                                        .value as ActivityType
                                )
                            }
                            disabled={isSubmitting}
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
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
                            disabled={isSubmitting}
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        />
                    </div>

                    {/* Completed */}
                    <div className="flex items-center gap-2 md:col-span-2">
                        <input
                            id="activity-completed"
                            type="checkbox"
                            checked={completed}
                            onChange={(event) =>
                                setCompleted(event.target.checked)
                            }
                            disabled={isSubmitting}
                            className="h-4 w-4 rounded border-[var(--workspace-border)] text-[var(--workspace-primary)] focus:ring-[var(--workspace-primary)]"
                        />

                        <label
                            htmlFor="activity-completed"
                            className="text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Mark as completed
                        </label>
                    </div>

                    {/* Contact */}
                    <div>
                        <label
                            htmlFor="activity-contact"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Contact
                        </label>

                        <select
                            id="activity-contact"
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
                            htmlFor="activity-company"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Company
                        </label>

                        <select
                            id="activity-company"
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
                            htmlFor="activity-lead"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Lead
                        </label>

                        <select
                            id="activity-lead"
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
                            htmlFor="activity-deal"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Deal
                        </label>

                        <select
                            id="activity-deal"
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
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows={5}
                            disabled={isSubmitting}
                            className="w-full resize-none rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        />
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
                        disabled={isSubmitting || !title.trim()}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </WorkspaceButton>
                </div>
            </form>
        </WorkspaceCard>
    );
}