"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceFormField from "@/components/workspace/ui/WorkspaceFormField";
import WorkspaceInput from "@/components/workspace/ui/WorkspaceInput";
import WorkspaceTextarea from "@/components/workspace/ui/WorkspaceTextarea";
import WorkspaceSelect from "@/components/workspace/ui/WorkspaceSelect";

import DateTimeField from "./DateTimeField";

import {
    EMPTY_EVENT_VALUES,
    eventSchema,
    type EventInput,
} from "@/lib/validations/event";
import {
    EVENT_STATUS_LABELS,
    EVENT_TYPE_LABELS,
    EVENT_STATUSES,
    EVENT_TYPES,
} from "@/lib/types/scheduler";
import { Save } from "lucide-react";

interface RelationshipOption {
    id: string;
    name: string;
}

interface EventFormProps {
    mode: "create" | "edit";
    eventId?: string;
    defaultValues?: Partial<EventInput>;
    onSubmit: SubmitHandler<EventInput>;

    // CRM/task relationship options — fetched server-side by the
    // page, same pattern as `categories`/`tags` in PostForm.
    contacts?: RelationshipOption[];
    companies?: RelationshipOption[];
    leads?: RelationshipOption[];
    deals?: RelationshipOption[];
    tasks?: RelationshipOption[];
}

export default function EventForm({
    mode,
    eventId,
    defaultValues,
    onSubmit,
    contacts = [],
    companies = [],
    leads = [],
    deals = [],
    tasks = [],
}: EventFormProps) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<EventInput>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            ...EMPTY_EVENT_VALUES,
            ...defaultValues,
        },
    });

    const allDay = watch("allDay");

    return (
        <form
            id={mode === "create" ? "create-event-form" : "edit-event-form"}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <WorkspaceCard padding="lg" className="space-y-5">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Event Details
                    </h2>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Core information for this event.
                    </p>
                </div>

                <WorkspaceFormField
                    label="Title"
                    required
                    error={errors.title?.message}
                >
                    <WorkspaceInput
                        placeholder="Enter event title..."
                        {...register("title")}
                    />
                </WorkspaceFormField>

                <WorkspaceFormField
                    label="Description"
                    error={errors.description?.message}
                >
                    <WorkspaceTextarea
                        rows={3}
                        placeholder="Add any additional details..."
                        {...register("description")}
                    />
                </WorkspaceFormField>

                <div className="grid gap-5 md:grid-cols-2">
                    <WorkspaceFormField label="Type" required>
                        <WorkspaceSelect {...register("type")}>
                            {EVENT_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {EVENT_TYPE_LABELS[type]}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </WorkspaceFormField>

                    <WorkspaceFormField label="Status" required>
                        <WorkspaceSelect {...register("status")}>
                            {EVENT_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {EVENT_STATUS_LABELS[status]}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </WorkspaceFormField>
                </div>
            </WorkspaceCard>

            <WorkspaceCard padding="lg" className="space-y-5">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Scheduling
                    </h2>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        When this event starts and ends.
                    </p>
                </div>

                <label className="flex items-center gap-2 text-xs font-medium text-[var(--workspace-text)]">
                    <input
                        type="checkbox"
                        {...register("allDay")}
                        className="h-3.5 w-3.5 accent-[var(--workspace-primary)]"
                    />
                    All day
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                    <WorkspaceFormField
                        label="Start"
                        required
                        error={errors.startAt?.message}
                    >
                        <DateTimeField
                            {...register("startAt")}
                        />
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="End"
                        required
                        error={errors.endAt?.message}
                    >
                        <DateTimeField {...register("endAt")} />
                    </WorkspaceFormField>
                </div>

                <WorkspaceFormField label="Location">
                    <WorkspaceInput
                        placeholder="Add a location or meeting link..."
                        {...register("location")}
                    />
                </WorkspaceFormField>

                {allDay && (
                    <p className="text-[11px] text-[var(--workspace-text-subtle)]">
                        All-day events still store a start and end
                        time — the calendar will render them as
                        all-day blocks.
                    </p>
                )}
            </WorkspaceCard>

            <WorkspaceCard padding="lg" className="space-y-5">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        CRM Relationships
                    </h2>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Optionally link this event to a contact,
                        company, lead, deal, or task.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <WorkspaceFormField label="Contact">
                        <WorkspaceSelect {...register("contactId")}>
                            <option value="">None</option>
                            {contacts.map((contact) => (
                                <option key={contact.id} value={contact.id}>
                                    {contact.name}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </WorkspaceFormField>

                    <WorkspaceFormField label="Company">
                        <WorkspaceSelect {...register("companyId")}>
                            <option value="">None</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </WorkspaceFormField>

                    <WorkspaceFormField label="Lead">
                        <WorkspaceSelect {...register("leadId")}>
                            <option value="">None</option>
                            {leads.map((lead) => (
                                <option key={lead.id} value={lead.id}>
                                    {lead.name}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </WorkspaceFormField>

                    <WorkspaceFormField label="Deal">
                        <WorkspaceSelect {...register("dealId")}>
                            <option value="">None</option>
                            {deals.map((deal) => (
                                <option key={deal.id} value={deal.id}>
                                    {deal.name}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </WorkspaceFormField>

                    <WorkspaceFormField label="Task">
                        <WorkspaceSelect {...register("taskId")}>
                            <option value="">None</option>
                            {tasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                    {task.name}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </WorkspaceFormField>
                </div>
            </WorkspaceCard>

            <div className="flex items-center justify-end gap-3 border-t border-[var(--workspace-border)] pt-5">
                <WorkspaceButton type="submit" size="sm" disabled={isSubmitting}>
                    <Save className="h-3.5 w-3.5" />
                    {isSubmitting
                        ? "Saving..."
                        : mode === "create"
                            ? "Create Event"
                            : "Update Event"}
                </WorkspaceButton>
            </div>
        </form>
    );
}
