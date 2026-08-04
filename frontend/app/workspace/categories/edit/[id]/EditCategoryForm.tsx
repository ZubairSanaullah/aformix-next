"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Category } from "@prisma/client";

import CategoryForm from "@/components/workspace/categories/CategoryForm";
import type { CategoryInput } from "@/lib/validations/category";

interface EditCategoryFormProps {
    category: Category;
}

export default function EditCategoryForm({
    category,
}: EditCategoryFormProps) {
    const router = useRouter();

    const onSubmit = async (data: CategoryInput) => {
        try {
            const response = await fetch(
                `/api/categories/${category.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to update category."
                );
            }

            toast.success("Category updated successfully.");

            router.refresh();
            router.push("/workspace/categories");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        }
    };

    return (
        <CategoryForm
            mode="edit"
            defaultValues={{
                name: category.name,
                description: category.description ?? "",
            }}
            onSubmit={onSubmit}
        />
    );
}