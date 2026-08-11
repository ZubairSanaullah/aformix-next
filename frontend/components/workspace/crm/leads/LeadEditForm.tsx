"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

interface LeadEditFormProps {
    lead: {
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
}

type LeadStatus =
    | "NEW"
    | "CONTACTED"
    | "QUALIFIED"
    | "CONVERTED"
    | "LOST";

type LeadSource =
    | "WEBSITE"
    | "LINKEDIN"
    | "INSTAGRAM"
    | "FACEBOOK"
    | "REFERRAL"
    | "EMAIL"
    | "COLD_OUTREACH"
    | "GOOGLE"
    | "OTHER";

const statusOptions: {
    value: LeadStatus;
    label: string;
}[] = [
        {
            value: "NEW",
            label: "New",
        },
        {
            value: "CONTACTED",
            label: "Contacted",
        },
        {
            value: "QUALIFIED",
            label: "Qualified",
        },
        {
            value: "CONVERTED",
            label: "Converted",
        },
        {
            value: "LOST",
            label: "Lost",
        },
    ];

const sourceOptions: {
    value: LeadSource;
    label: string;
}[] = [
        {
            value: "WEBSITE",
            label: "Website",
        },
        {
            value: "LINKEDIN",
            label: "LinkedIn",
        },
        {
            value: "INSTAGRAM",
            label: "Instagram",
        },
        {
            value: "FACEBOOK",
            label: "Facebook",
        },
        {
            value: "REFERRAL",
            label: "Referral",
        },
        {
            value: "EMAIL",
            label: "Email",
        },
        {
            value: "COLD_OUTREACH",
            label: "Cold Outreach",
        },
        {
            value: "GOOGLE",
            label: "Google",
        },
        {
            value: "OTHER",
            label: "Other",
        },
    ];

function getInitialValue(
    value: unknown
) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value);
}

export default function LeadEditForm({
    lead,
    companies,
    contacts,
}: LeadEditFormProps) {
    const router = useRouter();

    const [title, setTitle] =
        useState(lead.title);

    const [description, setDescription] =
        useState(lead.description ?? "");

    const [status, setStatus] =
        useState<LeadStatus>(lead.status);

    const [source, setSource] =
        useState<LeadSource | "">(
            lead.source ?? ""
        );

    const [value, setValue] =
        useState(
            getInitialValue(lead.value)
        );

    const [contactId, setContactId] =
        useState(lead.contactId ?? "");

    const [companyId, setCompanyId] =
        useState(lead.companyId ?? "");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

        if (!title.trim()) {
            setError(
                "Lead title is required."
            );

            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                `/api/crm/leads/${lead.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        title: title.trim(),

                        description:
                            description.trim(),

                        status,

                        source:
                            source || undefined,

                        value:
                            value.trim()
                                ? Number(value)
                                : undefined,

                        contactId:
                            contactId || undefined,

                        companyId:
                            companyId || undefined,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Failed to update lead."
                );
            }

            router.push(
                `/workspace/crm/leads/${lead.id}`
            );

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update lead."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCancel() {
        router.push(
            `/workspace/crm/leads/${lead.id}`
        );
    }

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title="Lead Information"
                description="Update the information associated with this lead."
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="lead-title"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Lead Title
                        </label>

                        <input
                            id="lead-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label
                            htmlFor="lead-status"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Status
                        </label>

                        <select
                            id="lead-status"
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target
                                        .value as LeadStatus
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        >
                            {statusOptions.map(
                                (option) => (
                                    <option
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Source */}
                    <div>
                        <label
                            htmlFor="lead-source"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Source
                        </label>

                        <select
                            id="lead-source"
                            value={source}
                            onChange={(event) =>
                                setSource(
                                    event.target
                                        .value as
                                    | LeadSource
                                    | ""
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        >
                            <option value="">
                                No source
                            </option>

                            {sourceOptions.map(
                                (option) => (
                                    <option
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Value */}
                    <div>
                        <label
                            htmlFor="lead-value"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Estimated Value
                        </label>

                        <input
                            id="lead-value"
                            type="number"
                            min="0"
                            step="0.01"
                            value={value}
                            onChange={(event) =>
                                setValue(
                                    event.target.value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        />
                    </div>

                    {/* Contact */}
                    <div>
                        <label
                            htmlFor="lead-contact"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Contact
                        </label>

                        <select
                            id="lead-contact"
                            value={contactId}
                            onChange={(event) =>
                                setContactId(
                                    event.target.value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        >
                            <option value="">
                                No contact
                            </option>

                            {contacts.map(
                                (contact) => (
                                    <option
                                        key={
                                            contact.id
                                        }
                                        value={
                                            contact.id
                                        }
                                    >
                                        {[
                                            contact.firstName,
                                            contact.lastName,
                                        ]
                                            .filter(
                                                Boolean
                                            )
                                            .join(
                                                " "
                                            ) ||
                                            contact.email ||
                                            "Unnamed Contact"}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Company */}
                    <div>
                        <label
                            htmlFor="lead-company"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Company
                        </label>

                        <select
                            id="lead-company"
                            value={companyId}
                            onChange={(event) =>
                                setCompanyId(
                                    event.target.value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        >
                            <option value="">
                                No company
                            </option>

                            {companies.map(
                                (company) => (
                                    <option
                                        key={
                                            company.id
                                        }
                                        value={
                                            company.id
                                        }
                                    >
                                        {
                                            company.name
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="lead-description"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Description
                        </label>

                        <textarea
                            id="lead-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows={5}
                            disabled={
                                isSubmitting
                            }
                            className="w-full resize-none rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)] disabled:opacity-60"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[var(--workspace-border)] pt-5">
                    <WorkspaceButton
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={
                            isSubmitting
                        }
                    >
                        Cancel
                    </WorkspaceButton>

                    <WorkspaceButton
                        type="submit"
                        disabled={
                            isSubmitting ||
                            !title.trim()
                        }
                    >
                        {isSubmitting
                            ? "Saving..."
                            : "Save Changes"}
                    </WorkspaceButton>
                </div>
            </form>
        </WorkspaceCard>
    );
}