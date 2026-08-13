"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

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

interface DeleteSEOPageButtonProps {
    pageId: string;
    pagePath: string;
    onDeleted: (pageId: string) => void;
}

export default function DeleteSEOPageButton({
    pageId,
    pagePath,
    onDeleted,
}: DeleteSEOPageButtonProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete() {
        if (isDeleting) return;

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/api/seo/pages/${pageId}`, {
                method: "DELETE",
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setError(
                    data?.error ?? "Unable to delete this SEO page."
                );

                return;
            }

            toast.success("SEO page deleted successfully.");

            setOpen(false);

            onDeleted(pageId);
        } catch (deleteError) {
            console.error("SEO page deletion failed:", deleteError);

            setError(
                "Something went wrong while deleting this SEO page."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (!nextOpen) {
            setError(null);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    aria-label={`Delete SEO page ${pagePath}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-danger)]/10 hover:text-[var(--workspace-danger)]"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[var(--workspace-text)]">
                        Delete SEO page?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-[var(--workspace-text-muted)]">
                        This will permanently remove the SEO configuration
                        for{" "}
                        <span className="font-medium text-[var(--workspace-text)]">
                            {pagePath}
                        </span>
                        . This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <div className="rounded-xl border border-[var(--workspace-danger)]/30 bg-[var(--workspace-danger)]/5 p-4">
                        <p className="text-sm font-medium text-[var(--workspace-danger)]">
                            Unable to delete this SEO page
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[var(--workspace-text-muted)]">
                            {error}
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
                        className="rounded-lg bg-[var(--workspace-danger)] text-white transition-opacity hover:opacity-90 focus:ring-[var(--workspace-danger)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete Page
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
