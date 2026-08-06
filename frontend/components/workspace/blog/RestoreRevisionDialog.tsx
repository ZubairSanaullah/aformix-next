"use client";

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
}


export default function RestoreRevisionDialog({
    open,
    onOpenChange,
    onConfirm,
}: RestoreRevisionDialogProps) {

    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <AlertDialogContent>

                <AlertDialogHeader>

                    <AlertDialogTitle>
                        Restore this revision?
                    </AlertDialogTitle>


                    <AlertDialogDescription>
                        This will replace the current
                        post content with this older
                        version. Your current version
                        will be saved in revision history
                        before restoring.
                    </AlertDialogDescription>

                </AlertDialogHeader>


                <AlertDialogFooter>

                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>


                    <AlertDialogAction
                        onClick={onConfirm}
                    >
                        Restore Version
                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>
    );
}