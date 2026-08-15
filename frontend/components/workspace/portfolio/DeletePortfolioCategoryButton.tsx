"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
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

import {
    deletePortfolioCategoryRequest,
    PortfolioApiError,
} from "@/lib/api/portfolio";

interface DeletePortfolioCategoryButtonProps {
    categoryId: string;
    categoryName: string;
}

export default function DeletePortfolioCategoryButton({
    categoryId,
    categoryName,
}: DeletePortfolioCategoryButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function handleDelete() {
        try {
            await deletePortfolioCategoryRequest(categoryId);

            setOpen(false);
            toast.success("Category permanently deleted.");

            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error(error);

            const message =
                error instanceof PortfolioApiError
                    ? error.message
                    : "Failed to delete the category.";

            toast.error(message);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--workspace-border)] text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    title="Delete category permanently"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-8 sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold text-[var(--workspace-text)]">
                        Permanently delete &ldquo;{categoryName}&rdquo;?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="mt-2 leading-relaxed text-[var(--workspace-text-muted)]">
                        This cannot be undone. Categories with active
                        portfolio projects can&apos;t be deleted — move or
                        reassign those projects first.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 gap-3">
                    <AlertDialogCancel className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-5 text-[var(--workspace-text)] hover:bg-[var(--workspace-background)] cursor-pointer">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                        className="rounded-xl bg-red-600 px-5 text-white hover:bg-red-700 cursor-pointer"
                    >
                        {isPending ? "Deleting..." : "Delete Permanently"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}