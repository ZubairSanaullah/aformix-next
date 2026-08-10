"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    ArrowLeft,
    Loader2,
    Save,
} from "lucide-react";

import {
    WorkspaceButton,
    WorkspaceFormField,
    WorkspaceInput,
    WorkspaceSelect,
    WorkspaceTextarea,
} from "@/components/workspace/ui";

interface EditCompanyFormProps {
    company: {
        id: string;
        name: string;
        website?: string | null;
        industry?: string | null;
        size?: string | null;
        phone?: string | null;
        email?: string | null;
        location?: string | null;
        description?: string | null;
        status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    };
}

const statusOptions = [
    {
        value: "ACTIVE",
        label: "Active",
    },
    {
        value: "INACTIVE",
        label: "Inactive",
    },
    {
        value: "ARCHIVED",
        label: "Archived",
    },
];

const sizeOptions = [
    {
        value: "1-10",
        label: "1–10 employees",
    },
    {
        value: "11-50",
        label: "11–50 employees",
    },
    {
        value: "51-200",
        label: "51–200 employees",
    },
    {
        value: "201-500",
        label: "201–500 employees",
    },
    {
        value: "501-1000",
        label: "501–1,000 employees",
    },
    {
        value: "1001-5000",
        label: "1,001–5,000 employees",
    },
    {
        value: "5001+",
        label: "5,001+ employees",
    },
];

export default function EditCompanyForm({
    company,
}: EditCompanyFormProps) {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [form, setForm] = useState({
        name: company.name ?? "",
        website: company.website ?? "",
        industry: company.industry ?? "",
        size: company.size ?? "",
        phone: company.phone ?? "",
        email: company.email ?? "",
        location: company.location ?? "",
        description: company.description ?? "",
        status: company.status,
    });

    const [errors, setErrors] = useState<
        Record<string, string>
    >({});

    const updateField = (
        field: string,
        value: string
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
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await fetch(
                `/api/crm/companies/${company.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                if (
                    result?.issues?.fieldErrors
                ) {
                    const fieldErrors: Record<
                        string,
                        string
                    > = {};

                    Object.entries(
                        result.issues.fieldErrors
                    ).forEach(
                        ([field, messages]) => {
                            if (
                                Array.isArray(
                                    messages
                                ) &&
                                messages.length > 0
                            ) {
                                fieldErrors[field] =
                                    String(
                                        messages[0]
                                    );
                            }
                        }
                    );

                    setErrors(fieldErrors);
                }

                throw new Error(
                    result?.error ??
                    "Failed to update company"
                );
            }

            toast.success(
                "Company updated successfully"
            );

            router.push(
                `/workspace/crm/companies/${company.id}`
            );

            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update company"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
        >
            <div className="grid gap-5 md:grid-cols-2">
                <WorkspaceFormField
                    label="Company Name"
                    required
                    error={errors.name}
                >
                    <WorkspaceInput
                        value={form.name}
                        onChange={(event) =>
                            updateField(
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="Aformix"
                        disabled={isSubmitting}
                    />
                </WorkspaceFormField>

                <WorkspaceFormField
                    label="Industry"
                    error={errors.industry}
                >
                    <WorkspaceInput
                        value={form.industry}
                        onChange={(event) =>
                            updateField(
                                "industry",
                                event.target.value
                            )
                        }
                        placeholder="Technology"
                        disabled={isSubmitting}
                    />
                </WorkspaceFormField>

                <WorkspaceFormField
                    label="Website"
                    error={errors.website}
                >
                    <WorkspaceInput
                        type="url"
                        value={form.website}
                        onChange={(event) =>
                            updateField(
                                "website",
                                event.target.value
                            )
                        }
                        placeholder="https://example.com"
                        disabled={isSubmitting}
                    />
                </WorkspaceFormField>

                <WorkspaceFormField
                    label="Company Size"
                    error={errors.size}
                >
                    <WorkspaceSelect
                        value={form.size}
                        onChange={(event) =>
                            updateField(
                                "size",
                                event.target.value
                            )
                        }
                        disabled={isSubmitting}
                    >
                        <option value="">
                            Select company size
                        </option>

                        {sizeOptions.map(
                            (option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            )
                        )}
                    </WorkspaceSelect>
                </WorkspaceFormField>

                <WorkspaceFormField
                    label="Email"
                    error={errors.email}
                >
                    <WorkspaceInput
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                            updateField(
                                "email",
                                event.target.value
                            )
                        }
                        placeholder="hello@example.com"
                        disabled={isSubmitting}
                    />
                </WorkspaceFormField>

                <WorkspaceFormField
                    label="Phone"
                    error={errors.phone}
                >
                    <WorkspaceInput
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                            updateField(
                                "phone",
                                event.target.value
                            )
                        }
                        placeholder="+92 300 1234567"
                        disabled={isSubmitting}
                    />
                </WorkspaceFormField>

                <WorkspaceFormField
                    label="Location"
                    error={errors.location}
                >
                    <WorkspaceInput
                        value={form.location}
                        onChange={(event) =>
                            updateField(
                                "location",
                                event.target.value
                            )
                        }
                        placeholder="Lahore, Pakistan"
                        disabled={isSubmitting}
                    />
                </WorkspaceFormField>

                <WorkspaceFormField
                    label="Status"
                    error={errors.status}
                >
                    <WorkspaceSelect
                        value={form.status}
                        onChange={(event) =>
                            updateField(
                                "status",
                                event.target.value
                            )
                        }
                        disabled={isSubmitting}
                    >
                        {statusOptions.map(
                            (option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            )
                        )}
                    </WorkspaceSelect>
                </WorkspaceFormField>
            </div>

            <WorkspaceFormField
                label="Description"
                error={errors.description}
            >
                <WorkspaceTextarea
                    value={form.description}
                    onChange={(event) =>
                        updateField(
                            "description",
                            event.target.value
                        )
                    }
                    placeholder="Add notes or additional information about this company..."
                    rows={6}
                    disabled={isSubmitting}
                />
            </WorkspaceFormField>

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--workspace-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <WorkspaceButton
                    type="button"
                    variant="ghost"
                    disabled={isSubmitting}
                    onClick={() =>
                        router.push(
                            `/workspace/crm/companies/${company.id}`
                        )
                    }
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                </WorkspaceButton>

                <WorkspaceButton
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </WorkspaceButton>
            </div>
        </form>
    );
}