"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

interface BulkActionsToolbarProps {
    ids: string[];
    onSuccess: () => void;
}

export default function BulkActionsToolbar({
    ids,
    onSuccess,
}: BulkActionsToolbarProps) {
    const router = useRouter();

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [isPending, startTransition] = useTransition();

    async function runAction(action: "publish" | "archive" | "delete") {
        try {
            const response = await fetch("/api/posts/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ids,
                    action,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Action failed");
            }

            toast.success(
                `${ids.length} post${ids.length > 1 ? "s" : ""} ${action}d successfully.`
            );

            onSuccess();

            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error(error);

            toast.error("Bulk action failed.");
        }
    }

    return (
        <div className="flex items-center justify-between border-b bg-primary/5 px-6 py-3">
            <span className="text-sm font-medium">
                {ids.length} post{ids.length > 1 ? "s" : ""} selected
            </span>

            <div className="flex items-center gap-2">
                <button
                    disabled={isPending}
                    onClick={() => runAction("publish")}
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                >
                    Publish
                </button>

                <button
                    disabled={isPending}
                    onClick={() => runAction("archive")}
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                >
                    Archive
                </button>

                <AlertDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                >
                    <AlertDialogTrigger asChild>
                        <button
                            disabled={isPending}
                            className="rounded-lg border border-red-500 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                            Delete
                        </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete selected posts?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will move the selected posts to Trash.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();

                                    setDeleteOpen(false);

                                    runAction("delete");
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}