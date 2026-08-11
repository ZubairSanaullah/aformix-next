"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Building2,
    User,
    X,
} from "lucide-react";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

import {
    leadSchema,
    type LeadInput,
} from "@/lib/validations/lead";

interface LeadFormCompany {
    id: string;
    name: string;
}

interface LeadFormContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface LeadFormProps {
    companies: LeadFormCompany[];
    contacts: LeadFormContact[];
    onCancel: () => void;
}

const statusOptions = [
    { value: "NEW", label: "New" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "CONVERTED", label: "Converted" },
    { value: "LOST", label: "Lost" },
] as const;

const sourceOptions = [
    { value: "WEBSITE", label: "Website" },
    { value: "LINKEDIN", label: "LinkedIn" },
    { value: "INSTAGRAM", label: "Instagram" },
    { value: "FACEBOOK", label: "Facebook" },
    { value: "REFERRAL", label: "Referral" },
    { value: "EMAIL", label: "Email" },
    { value: "COLD_OUTREACH", label: "Cold Outreach" },
    { value: "GOOGLE", label: "Google" },
    { value: "OTHER", label: "Other" },
] as const;

export default function LeadForm({
    companies,
    contacts,
    onCancel,
}: LeadFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<LeadInput>({
        title: "",
        description: "",
        status: "NEW",
        source: undefined,
        value: undefined,
        contactId: "",
        companyId: "",
    });

    const [errors, setErrors] =
        useState<Record<string, string>>({});

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [submitError, setSubmitError] =
        useState("");

    const updateField = <
        K extends keyof LeadInput
    >(
        field: K,
        value: LeadInput[K]
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => {
            if (!current[field]) {
                return current;
            }

            const next = {
                ...current,
            };

            delete next[field];

            return next;
        });

        setSubmitError("");
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setSubmitError("");
        setErrors({});

        /*
         * Build a clean payload before validation.
         * Empty relationship/source values are converted
         * to undefined so the API receives consistent data.
         */
        const payload = {
            title: form.title,
            description:
                form.description?.trim() || "",
            status: form.status || "NEW",
            source: form.source || undefined,
            value:
                form.value === undefined ||
                    form.value === null
                    ? undefined
                    : Number(form.value),
            contactId:
                form.contactId || undefined,
            companyId:
                form.companyId || undefined,
        };

        /*
         * Validate the payload.
         */
        const result =
            leadSchema.safeParse(payload);

        if (!result.success) {
            const fieldErrors: Record<
                string,
                string
            > = {};

            const flattened =
                result.error.flatten();

            Object.entries(
                flattened.fieldErrors
            ).forEach(
                ([field, messages]) => {
                    if (
                        messages &&
                        messages.length > 0
                    ) {
                        fieldErrors[field] =
                            messages[0] ?? "";
                    }
                }
            );

            setErrors(fieldErrors);

            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                "/api/crm/leads",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        result.data
                    ),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Failed to create lead"
                );
            }

            router.refresh();
            onCancel();
        } catch (error) {
            console.error(
                "Create lead error:",
                error
            );

            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Failed to create lead"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title="Create Lead"
                description="Add a new lead to your CRM pipeline."
                action={
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Close lead form"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                }
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >
                {/* Lead Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Lead Information
                        </h3>

                        <p className="mt-1 text-xs text-[var(--workspace-text-subtle)]">
                            Basic information about
                            this lead.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="lead-title"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Lead Title
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="lead-title"
                                type="text"
                                value={form.title}
                                onChange={(event) =>
                                    updateField(
                                        "title",
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Website redesign project"
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                            />

                            {errors.title && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.title}
                                </p>
                            )}
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
                                value={form.status}
                                onChange={(event) =>
                                    updateField(
                                        "status",
                                        event.target.value as LeadInput["status"]
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
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
                                value={
                                    form.source ?? ""
                                }
                                onChange={(event) =>
                                    updateField(
                                        "source",
                                        event.target
                                            .value
                                            ? (event.target.value as LeadInput["source"])
                                            : undefined
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                <option value="">
                                    Select source
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
                                value={
                                    form.value ??
                                    ""
                                }
                                onChange={(event) => {
                                    const value =
                                        event.target
                                            .value;

                                    updateField(
                                        "value",
                                        value === ""
                                            ? undefined
                                            : Number(
                                                value
                                            )
                                    );
                                }}
                                placeholder="0.00"
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                            />

                            {errors.value && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.value}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="lead-description"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Description
                        </label>

                        <textarea
                            id="lead-description"
                            rows={4}
                            value={
                                form.description ??
                                ""
                            }
                            onChange={(event) =>
                                updateField(
                                    "description",
                                    event.target.value
                                )
                            }
                            placeholder="Add notes or additional information about this lead..."
                            className="w-full resize-none rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm leading-6 text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                        />

                        {errors.description && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Relationships */}
                <div className="space-y-4 border-t border-[var(--workspace-border)] pt-6">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Relationships
                        </h3>

                        <p className="mt-1 text-xs text-[var(--workspace-text-subtle)]">
                            Optionally associate
                            this lead with a
                            contact or company.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Contact */}
                        <div>
                            <label
                                htmlFor="lead-contact"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <User className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Contact
                            </label>

                            <select
                                id="lead-contact"
                                value={
                                    form.contactId ??
                                    ""
                                }
                                onChange={(event) =>
                                    updateField(
                                        "contactId",
                                        event.target
                                            .value
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                <option value="">
                                    No contact
                                </option>

                                {contacts.map(
                                    (contact) => {
                                        const name =
                                            [
                                                contact.firstName,
                                                contact.lastName,
                                            ]
                                                .filter(
                                                    Boolean
                                                )
                                                .join(" ");

                                        return (
                                            <option
                                                key={
                                                    contact.id
                                                }
                                                value={
                                                    contact.id
                                                }
                                            >
                                                {name ||
                                                    contact.email ||
                                                    "Unnamed Contact"}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>

                        {/* Company */}
                        <div>
                            <label
                                htmlFor="lead-company"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <Building2 className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Company
                            </label>

                            <select
                                id="lead-company"
                                value={
                                    form.companyId ??
                                    ""
                                }
                                onChange={(event) =>
                                    updateField(
                                        "companyId",
                                        event.target
                                            .value
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
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
                    </div>
                </div>

                {submitError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                        {submitError}
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
                            ? "Creating..."
                            : "Create Lead"}
                    </WorkspaceButton>
                </div>
            </form>
        </WorkspaceCard>
    );
}
