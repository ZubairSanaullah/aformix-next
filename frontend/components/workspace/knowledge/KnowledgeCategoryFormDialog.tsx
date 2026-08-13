"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil, Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    WorkspaceButton,
    WorkspaceInput,
    WorkspaceTextarea,
} from "@/components/workspace/ui";

import { slugify } from "./slugify";
import type { KnowledgeCategoryListItem } from "./types";

interface KnowledgeCategoryFormDialogProps {
    mode: "create" | "edit";
    category?: KnowledgeCategoryListItem;
}

const EMPTY_FORM = {
    name: "",
    slug: "",
    description: "",
    icon: "",
    sortOrder: 0,
};

export default function KnowledgeCategoryFormDialog({
    mode,
    category,
}: KnowledgeCategoryFormDialogProps) {
    const router = useRouter();

    const isEditing = mode === "edit";

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState(() =>
        isEditing && category
            ? {
                  name: category.name,
                  slug: category.slug,
                  description: category.description ?? "",
                  icon: category.icon ?? "",
                  sortOrder: category.sortOrder,
              }
            : EMPTY_FORM
    );

    // Only auto-derive the slug from the name while creating — once a slug
    // has been hand-edited (or we're editing an existing category), leave
    // it alone.
    const [slugTouched, setSlugTouched] = useState(isEditing);

    function resetForm() {
        setForm(
            isEditing && category
                ? {
                      name: category.name,
                      slug: category.slug,
                      description: category.description ?? "",
                      icon: category.icon ?? "",
                      sortOrder: category.sortOrder,
                  }
                : EMPTY_FORM
        );
        setSlugTouched(isEditing);
        setError(null);
    }

    useEffect(() => {
        if (!open) {
            resetForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function handleNameChange(value: string) {
        setForm((prev) => ({
            ...prev,
            name: value,
            slug: slugTouched ? prev.slug : slugify(value),
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting) return;

        setError(null);

        const trimmedName = form.name.trim();
        const trimmedSlug = form.slug.trim();

        if (!trimmedName) {
            setError("Category name is required.");
            return;
        }

        if (!trimmedSlug) {
            setError("Slug is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: trimmedName,
                slug: trimmedSlug,
                description: form.description.trim() || null,
                icon: form.icon.trim() || null,
                sortOrder: form.sortOrder,
            };

            const response = await fetch(
                isEditing
                    ? `/api/knowledge/categories/${category!.id}`
                    : "/api/knowledge/categories",
                {
                    method: isEditing ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        `Unable to ${isEditing ? "update" : "create"} category.`
                );
            }

            toast.success(
                isEditing
                    ? "Category updated successfully."
                    : "Category created successfully."
            );

            setOpen(false);
            router.refresh();
        } catch (submitError) {
            console.error(
                "Knowledge category form submission failed:",
                submitError
            );

            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Something went wrong while saving the category."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <button
                        type="button"
                        aria-label={`Edit ${category?.name}`}
                        title="Edit category"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--workspace-primary)] px-3.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[var(--workspace-primary-hover)]"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        New Category
                    </button>
                )}
            </DialogTrigger>

            <DialogContent className="border-[var(--workspace-border)] bg-[var(--workspace-surface)] sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-[var(--workspace-text)]">
                            {isEditing ? "Edit category" : "New category"}
                        </DialogTitle>

                        <DialogDescription className="text-[var(--workspace-text-muted)]">
                            {isEditing
                                ? "Update this category's details."
                                : "Categories organize your knowledge base articles."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-xs font-medium text-red-800">
                                    Unable to save category
                                </p>
                                <p className="mt-1 text-xs leading-5 text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="category-name"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Name
                            </label>

                            <WorkspaceInput
                                id="category-name"
                                value={form.name}
                                onChange={(event) =>
                                    handleNameChange(event.target.value)
                                }
                                placeholder="e.g. Getting Started"
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="category-slug"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Slug
                            </label>

                            <WorkspaceInput
                                id="category-slug"
                                value={form.slug}
                                onChange={(event) => {
                                    setSlugTouched(true);
                                    setForm((prev) => ({
                                        ...prev,
                                        slug: event.target.value,
                                    }));
                                }}
                                placeholder="getting-started"
                                disabled={isSubmitting}
                                required
                            />

                            <p className="mt-1 text-[10px] text-[var(--workspace-text-subtle)]">
                                Lowercase letters, numbers, and hyphens only.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="category-description"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Description
                            </label>

                            <WorkspaceTextarea
                                id="category-description"
                                value={form.description}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                    }))
                                }
                                placeholder="What kind of articles live here?"
                                disabled={isSubmitting}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="category-icon"
                                    className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                                >
                                    Icon
                                </label>

                                <WorkspaceInput
                                    id="category-icon"
                                    value={form.icon}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            icon: event.target.value,
                                        }))
                                    }
                                    placeholder="book-open"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="category-sort-order"
                                    className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                                >
                                    Sort order
                                </label>

                                <WorkspaceInput
                                    id="category-sort-order"
                                    type="number"
                                    min={0}
                                    value={form.sortOrder}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            sortOrder: Number(
                                                event.target.value
                                            ),
                                        }))
                                    }
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <WorkspaceButton
                            type="button"
                            variant="secondary"
                            disabled={isSubmitting}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </WorkspaceButton>

                        <WorkspaceButton
                            type="submit"
                            disabled={
                                isSubmitting ||
                                !form.name.trim() ||
                                !form.slug.trim()
                            }
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Saving...
                                </>
                            ) : isEditing ? (
                                "Save Changes"
                            ) : (
                                "Create Category"
                            )}
                        </WorkspaceButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
