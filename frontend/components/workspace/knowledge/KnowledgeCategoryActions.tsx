"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, ArchiveRestore, Loader2, Trash2 } from "lucide-react";

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

interface KnowledgeCategoryActionsProps {
    categoryId: string;
    categoryName: string;
    isDeleted: boolean;
}

export default function KnowledgeCategoryActions({
    categoryId,
    categoryName,
    isDeleted,
}: KnowledgeCategoryActionsProps) {
    const router = useRouter();

    const [isArchiving, setIsArchiving] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    async function handleArchiveToggle() {
        if (isArchiving) return;

        setIsArchiving(true);

        try {
            const endpoint = isDeleted
                ? `/api/knowledge/categories/${categoryId}/restore`
                : `/api/knowledge/categories/${categoryId}/archive`;

            const response = await fetch(endpoint, { method: "POST" });
            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data?.error ||
                        `Unable to ${isDeleted ? "restore" : "archive"} this category.`
                );
                return;
            }

            toast.success(
                isDeleted
                    ? "Category restored successfully."
                    : "Category archived successfully."
            );

            router.refresh();
        } catch (error) {
            console.error(
                "Knowledge category archive/restore failed:",
                error
            );

            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsArchiving(false);
        }
    }

    async function handleDelete() {
        if (isDeleting) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(
                `/api/knowledge/categories/${categoryId}`,
                { method: "DELETE" }
            );

            const data = await response.json();

            if (!response.ok) {
                // 409 means articles still reference this category —
                // the service protects against orphaning them.
                setDeleteError(
                    response.status === 409
                        ? data?.error ||
                              "This category still has articles assigned to it. Archive it instead, or move its articles to another category first."
                        : data?.error || "Unable to delete this category."
                );
                return;
            }

            toast.success("Category deleted permanently.");
            setDeleteOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Knowledge category deletion failed:", error);

            setDeleteError(
                "Something went wrong while deleting the category."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                onClick={handleArchiveToggle}
                disabled={isArchiving}
                aria-label={
                    isDeleted
                        ? `Restore ${categoryName}`
                        : `Archive ${categoryName}`
                }
                title={isDeleted ? "Restore category" : "Archive category"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isArchiving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : isDeleted ? (
                    <ArchiveRestore className="h-3.5 w-3.5" />
                ) : (
                    <Archive className="h-3.5 w-3.5" />
                )}
            </button>

            <AlertDialog
                open={deleteOpen}
                onOpenChange={(open) => {
                    setDeleteOpen(open);

                    if (!open) {
                        setDeleteError(null);
                    }
                }}
            >
                <AlertDialogTrigger asChild>
                    <button
                        type="button"
                        aria-label={`Delete ${categoryName}`}
                        title="Delete category"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[var(--workspace-text)]">
                            Permanently delete category?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-[var(--workspace-text-muted)]">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-medium text-[var(--workspace-text)]">
                                {categoryName}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {deleteError && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm font-medium text-amber-800">
                                Unable to delete this category
                            </p>

                            <p className="mt-1 text-xs leading-5 text-amber-700">
                                {deleteError}
                            </p>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isDeleting}
                            className="rounded-lg border-[var(--workspace-border)] bg-[var(--workspace-surface)] text-[var(--workspace-text)] hover:bg-[var(--workspace-background)]"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                handleDelete();
                            }}
                            disabled={isDeleting}
                            className="rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Permanently
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
