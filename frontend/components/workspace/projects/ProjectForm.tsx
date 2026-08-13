"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, User, X } from "lucide-react";
import type { ProjectPriority, ProjectStatus } from "@prisma/client";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

import {
    createProjectSchema,
    updateProjectSchema,
} from "@/lib/validations/projects";

import {
    PROJECT_PRIORITY_OPTIONS,
    PROJECT_STATUS_OPTIONS,
} from "@/lib/utils/project-format";

interface ProjectFormOwner {
    id: string;
    name: string | null;
    email: string;
}

interface ProjectFormCompany {
    id: string;
    name: string;
}

interface ProjectFormValues {
    id?: string;
    name: string;
    slug: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    progress: number;
    startDate: string;
    dueDate: string;
    completedAt: string;
    ownerId: string;
    companyId: string;
}

interface ProjectFormProps {
    mode: "create" | "edit";
    owners: ProjectFormOwner[];
    companies: ProjectFormCompany[];
    initialValues?: Partial<ProjectFormValues>;
    onCancel: () => void;
}

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** Format a Date (or ISO string) into yyyy-MM-dd for <input type="date">. */
function toDateInputValue(value: string | Date | null | undefined) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

const emptyValues: ProjectFormValues = {
    name: "",
    slug: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    progress: 0,
    startDate: "",
    dueDate: "",
    completedAt: "",
    ownerId: "",
    companyId: "",
};

export default function ProjectForm({
    mode,
    owners,
    companies,
    initialValues,
    onCancel,
}: ProjectFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<ProjectFormValues>({
        ...emptyValues,
        ...initialValues,
        startDate: toDateInputValue(initialValues?.startDate),
        dueDate: toDateInputValue(initialValues?.dueDate),
        completedAt: toDateInputValue(initialValues?.completedAt),
    });

    // Tracks whether the user has hand-edited the slug; while false, the
    // slug auto-follows the name (create mode only).
    const [slugTouched, setSlugTouched] = useState(mode === "edit");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    function updateField<K extends keyof ProjectFormValues>(
        field: K,
        value: ProjectFormValues[K]
    ) {
        setForm((current) => ({ ...current, [field]: value }));

        setErrors((current) => {
            if (!current[field]) return current;
            const next = { ...current };
            delete next[field];
            return next;
        });

        setSubmitError("");
    }

    function handleNameChange(value: string) {
        updateField("name", value);

        if (!slugTouched) {
            updateField("slug", slugify(value));
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitError("");
        setErrors({});

        const payload = {
            name: form.name,
            slug: form.slug,
            description: form.description.trim() || null,
            status: form.status,
            priority: form.priority,
            progress: Number(form.progress) || 0,
            startDate: form.startDate ? form.startDate : null,
            dueDate: form.dueDate ? form.dueDate : null,
            completedAt: form.completedAt ? form.completedAt : null,
            ownerId: form.ownerId,
            companyId: form.companyId || null,
        };

        const schema =
            mode === "create" ? createProjectSchema : updateProjectSchema;

        const result = schema.safeParse(payload);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            const flattened = result.error.flatten();

            Object.entries(flattened.fieldErrors).forEach(
                ([field, messages]) => {
                    if (messages && messages.length > 0) {
                        fieldErrors[field] = messages[0] ?? "";
                    }
                }
            );

            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const endpoint =
                mode === "create"
                    ? "/api/projects"
                    : `/api/projects/${form.id}`;

            const response = await fetch(endpoint, {
                method: mode === "create" ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ??
                        `Failed to ${mode === "create" ? "create" : "update"} project`
                );
            }

            toast.success(
                mode === "create"
                    ? "Project created successfully."
                    : "Project updated successfully."
            );

            router.refresh();

            if (mode === "create") {
                onCancel();
            } else {
                router.push(`/workspace/projects/${data.project.id}`);
            }
        } catch (error) {
            console.error(`${mode} project error:`, error);

            setSubmitError(
                error instanceof Error
                    ? error.message
                    : `Failed to ${mode === "create" ? "create" : "update"} project`
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title={
                    mode === "create" ? "Create Project" : "Edit Project"
                }
                description={
                    mode === "create"
                        ? "Add a new project to the Workspace."
                        : "Update this project's information."
                }
                action={
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Close project form"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                }
            />

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {/* Project Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Project Information
                        </h3>
                        <p className="mt-1 text-xs text-[var(--workspace-text-subtle)]">
                            Basic details about this project.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="project-name"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Project Name
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <input
                                id="project-name"
                                type="text"
                                value={form.name}
                                onChange={(event) =>
                                    handleNameChange(event.target.value)
                                }
                                placeholder="e.g. Website Redesign"
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                            />

                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Slug */}
                        <div>
                            <label
                                htmlFor="project-slug"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Slug
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <input
                                id="project-slug"
                                type="text"
                                value={form.slug}
                                onChange={(event) => {
                                    setSlugTouched(true);
                                    updateField(
                                        "slug",
                                        slugify(event.target.value)
                                    );
                                }}
                                placeholder="website-redesign"
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                            />

                            {errors.slug && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.slug}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="project-status"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Status
                            </label>

                            <select
                                id="project-status"
                                value={form.status}
                                onChange={(event) =>
                                    updateField(
                                        "status",
                                        event.target.value as ProjectStatus
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                {PROJECT_STATUS_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {errors.status && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Priority */}
                        <div>
                            <label
                                htmlFor="project-priority"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Priority
                            </label>

                            <select
                                id="project-priority"
                                value={form.priority}
                                onChange={(event) =>
                                    updateField(
                                        "priority",
                                        event.target.value as ProjectPriority
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                {PROJECT_PRIORITY_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Progress */}
                        <div>
                            <label
                                htmlFor="project-progress"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Progress (%)
                            </label>

                            <input
                                id="project-progress"
                                type="number"
                                min={0}
                                max={100}
                                value={form.progress}
                                onChange={(event) =>
                                    updateField(
                                        "progress",
                                        Number(event.target.value)
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none transition-colors focus:border-[var(--workspace-primary)]"
                            />

                            {errors.progress && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.progress}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="project-description"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Description
                        </label>

                        <textarea
                            id="project-description"
                            rows={4}
                            value={form.description}
                            onChange={(event) =>
                                updateField("description", event.target.value)
                            }
                            placeholder="What is this project about..."
                            className="w-full resize-none rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm leading-6 text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                        />

                        {errors.description && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4 border-t border-[var(--workspace-border)] pt-6">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Timeline
                        </h3>
                        <p className="mt-1 text-xs text-[var(--workspace-text-subtle)]">
                            Start, due, and completion dates.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <div>
                            <label
                                htmlFor="project-start-date"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Start Date
                            </label>

                            <input
                                id="project-start-date"
                                type="date"
                                value={form.startDate}
                                onChange={(event) =>
                                    updateField("startDate", event.target.value)
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            />

                            {errors.startDate && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.startDate}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="project-due-date"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Due Date
                            </label>

                            <input
                                id="project-due-date"
                                type="date"
                                value={form.dueDate}
                                onChange={(event) =>
                                    updateField("dueDate", event.target.value)
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            />

                            {errors.dueDate && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.dueDate}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="project-completed-date"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Completed Date
                            </label>

                            <input
                                id="project-completed-date"
                                type="date"
                                value={form.completedAt}
                                onChange={(event) =>
                                    updateField(
                                        "completedAt",
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            />

                            {errors.completedAt && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.completedAt}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Relationships */}
                <div className="space-y-4 border-t border-[var(--workspace-border)] pt-6">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Relationships
                        </h3>
                        <p className="mt-1 text-xs text-[var(--workspace-text-subtle)]">
                            Assign an owner and, optionally, a company.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="project-owner"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <User className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Owner
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <select
                                id="project-owner"
                                value={form.ownerId}
                                onChange={(event) =>
                                    updateField("ownerId", event.target.value)
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                <option value="">Select an owner</option>
                                {owners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.name ?? owner.email}
                                    </option>
                                ))}
                            </select>

                            {errors.ownerId && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.ownerId}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="project-company"
                                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--workspace-text)]"
                            >
                                <Building2 className="h-3.5 w-3.5 text-[var(--workspace-text-muted)]" />
                                Company
                            </label>

                            <select
                                id="project-company"
                                value={form.companyId}
                                onChange={(event) =>
                                    updateField(
                                        "companyId",
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-sm text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            >
                                <option value="">No company</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {submitError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                        {submitError}
                    </div>
                )}

                <div className="flex flex-col-reverse gap-2 border-t border-[var(--workspace-border)] pt-5 sm:flex-row sm:justify-end">
                    <WorkspaceButton
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </WorkspaceButton>

                    <WorkspaceButton type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? mode === "create"
                                ? "Creating..."
                                : "Saving..."
                            : mode === "create"
                              ? "Create Project"
                              : "Save Changes"}
                    </WorkspaceButton>
                </div>
            </form>
        </WorkspaceCard>
    );
}
