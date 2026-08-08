"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Archive,
    Send,
    Trash2,
} from "lucide-react";
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

interface BulkActionsToolbarProps {
    ids: string[];
    onSuccess: () => void;
}

export default function BulkActionsToolbar({
    ids,
    onSuccess,
}: BulkActionsToolbarProps) {
    const router = useRouter();

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [isPending, startTransition] =
        useTransition();

    async function runAction(
        action: "publish" | "archive" | "delete"
    ) {
        try {
            const response = await fetch(
                "/api/posts/bulk",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        ids,
                        action,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Action failed"
                );
            }

            const actionLabel =
                action === "publish"
                    ? "published"
                    : action === "archive"
                        ? "archived"
                        : "moved to trash";

            toast.success(
                `${ids.length} post${ids.length > 1 ? "s" : ""
                } ${actionLabel} successfully.`
            );

            onSuccess();

            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error(error);
            toast.error(
                "The bulk action could not be completed."
            );
        }
    }

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <div className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--workspace-primary-soft)] px-2 text-[10px] font-semibold text-[var(--workspace-primary)]">
                    {ids.length}
                </div>

                <span className="text-xs font-medium text-[var(--workspace-text)]">
                    {ids.length === 1
                        ? "Post selected"
                        : "Posts selected"}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
                <WorkspaceButton
                    size="sm"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() =>
                        runAction("publish")
                    }
                >
                    <Send className="h-3 w-3" />
                    Publish
                </WorkspaceButton>

                <WorkspaceButton
                    size="sm"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() =>
                        runAction("archive")
                    }
                >
                    <Archive className="h-3 w-3" />
                    Archive
                </WorkspaceButton>

                <AlertDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                >
                    <AlertDialogTrigger asChild>
                        <WorkspaceButton
                            size="sm"
                            variant="danger"
                            disabled={isPending}
                        >
                            <Trash2 className="h-3 w-3" />
                            Move to Trash
                        </WorkspaceButton>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="rounded-xl border border-[var(--workspace-border)]">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Move selected posts to
                                Trash?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                {ids.length} selected post
                                {ids.length > 1
                                    ? "s will"
                                    : " will"}{" "}
                                be moved to Trash. You can
                                restore them later.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                onClick={(event) => {
                                    event.preventDefault();

                                    setDeleteOpen(false);

                                    runAction(
                                        "delete"
                                    );
                                }}
                                disabled={isPending}
                            >
                                Move to Trash
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}