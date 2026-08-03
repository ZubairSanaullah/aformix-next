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

        toast.info("PATCH API will be implemented next.");
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