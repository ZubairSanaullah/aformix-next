"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

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

export default function EmptyTrashButton() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function handleDelete() {
        try {
            const response = await fetch(`/api/posts/trash`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to empty trash.");
            }

            setOpen(false);

            toast.success("Trash emptied successfully.");

            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to empty trash.");
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <WorkspaceButton variant="danger" size="md">
                    <Trash2 className="h-3.5 w-3.5" />
                    Empty Trash
                </WorkspaceButton>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-8 sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold text-[var(--workspace-text)]">
                        Empty Trash?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="mt-2 leading-relaxed text-[var(--workspace-text-muted)]">
                        Are you sure you want to empty the trash?
                        This action cannot be undone and the posts will be
                        permanently removed from your workspace.
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
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}