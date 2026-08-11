"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    WorkspaceButton,
    WorkspaceInput,
    WorkspaceSelect,
    WorkspaceTextarea,
} from "@/components/workspace/ui";

type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

interface ContactOption {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface CompanyOption {
    id: string;
    name: string;
}

interface LeadOption {
    id: string;
    title: string;
}

interface DealOption {
    id: string;
    title: string;
}

interface TaskFormProps {
    task?: {
        id: string;
        title: string;
        description: string | null;
        status: TaskStatus;
        priority: TaskPriority;
        dueAt: Date | string | null;
        contactId: string | null;
        companyId: string | null;
        leadId: string | null;
        dealId: string | null;
    };

    contacts?: ContactOption[];
    companies?: CompanyOption[];
    leads?: LeadOption[];
    deals?: DealOption[];
}

export default function TaskForm({
    task,
    contacts = [],
    companies = [],
    leads = [],
    deals = [],
}: TaskFormProps) {
    const router = useRouter();

    const isEditing = Boolean(task);

    /*
     * ---------------------------------------------------------
     * Form State
     * ---------------------------------------------------------
     */

    const [title, setTitle] = useState(
        task?.title ?? ""
    );

    const [description, setDescription] =
        useState(task?.description ?? "");

    const [status, setStatus] =
        useState<TaskStatus>(
            task?.status ?? "TODO"
        );

    const [priority, setPriority] =
        useState<TaskPriority>(
            task?.priority ?? "MEDIUM"
        );

    const [dueAt, setDueAt] = useState(() => {
        if (!task?.dueAt) {
            return "";
        }

        const date = new Date(task.dueAt);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    });

    const [contactId, setContactId] =
        useState(task?.contactId ?? "");

    const [companyId, setCompanyId] =
        useState(task?.companyId ?? "");

    const [leadId, setLeadId] =
        useState(task?.leadId ?? "");

    const [dealId, setDealId] =
        useState(task?.dealId ?? "");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    /*
     * ---------------------------------------------------------
     * Submit
     * ---------------------------------------------------------
     */

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setError(null);

        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setError(
                "Task title is required."
            );

            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                title: trimmedTitle,

                description:
                    description.trim() || null,

                /*
                 * Task status
                 */
                status,

                /*
                 * Task priority
                 */
                priority,

                /*
                 * Due date
                 */
                dueAt: dueAt
                    ? new Date(
                        `${dueAt}T23:59:59`
                    ).toISOString()
                    : null,

                /*
                 * CRM relationships
                 */
                contactId:
                    contactId || null,

                companyId:
                    companyId || null,

                leadId:
                    leadId || null,

                dealId:
                    dealId || null,
            };

            const response = await fetch(
                isEditing
                    ? `/api/tasks/${task!.id}`
                    : "/api/tasks",
                {
                    method: isEditing
                        ? "PATCH"
                        : "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        payload
                    ),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Unable to save task."
                );
            }

            toast.success(
                isEditing
                    ? "Task updated successfully."
                    : "Task created successfully."
            );

            if (isEditing) {
                router.push(
                    `/workspace/tasks/${task!.id}`
                );
            } else {
                router.push(
                    "/workspace/tasks"
                );
            }

            router.refresh();
        } catch (error) {
            console.error(
                "Task form submission failed:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while saving the task."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    /*
     * ---------------------------------------------------------
     * Render
     * ---------------------------------------------------------
     */

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Error */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-800">
                        Unable to save task
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-5">
                <div className="mb-5">
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Basic Information
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Add the main details for this task.
                    </p>
                </div>

                <div className="space-y-5">
                    {/* Title */}

                    <div>
                        <label
                            htmlFor="task-title"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Task title
                        </label>

                        <WorkspaceInput
                            id="task-title"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="Enter task title..."
                            disabled={
                                isSubmitting
                            }
                            required
                        />
                    </div>

                    {/* Description */}

                    <div>
                        <label
                            htmlFor="task-description"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Description
                        </label>

                        <WorkspaceTextarea
                            id="task-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Describe the task..."
                            disabled={
                                isSubmitting
                            }
                            rows={5}
                        />
                    </div>
                </div>
            </section>

            {/* =================================================
                STATUS & PRIORITY
            ================================================= */}

            <section className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-5">
                <div className="mb-5">
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Task Settings
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Set the current status, priority, and due date.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {/* Status */}

                    <div>
                        <label
                            htmlFor="task-status"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Status
                        </label>

                        <WorkspaceSelect
                            id="task-status"
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target
                                        .value as TaskStatus
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                        >
                            <option value="TODO">
                                To Do
                            </option>

                            <option value="IN_PROGRESS">
                                In Progress
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>
                        </WorkspaceSelect>
                    </div>

                    {/* Priority */}

                    <div>
                        <label
                            htmlFor="task-priority"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Priority
                        </label>

                        <WorkspaceSelect
                            id="task-priority"
                            value={priority}
                            onChange={(event) =>
                                setPriority(
                                    event.target
                                        .value as TaskPriority
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                        >
                            <option value="LOW">
                                Low
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="HIGH">
                                High
                            </option>

                            <option value="URGENT">
                                Urgent
                            </option>
                        </WorkspaceSelect>
                    </div>

                    {/* Due Date */}

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="task-due-date"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Due date
                        </label>

                        <WorkspaceInput
                            id="task-due-date"
                            type="date"
                            value={dueAt}
                            onChange={(event) =>
                                setDueAt(
                                    event.target.value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                        />
                    </div>
                </div>
            </section>

            {/* =================================================
                CRM RELATIONSHIPS
            ================================================= */}

            <section className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-5">
                <div className="mb-5">
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        CRM Relationships
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Optionally connect this task to contacts, companies, leads, or deals.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {/* Contact */}

                    <div>
                        <label
                            htmlFor="task-contact"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Contact
                        </label>

                        <WorkspaceSelect
                            id="task-contact"
                            value={contactId}
                            onChange={(event) =>
                                setContactId(
                                    event.target
                                        .value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
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
                                            .join(
                                                " "
                                            );

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
                        </WorkspaceSelect>
                    </div>

                    {/* Company */}

                    <div>
                        <label
                            htmlFor="task-company"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Company
                        </label>

                        <WorkspaceSelect
                            id="task-company"
                            value={companyId}
                            onChange={(event) =>
                                setCompanyId(
                                    event.target
                                        .value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
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
                        </WorkspaceSelect>
                    </div>

                    {/* Lead */}

                    <div>
                        <label
                            htmlFor="task-lead"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Lead
                        </label>

                        <WorkspaceSelect
                            id="task-lead"
                            value={leadId}
                            onChange={(event) =>
                                setLeadId(
                                    event.target
                                        .value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                        >
                            <option value="">
                                No lead
                            </option>

                            {leads.map((lead) => (
                                <option
                                    key={lead.id}
                                    value={lead.id}
                                >
                                    {lead.title}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </div>

                    {/* Deal */}

                    <div>
                        <label
                            htmlFor="task-deal"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Deal
                        </label>

                        <WorkspaceSelect
                            id="task-deal"
                            value={dealId}
                            onChange={(event) =>
                                setDealId(
                                    event.target
                                        .value
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                        >
                            <option value="">
                                No deal
                            </option>

                            {deals.map((deal) => (
                                <option
                                    key={deal.id}
                                    value={deal.id}
                                >
                                    {deal.title}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </div>
                </div>

                {/* Empty CRM data notice */}

                {contacts.length === 0 &&
                    companies.length === 0 &&
                    leads.length === 0 &&
                    deals.length === 0 && (
                        <div className="mt-5 rounded-lg border border-dashed border-[var(--workspace-border)] bg-[var(--workspace-background)] px-4 py-3">
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                No CRM records are currently available to connect with this task.
                            </p>
                        </div>
                    )}
            </section>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex items-center justify-end gap-3 border-t border-[var(--workspace-border)] pt-5">
                <WorkspaceButton
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={() =>
                        router.back()
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
                        : isEditing
                            ? "Update Task"
                            : "Create Task"}
                </WorkspaceButton>
            </div>
        </form>
    );
}