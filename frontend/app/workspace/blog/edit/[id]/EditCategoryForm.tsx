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
        console.log(data);
    };

    return (
        <CategoryForm
            mode="edit"
            defaultValues={{
                ...category,
                description: category.description ?? undefined,
            }}
            onSubmit={onSubmit}
        />
    );
}