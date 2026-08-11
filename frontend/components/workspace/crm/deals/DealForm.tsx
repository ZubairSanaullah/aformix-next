"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Building2,
    Target,
    User,
    X,
} from "lucide-react";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

import {
    dealSchema,
    type DealInput,
} from "@/lib/validations/deal";

interface DealFormCompany {
    id: string;
    name: string;
}

interface DealFormContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface DealFormLead {
    id: string;
    title: string;
}

interface DealFormPipeline {
    id: string;
    name: string;
    stages: {
        id: string;
        name: string;
    }[];
}

interface DealFormProps {
    companies: DealFormCompany[];
    contacts: DealFormContact[];
    leads: DealFormLead[];
    pipelines: DealFormPipeline[];
    onCancel: () => void;
}

export default function DealForm({
    companies,
    contacts,
    leads,
    pipelines,
    onCancel,
}: DealFormProps) {
    const router = useRouter();

    const defaultPipeline = pipelines[0];

    const [form, setForm] = useState<Partial<DealInput>>({
        title: "",
        description: "",
        pipelineId: defaultPipeline?.id ?? "",
        stageId:
            defaultPipeline?.stages[0]?.id ?? "",
        value: undefined,
        contactId: "",
        companyId: "",
        leadId: "",
    });

    const [errors, setErrors] =
        useState<Record<string, string>>({});

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [submitError, setSubmitError] =
        useState("");

    const activePipeline = pipelines.find(
        (pipeline) => pipeline.id === form.pipelineId
    );

    const updateField = <
        K extends keyof DealInput
    >(
        field: K,
        value: DealInput[K]
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

    const handlePipelineChange = (
        pipelineId: string
    ) => {
        const pipeline = pipelines.find(
            (item) => item.id === pipelineId
        );

        setForm((current) => ({
            ...current,
            pipelineId,
            // Reset stage since stages belong to a pipeline
            stageId:
                pipeline?.stages[0]?.id ?? "",
        }));

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
         * Empty relationship values are converted
         * to undefined so the API receives consistent data.
         * ownerId is assigned server-side from the session.
         */
        const payload = {
            title: form.title,
            description:
                form.description?.trim() || "",
            pipelineId: form.pipelineId,
            stageId: form.stageId,
            value:
                form.value === undefined ||
                    form.value === null
                    ? undefined
                    : Number(form.value),
            contactId:
                form.contactId || undefined,
            companyId:
                form.companyId || undefined,
            leadId:
                form.leadId || undefined,
        };

        /*
         * Validate the payload (excluding ownerId,
         * which the API route assigns from the session).
         */
        const result = dealSchema
            .omit({ ownerId: true })
            .safeParse(payload);

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
                "/api/crm/deals",
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
                    "Failed to create deal"
                );
            }

            router.refresh();
            onCancel();
        } catch (error) {
            console.error(
                "Create deal error:",
                error
            );

            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Failed to create deal"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title="Create Deal"
                description="Add a new deal to your CRM pipeline."
                action={
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Close deal form"
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
                {/* Deal Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Deal Information
                        </h3>

                        <p className="mt-1 text-xs text-[var(--workspace-text-subtle)]">
                            Basic information about
                            this deal.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="deal-title"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Deal Title
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="deal-title"
                                type="text"
                                value={form.title ?? ""}
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

                        {/* Pipeline */}
                        <div>
                            <label
                                htmlFor="deal-pipeline"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Pipeline
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <select
                                id="deal-pipeline"
                                value={
                                    form.pipelineId ?? ""
                                }
                                onChange={(event) =>
                                    handlePipelineChange(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                {pipelines.map(
                                    (pipeline) => (
                                        <option
                                            key={
                                                pipeline.id
                                            }
                                            value={
                                                pipeline.id
                                            }
                                        >
                                            {
                                                pipeline.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            {errors.pipelineId && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.pipelineId}
                                </p>
                            )}
                        </div>

                        {/* Stage */}
                        <div>
                            <label
                                htmlFor="deal-stage"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Stage
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <select
                                id="deal-stage"
                                value={
                                    form.stageId ?? ""
                                }
                                onChange={(event) =>
                                    updateField(
                                        "stageId",
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                {activePipeline?.stages.map(
                                    (stage) => (
                                        <option
                                            key={
                                                stage.id
                                            }
                                            value={
                                                stage.id
                                            }
                                        >
                                            {
                                                stage.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            {errors.stageId && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.stageId}
                                </p>
                            )}
                        </div>

                        {/* Value */}
                        <div>
                            <label
                                htmlFor="deal-value"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Deal Value
                            </label>

                            <input
                                id="deal-value"
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
                            htmlFor="deal-description"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Description
                        </label>

                        <textarea
                            id="deal-description"
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
                            placeholder="Add notes or additional information about this deal..."
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
                            this deal with a
                            contact, company, or
                            originating lead.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Lead */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="deal-lead"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <Target className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Originating Lead
                            </label>

                            <select
                                id="deal-lead"
                                value={
                                    form.leadId ??
                                    ""
                                }
                                onChange={(event) =>
                                    updateField(
                                        "leadId",
                                        event.target
                                            .value
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                <option value="">
                                    No lead
                                </option>

                                {leads.map(
                                    (lead) => (
                                        <option
                                            key={
                                                lead.id
                                            }
                                            value={
                                                lead.id
                                            }
                                        >
                                            {
                                                lead.title
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Contact */}
                        <div>
                            <label
                                htmlFor="deal-contact"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <User className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Contact
                            </label>

                            <select
                                id="deal-contact"
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
                                htmlFor="deal-company"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <Building2 className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Company
                            </label>

                            <select
                                id="deal-company"
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
                            : "Create Deal"}
                    </WorkspaceButton>
                </div>
            </form>
        </WorkspaceCard>
    );
}