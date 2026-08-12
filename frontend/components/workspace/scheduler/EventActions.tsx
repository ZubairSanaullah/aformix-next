"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";
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
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import {
    cancelEvent,
    deleteEvent,
    markEventCompleted,
} from "@/lib/api/scheduler";
import type { CalendarEvent } from "@/lib/types/scheduler";

interface EventActionsProps {
    event: CalendarEvent;
    onChanged?: () => void;
    /** Show the delete button. Defaults to true; the detail page may hide it in favor of a dedicated flow. */
    showDelete?: boolean;
}

export default function EventActions({
    event,
    onChanged,
    showDelete = true,
}: EventActionsProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function handleComplete() {
        try {
            await markEventCompleted(event.id);
            toast.success("Event marked as completed.");
            onChanged?.();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update the event.");
        }
    }

    async function handleCancel() {
        try {
            await cancelEvent(event.id);
            toast.success("Event cancelled.");
            onChanged?.();
        } catch (error) {
            console.error(error);
            toast.error("Failed to cancel the event.");
        }
    }

    async function handleDelete() {
        try {
            await deleteEvent(event.id);
            setDeleteOpen(false);
            toast.success("Event deleted.");
            startTransition(() => onChanged?.());
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete the event.");
        }
    }

    return (
        <div className="flex items-center gap-1.5">
            {event.status !== "COMPLETED" && (
                <WorkspaceButton
                    variant="ghost"
                    size="sm"
                    onClick={handleComplete}
                    title="Mark completed"
                    aria-label="Mark event completed"
                >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                </WorkspaceButton>
            )}

            {event.status === "SCHEDULED" && (
                <WorkspaceButton
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    title="Cancel event"
                    aria-label="Cancel event"
                >
                    <XCircle className="h-3.5 w-3.5" />
                </WorkspaceButton>
            )}

            {showDelete && (
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogTrigger asChild>
                        <WorkspaceButton
                            variant="ghost"
                            size="sm"
                            title="Delete event"
                            aria-label="Delete event"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </WorkspaceButton>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-8 sm:max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold text-[var(--workspace-text)]">
                                Delete Event?
                            </AlertDialogTitle>

                            <AlertDialogDescription className="mt-2 leading-relaxed text-[var(--workspace-text-muted)]">
                                Are you sure you want to delete
                                &ldquo;{event.title}&rdquo;? This
                                action cannot be undone.
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
            )}
        </div>
    );
}
