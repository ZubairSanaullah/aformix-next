"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { FinanceCategory, FinanceCategoryType } from "@prisma/client";

interface FinanceCategoryFormProps {
    category?: FinanceCategory;
    mode?: "create" | "edit";
}

const PRESET_COLORS = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
];

export default function FinanceCategoryForm({
    category,
    mode = "create",
}: FinanceCategoryFormProps) {
    const router = useRouter();
    const isEdit = mode === "edit" && category;

    const [loading, setLoading] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [formData, setFormData] = useState({
        name: category?.name || "",
        slug: category?.slug || "",
        description: category?.description || "",
        type: category?.type || "ALL",
        color: category?.color || "#3b82f6",
        sortOrder: category?.sortOrder?.toString() || "0",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.length > 150) {
            newErrors.name = "Name must be 150 characters or fewer";
        }

        if (!formData.slug?.trim()) {
            newErrors.slug = "Slug is required";
        } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
            newErrors.slug =
                "Slug must be lowercase with hyphens only (a-z, 0-9, -)";
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = "Description must be 1000 characters or fewer";
        }

        const sortOrder = parseInt(formData.sortOrder);
        if (isNaN(sortOrder) || sortOrder < 0) {
            newErrors.sortOrder = "Sort order must be a non-negative number";
        }

        if (!formData.color) {
            newErrors.color = "Color is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSlugAutofill = (name: string) => {
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        setFormData((prev) => ({
            ...prev,
            slug: slug || prev.slug,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || undefined,
                type: formData.type,
                color: formData.color,
                sortOrder: parseInt(formData.sortOrder),
            };

            let response;
            if (isEdit) {
                response = await fetch(
                    `/api/finance/categories/${category.id}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );
            } else {
                response = await fetch("/api/finance/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Failed to save category"
                );
            }

            const result = await response.json();
            toast.success(
                isEdit
                    ? "Category updated successfully"
                    : "Category created successfully"
            );

            if (isEdit) {
                router.refresh();
            } else {
                router.push(
                    `/workspace/finance/categories/${result.id}`
                );
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Slug */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (!isEdit) {
                                handleSlugAutofill(e.target.value);
                            }
                        }}
                        placeholder="e.g., Office Supplies"
                        maxLength={150}
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                slug: e.target.value
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")
                                    .replace(/[^a-z0-9-]/g, ""),
                            })
                        }
                        placeholder="e.g., office-supplies"
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              font-mono
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                    {errors.slug && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.slug}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Auto-generated from name
                    </p>
                </div>
            </div>

            {/* Type */}
            <div>
                <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                    Type <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.type}
                    onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as FinanceCategoryType })
                    }
                    className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="ALL">Both (Income & Expense)</option>
                </select>
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                    placeholder="Category details and notes..."
                    maxLength={1000}
                    rows={3}
                    className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              resize-none
            "
                />
                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    {formData.description.length}/1000
                </p>
            </div>

            {/* Color & Sort Order */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Color <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="h-10 w-10 rounded-lg border-2 border-[var(--workspace-border)] cursor-pointer transition-transform hover:scale-110"
                                style={{
                                    backgroundColor: formData.color,
                                }}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                                title="Click to change color"
                            />
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        color: e.target.value,
                                    })
                                }
                                placeholder="#3b82f6"
                                className="
                  flex-1
                  rounded-lg
                  border
                  border-[var(--workspace-border)]
                  bg-[var(--workspace-background)]
                  px-3
                  py-2
                  text-sm
                  font-mono
                  text-[var(--workspace-text)]
                  placeholder:text-[var(--workspace-text-muted)]
                  transition-colors
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--workspace-primary)]
                "
                            />
                        </div>

                        {showColorPicker && (
                            <div className="grid grid-cols-4 gap-2 p-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-card-background)]">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="h-8 rounded-lg border-2 transition-transform hover:scale-110"
                                        style={{
                                            backgroundColor: color,
                                            borderColor:
                                                formData.color === color
                                                    ? "white"
                                                    : "transparent",
                                        }}
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                color,
                                            });
                                            setShowColorPicker(false);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.color && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.color}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Sort Order
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.sortOrder}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                sortOrder: e.target.value,
                            })
                        }
                        placeholder="0"
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                    {errors.sortOrder && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.sortOrder}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Lower numbers appear first
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 sm:justify-end">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-4
              py-2
              text-sm
              font-medium
              text-[var(--workspace-text)]
              transition-colors
              hover:bg-[var(--workspace-card-background)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[var(--workspace-primary)]
              px-4
              py-2
              text-sm
              font-medium
              text-white
              shadow-sm
              transition-all
              duration-150
              hover:opacity-90
              disabled:opacity-50
              disabled:cursor-not-allowed
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--workspace-background)]
            "
                >
                    {loading ? "Saving..." : isEdit ? "Update" : "Create"}
                </button>
            </div>
        </form>
    );
}
