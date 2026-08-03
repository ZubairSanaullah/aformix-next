"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import CategoryForm from "@/components/workspace/categories/CategoryForm";
import type { CategoryInput } from "@/lib/validations/category";

export default function CreateCategoryPage() {
    const router = useRouter();

    const onSubmit = async (data: CategoryInput) => {
        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to create category.");
                return;
            }

            toast.success("Category created successfully!");

            router.push("/workspace/categories");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Create New Category
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Create a new category for your blog.
                </p>
            </div>

            <CategoryForm
                mode="create"
                onSubmit={onSubmit}
            />
        </div>
    );
}