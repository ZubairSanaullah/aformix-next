"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";
import { Target } from "lucide-react";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

interface DealEditFormProps {
    deal: {
        id: string;
        title: string;
        description: string | null;
        value: unknown;
        pipelineId: string;
        stageId: string;
        contactId: string | null;
        companyId: string | null;
        leadId: string | null;
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

    pipelines: {
        id: string;
        name: string;
        stages: {
            id: string;
            name: string;
        }[];
    }[];
}

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

export default function DealEditForm({
    deal,
    companies,
    contacts,
    leads,
    pipelines,
}: DealEditFormProps) {
    const router = useRouter();

    const [title, setTitle] =
        useState(deal.title);

    const [description, setDescription] =
        useState(deal.description ?? "");

    const [pipelineId, setPipelineId] =
        useState(deal.pipelineId);

    const [stageId, setStageId] =
        useState(deal.stageId);

    const [value, setValue] =
        useState(
            getInitialValue(deal.value)
        );

    const [contactId, setContactId] =
        useState(deal.contactId ?? "");

    const [companyId, setCompanyId] =
        useState(deal.companyId ?? "");

    const [leadId, setLeadId] =
        useState(deal.leadId ?? "");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const activePipeline = pipelines.find(
        (pipeline) => pipeline.id === pipelineId
    );

    function handlePipelineChange(
        nextPipelineId: string
    ) {
        const pipeline = pipelines.find(
            (item) => item.id === nextPipelineId
        );

        setPipelineId(nextPipelineId);

        // Reset stage since stages belong to a pipeline
        setStageId(
            pipeline?.stages[0]?.id ?? ""
        );
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

        if (!title.trim()) {
            setError(
                "Deal title is required."
            );

            return;
        }

        if (!pipelineId || !stageId) {
            setError(
                "Pipeline and stage are required."
            );

            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                `/api/crm/deals/${deal.id}`,
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

                        pipelineId,

                        stageId,

                        value:
                            value.trim()
                                ? Number(value)
                                : undefined,

                        contactId:
                            contactId || undefined,

                        companyId:
                            companyId || undefined,

                        leadId:
                            leadId || undefined,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Failed to update deal."
                );
            }

            router.push(
                `/workspace/crm/deals/${deal.id}`
            );

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update deal."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCancel() {
        router.push(
            `/workspace/crm/deals/${deal.id}`
        );
    }

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title="Deal Information"
                description="Update the information associated with this deal."
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
                            htmlFor="deal-title"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Deal Title
                        </label>

                        <input
                            id="deal-title"
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

                    {/* Pipeline */}
                    <div>
                        <label
                            htmlFor="deal-pipeline"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Pipeline
                        </label>

                        <select
                            id="deal-pipeline"
                            value={pipelineId}
                            onChange={(event) =>
                                handlePipelineChange(
                                    event.target.value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
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
                    </div>

                    {/* Stage */}
                    <div>
                        <label
                            htmlFor="deal-stage"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Stage
                        </label>

                        <select
                            id="deal-stage"
                            value={stageId}
                            onChange={(event) =>
                                setStageId(
                                    event.target.value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
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
                            value={leadId}
                            onChange={(event) =>
                                setLeadId(
                                    event.target.value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] disabled:opacity-60"
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
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Contact
                        </label>

                        <select
                            id="deal-contact"
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
                            htmlFor="deal-company"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Company
                        </label>

                        <select
                            id="deal-company"
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
                            htmlFor="deal-description"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Description
                        </label>

                        <textarea
                            id="deal-description"
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