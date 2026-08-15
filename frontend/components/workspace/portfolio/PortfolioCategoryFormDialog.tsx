"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import {
    createPortfolioCategoryRequest,
    updatePortfolioCategoryRequest,
    type PortfolioCategoryItem,
} from "@/lib/api/portfolio";

const categoryFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required.").max(100),
    slug: z
        .string()
        .trim()
        .min(1, "Slug is required.")
        .max(200)
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug may only contain lowercase letters, numbers, and single hyphens.",
        ),
    description: z.string().trim().max(1000).optional(),
    icon: z.string().trim().max(100).optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

interface PortfolioCategoryFormDialogProps {
    mode: "create" | "edit";
    category?: PortfolioCategoryItem;
    trigger: React.ReactNode;
}

export default function PortfolioCategoryFormDialog({
    mode,
    category,
    trigger,
}: PortfolioCategoryFormDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [slugTouched, setSlugTouched] = useState(mode === "edit");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: category?.name ?? "",
            slug: category?.slug ?? "",
            description: category?.description ?? "",
            icon: category?.icon ?? "",
        },
    });

    const nameValue = watch("name");

    useEffect(() => {
        if (!slugTouched && mode === "create") {
            setValue("slug", slugify(nameValue || ""));
        }
    }, [nameValue, slugTouched, mode, setValue]);

    useEffect(() => {
        if (open) {
            reset({
                name: category?.name ?? "",
                slug: category?.slug ?? "",
                description: category?.description ?? "",
                icon: category?.icon ?? "",
            });
            setSlugTouched(mode === "edit");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    async function onSubmit(values: CategoryFormValues) {
        try {
            if (mode === "create") {
                await createPortfolioCategoryRequest(values);
                toast.success("Category created.");
            } else if (category) {
                await updatePortfolioCategoryRequest(category.id, values);
                toast.success("Category updated.");
            }

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save the category.",
            );
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-6 shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Dialog.Title className="text-base font-semibold text-[var(--workspace-text)]">
                                {mode === "create" ? "New Category" : "Edit Category"}
                            </Dialog.Title>
                            <Dialog.Description className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                                {mode === "create"
                                    ? "Create a new portfolio category."
                                    : "Update this category's details."}
                            </Dialog.Description>
                        </div>

                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="rounded-lg p-1 text-[var(--workspace-text-subtle)] hover:bg-[var(--workspace-background)]"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-5 space-y-4"
                    >
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-[var(--workspace-text)]">
                                Name
                            </label>
                            <Input
                                placeholder="e.g. Web Development"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-[var(--workspace-text)]">
                                Slug
                            </label>
                            <Input
                                placeholder="web-development"
                                {...register("slug", {
                                    onChange: () => setSlugTouched(true),
                                })}
                            />
                            {errors.slug && (
                                <p className="text-xs text-red-500">
                                    {errors.slug.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-[var(--workspace-text)]">
                                Description
                            </label>
                            <Textarea
                                rows={3}
                                placeholder="Optional short description..."
                                {...register("description")}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-[var(--workspace-text)]">
                                Icon
                            </label>
                            <Input
                                placeholder="Optional icon name (e.g. lucide icon key)"
                                {...register("icon")}
                            />
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[var(--workspace-border)] pt-4">
                            <Dialog.Close asChild>
                                <WorkspaceButton variant="secondary" size="md" type="button">
                                    Cancel
                                </WorkspaceButton>
                            </Dialog.Close>

                            <WorkspaceButton
                                variant="primary"
                                size="md"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Saving..."
                                    : mode === "create"
                                      ? "Create Category"
                                      : "Save Changes"}
                            </WorkspaceButton>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}