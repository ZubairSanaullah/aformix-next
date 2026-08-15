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

import { trashPortfolioProjectRequest } from "@/lib/api/portfolio";

interface TrashPortfolioProjectButtonProps {
    projectId: string;
    projectTitle: string;
}

export default function TrashPortfolioProjectButton({
    projectId,
    projectTitle,
}: TrashPortfolioProjectButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function handleTrash() {
        try {
            await trashPortfolioProjectRequest(projectId);

            setOpen(false);
            toast.success("Project moved to trash.");

            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to move the project to trash.");
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--workspace-border)] text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    title="Move to trash"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-8 sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold text-[var(--workspace-text)]">
                        Move &ldquo;{projectTitle}&rdquo; to trash?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="mt-2 leading-relaxed text-[var(--workspace-text-muted)]">
                        The project will be removed from the dashboard and
                        moved to trash. You can restore it from there at
                        any time.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 gap-3">
                    <AlertDialogCancel className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-5 text-[var(--workspace-text)] hover:bg-[var(--workspace-background)] cursor-pointer">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            handleTrash();
                        }}
                        disabled={isPending}
                        className="rounded-xl bg-red-600 px-5 text-white hover:bg-red-700 cursor-pointer"
                    >
                        {isPending ? "Moving..." : "Move to trash"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}