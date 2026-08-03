"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import {
    categorySchema,
    type CategoryInput,
} from "@/lib/validations/category";

interface CategoryFormProps {
    mode: "create" | "edit";
    defaultValues?: Partial<CategoryInput>;
    onSubmit: (data: CategoryInput) => Promise<void>;
}

const EMPTY_VALUES: CategoryInput = {
    name: "",
    description: "",
};

export default function CategoryForm({
    mode,
    defaultValues,
    onSubmit,
}: CategoryFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CategoryInput>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            ...EMPTY_VALUES,
            ...defaultValues,
        },
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            <div>
                <h2 className="text-2xl font-semibold">
                    {mode === "create"
                        ? "Create Category"
                        : "Edit Category"}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    {mode === "create"
                        ? "Create a new category for your blog."
                        : "Update an existing category."}
                </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Name
                </label>

                <Input
                    placeholder="Category name..."
                    {...register("name")}
                />

                {errors.name && (
                    <p className="text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Description
                </label>

                <Textarea
                    rows={4}
                    placeholder="Optional description..."
                    {...register("description")}
                />

                {errors.description && (
                    <p className="text-sm text-red-500">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                        ? "Create Category"
                        : "Update Category"}
            </button>
        </form>
    );
}