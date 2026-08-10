"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
    Archive,
    Loader2,
    MoreHorizontal,
    Pencil,
} from "lucide-react";

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

interface ContactActionsProps {
    contactId: string;
}

export default function ContactActions({
    contactId,
}: ContactActionsProps) {
    const router = useRouter();

    const [isArchiving, setIsArchiving] = useState(false);

    const handleArchive = async () => {
        setIsArchiving(true);

        try {
            const response = await fetch(
                `/api/crm/contacts/${contactId}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.error ||
                    "Failed to archive contact"
                );
            }

            toast.success("Contact archived successfully");

            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to archive contact"
            );
        } finally {
            setIsArchiving(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-1">
            <Link
                href={`/workspace/crm/contacts/${contactId}`}
                className="
                    rounded-md
                    px-2
                    py-1.5
                    text-xs
                    font-medium
                    text-[var(--workspace-text-muted)]
                    transition-colors
                    hover:bg-[var(--workspace-background)]
                    hover:text-[var(--workspace-text)]
                "
            >
                View
            </Link>

            <Link
                href={`/workspace/crm/contacts/${contactId}/edit`}
                aria-label="Edit contact"
                className="
                    rounded-md
                    p-1.5
                    text-[var(--workspace-text-muted)]
                    transition-colors
                    hover:bg-[var(--workspace-background)]
                    hover:text-[var(--workspace-text)]
                "
            >
                <Pencil className="h-4 w-4" />
            </Link>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button
                        type="button"
                        aria-label="More contact actions"
                        className="
                            rounded-md
                            p-1.5
                            text-[var(--workspace-text-muted)]
                            transition-colors
                            hover:bg-[var(--workspace-background)]
                            hover:text-[var(--workspace-text)]
                        "
                        disabled={isArchiving}
                    >
                        {isArchiving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MoreHorizontal className="h-4 w-4" />
                        )}
                    </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Archive contact?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This contact will be removed from
                            your active CRM contacts. The record
                            will be archived rather than
                            permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isArchiving}
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleArchive}
                            disabled={isArchiving}
                        >
                            {isArchiving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Archiving...
                                </>
                            ) : (
                                <>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive Contact
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}