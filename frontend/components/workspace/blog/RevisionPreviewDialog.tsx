"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";


interface Revision {
    id: string;
    title: string;
    content: string;
    seoTitle: string | null;
    seoDescription: string | null;
    createdAt: string;
}


interface RevisionPreviewDialogProps {
    revision: Revision | null;
    open: boolean;
    onClose: () => void;
    onRestore: (revision: Revision) => void;
}


export default function RevisionPreviewDialog({
    revision,
    open,
    onClose,
    onRestore,
}: RevisionPreviewDialogProps) {

    if (!revision) return null;


    return (
        <Dialog
            open={open}
            onOpenChange={onClose}
        >

            <DialogContent className="max-w-3xl">

                <DialogHeader>

                    <DialogTitle>
                        Revision Preview
                    </DialogTitle>

                    <DialogDescription>
                        Created on{" "}
                        {new Date(
                            revision.createdAt
                        ).toLocaleString()}
                    </DialogDescription>

                </DialogHeader>


                <div className="space-y-4">

                    <div>
                        <h3 className="font-semibold">
                            Title
                        </h3>

                        <p>
                            {revision.title}
                        </p>
                    </div>


                    <div>
                        <h3 className="font-semibold">
                            SEO Title
                        </h3>

                        <p>
                            {revision.seoTitle || "None"}
                        </p>
                    </div>


                    <div>
                        <h3 className="font-semibold">
                            Content Preview
                        </h3>

                        <div
                            className="
                                max-h-64
                                overflow-auto
                                rounded-lg
                                border
                                p-4
                            "
                            dangerouslySetInnerHTML={{
                                __html:
                                    revision.content,
                            }}
                        />
                    </div>


                    <Button
                        onClick={() =>
                            onRestore(revision)
                        }
                    >
                        Restore This Version
                    </Button>

                </div>

            </DialogContent>

        </Dialog>
    );
}