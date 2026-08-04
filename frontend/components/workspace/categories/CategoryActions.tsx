"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CategoryActionsProps {
    category: Category;
}

export default function CategoryActions({
    category,
}: CategoryActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            const response = await fetch(
                `/api/categories/${category.id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to delete category."
                );
            }

            toast.success("Category deleted successfully.");

            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <Link
                href={`/workspace/categories/edit/${category.id}`}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
            >
                Edit
            </Link>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button
                        type="button"
                        disabled={isDeleting}
                        className="rounded-md border border-destructive px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Category
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{category.name}</strong>?
                            <br />
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting
                                ? "Deleting..."
                                : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}