"use client";

import { Loader2, RotateCcw } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface RestoreRevisionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isRestoring?: boolean;
}


export default function RestoreRevisionDialog({
    open,
    onOpenChange,
    onConfirm,
    isRestoring = false,
}: RestoreRevisionDialogProps) {

    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)]">

                <AlertDialogHeader>

                    <AlertDialogTitle className="text-[var(--workspace-text)]">
                        Restore this revision?
                    </AlertDialogTitle>


                    <AlertDialogDescription className="text-[var(--workspace-text-muted)]">
                        This will replace the current
                        post content with this older
                        version. Your current version
                        will be saved in revision history
                        before restoring.
                    </AlertDialogDescription>

                </AlertDialogHeader>


                <AlertDialogFooter>

                    <AlertDialogCancel
                        disabled={isRestoring}
                        className="rounded-lg border-[var(--workspace-border)] bg-[var(--workspace-surface)] text-[var(--workspace-text)] hover:bg-[var(--workspace-background)]"
                    >
                        Cancel
                    </AlertDialogCancel>


                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            onConfirm();
                        }}
                        disabled={isRestoring}
                        className="rounded-lg bg-[var(--workspace-primary)] hover:bg-[var(--workspace-primary-hover)]"
                    >
                        {isRestoring ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Restoring...
                            </>
                        ) : (
                            <>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore Version
                            </>
                        )}
                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>
    );
}