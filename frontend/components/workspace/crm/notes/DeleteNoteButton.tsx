"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface DeleteNoteButtonProps {
    noteId: string;
}

export default function DeleteNoteButton({
    noteId,
}: DeleteNoteButtonProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete() {
        if (isDeleting) return;

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/crm/notes/${noteId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data?.error ||
                    "Unable to delete this note."
                );

                return;
            }

            toast.success("Note deleted successfully.");

            setOpen(false);

            router.refresh();
        } catch (error) {
            console.error(
                "Note deletion failed:",
                error
            );

            setError(
                "Something went wrong while deleting the note."
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
        <AlertDialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    aria-label="Delete note"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[var(--workspace-text)]">
                        Delete note?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-[var(--workspace-text-muted)]">
                        This will permanently remove this note
                        from your CRM. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-800">
                            Unable to delete this note
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-700">
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
                                Delete Note
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}