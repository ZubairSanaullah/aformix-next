"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
    WorkspaceFormField,
    WorkspaceInput,
    WorkspaceSelect,
    WorkspaceTextarea,
} from "@/components/workspace/ui";

interface CompanyOption {
    id: string;
    name: string;
}

interface AddContactInlineFormProps {
    companies: CompanyOption[];
    onCancel: () => void;
}

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
];

const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "ARCHIVED", label: "Archived" },
];

export default function AddContactInlineForm({
    companies,
    onCancel,
}: AddContactInlineFormProps) {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        website: "",
        linkedinUrl: "",
        description: "",
        companyId: "",
        source: "",
        status: "ACTIVE",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = (field: string, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => {
            if (!current[field]) {
                return current;
            }

            const next = { ...current };
            delete next[field];
            return next;
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await fetch("/api/crm/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    phone: form.phone,
                    jobTitle: form.jobTitle,
                    website: form.website,
                    linkedinUrl: form.linkedinUrl,
                    description: form.description,
                    companyId: form.companyId,
                    source: form.source || undefined,
                    status: form.status,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result?.issues?.fieldErrors) {
                    const fieldErrors: Record<string, string> = {};

                    Object.entries(result.issues.fieldErrors).forEach(
                        ([field, messages]) => {
                            if (Array.isArray(messages) && messages.length > 0) {
                                fieldErrors[field] = String(messages[0]);
                            }
                        }
                    );

                    setErrors(fieldErrors);
                }

                throw new Error(
                    result?.error || "Failed to create contact"
                );
            }

            toast.success("Contact created successfully");

            onCancel();

            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create contact"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title="Add Contact"
                description="Create a new contact in your CRM."
                action={
                    <WorkspaceButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </WorkspaceButton>
                }
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <WorkspaceFormField
                        label="First Name"
                        required
                        error={errors.firstName}
                    >
                        <WorkspaceInput
                            value={form.firstName}
                            onChange={(event) =>
                                updateField(
                                    "firstName",
                                    event.target.value
                                )
                            }
                            placeholder="John"
                            disabled={isSubmitting}
                        />
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="Last Name"
                        error={errors.lastName}
                    >
                        <WorkspaceInput
                            value={form.lastName}
                            onChange={(event) =>
                                updateField(
                                    "lastName",
                                    event.target.value
                                )
                            }
                            placeholder="Doe"
                            disabled={isSubmitting}
                        />
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
                            placeholder="john@example.com"
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
                        label="Job Title"
                        error={errors.jobTitle}
                    >
                        <WorkspaceInput
                            value={form.jobTitle}
                            onChange={(event) =>
                                updateField(
                                    "jobTitle",
                                    event.target.value
                                )
                            }
                            placeholder="Marketing Manager"
                            disabled={isSubmitting}
                        />
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="Company"
                        error={errors.companyId}
                    >
                        <WorkspaceSelect
                            value={form.companyId}
                            onChange={(event) =>
                                updateField(
                                    "companyId",
                                    event.target.value
                                )
                            }
                            disabled={isSubmitting}
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
                        </WorkspaceSelect>
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="Source"
                        error={errors.source}
                    >
                        <WorkspaceSelect
                            value={form.source}
                            onChange={(event) =>
                                updateField(
                                    "source",
                                    event.target.value
                                )
                            }
                            disabled={isSubmitting}
                        >
                            <option value="">Select source</option>

                            {sourceOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </WorkspaceSelect>
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
                            {statusOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </WorkspaceSelect>
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
                        label="LinkedIn"
                        error={errors.linkedinUrl}
                    >
                        <WorkspaceInput
                            type="url"
                            value={form.linkedinUrl}
                            onChange={(event) =>
                                updateField(
                                    "linkedinUrl",
                                    event.target.value
                                )
                            }
                            placeholder="https://linkedin.com/in/johndoe"
                            disabled={isSubmitting}
                        />
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
                        placeholder="Add notes or additional information about this contact..."
                        rows={5}
                        disabled={isSubmitting}
                    />
                </WorkspaceFormField>

                <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
                    <WorkspaceButton
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </WorkspaceButton>

                    <WorkspaceButton
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Contact
                            </>
                        )}
                    </WorkspaceButton>
                </div>
            </form>
        </WorkspaceCard>
    );
}