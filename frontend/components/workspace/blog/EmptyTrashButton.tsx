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

interface DeletePostButtonProps {
    postId: string;
}

export default function DeletePostButton({
    postId,
}: DeletePostButtonProps) {
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
                <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    title="Delete post"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl p-8 sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold">
                        Empty Trash?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="mt-2 leading-relaxed">
                        Are you sure you want to empty the trash?
                        This action cannot be undone and the posts will be
                        permanently removed from your workspace.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 gap-3">
                    <AlertDialogCancel className="rounded-xl px-5 cursor-pointer">
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