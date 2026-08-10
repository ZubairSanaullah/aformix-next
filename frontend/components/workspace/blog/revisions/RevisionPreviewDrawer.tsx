"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Clock3,
    RotateCcw,
    User,
    FileText,
    Loader2,
} from "lucide-react";

import Editor from "@/components/workspace/editor/Editor";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

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

import Badge from "@/components/ui/Badge";
import Divider from "@/components/ui/Divider";
import Skeleton from "@/components/ui/Skeleton";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import RevisionDiffDrawer from "./RevisionDiffDrawer";
import type { Revision } from "./types";


interface RevisionPreviewDrawerProps {
    postId: string;
    revisionId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export default function RevisionPreviewDrawer({
    postId,
    revisionId,
    open,
    onOpenChange,
}: RevisionPreviewDrawerProps) {
    const [diffOpen, setDiffOpen] = useState(false);

    const router = useRouter();

    const [revision, setRevision] =
        useState<Revision | null>(null);

    const [currentPost, setCurrentPost] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(false);

    const [restoring, setRestoring] =
        useState(false);

    const [confirmOpen, setConfirmOpen] =
        useState(false);


    useEffect(() => {

        if (!open || !revisionId) return;


        let cancelled = false;


        async function loadRevision() {

            try {

                setLoading(true);


                const res = await fetch(
                    `/api/posts/${postId}/revisions/${revisionId}`,
                    {
                        cache: "no-store",
                    }
                );


                const data = await res.json();


                if (!res.ok) {

                    throw new Error(
                        data.message ??
                        "Failed to load revision."
                    );
                }


                if (!cancelled) {

                    setRevision(
                        data.revision
                    );
                }

                const postRes = await fetch(
                    `/api/posts/${postId}`,
                    {
                        cache: "no-store",
                    }
                );

                const postData = await postRes.json();

                if (postRes.ok && !cancelled) {
                    setCurrentPost(postData.post);
                }


            } catch (error) {

                console.error(error);

                toast.error(
                    "Failed to load revision."
                );

                onOpenChange(false);


            } finally {

                if (!cancelled) {

                    setLoading(false);

                }
            }
        }


        loadRevision();


        return () => {

            cancelled = true;

        };


    }, [
        open,
        revisionId,
        postId,
        onOpenChange,
    ]);



    async function restoreRevision() {

        if (!revision) return;


        try {

            setRestoring(true);


            const res = await fetch(
                `/api/posts/${postId}/revisions/${revision.id}/restore`,
                {
                    method: "PATCH",
                }
            );


            const data = await res.json();


            if (!res.ok) {

                throw new Error(
                    data.message ??
                    "Restore failed."
                );
            }


            toast.success(
                "Revision restored successfully."
            );


            setConfirmOpen(false);

            onOpenChange(false);


            router.refresh();


        } catch (error) {

            console.error(error);


            toast.error(
                error instanceof Error
                    ? error.message
                    : "Restore failed."
            );


        } finally {

            setRestoring(false);

        }
    }



    return (
        <>

            <Sheet
                open={open}
                onOpenChange={onOpenChange}
            >

                <SheetContent
                    side="right"
                    className="w-full overflow-y-auto border-l border-[var(--workspace-border)] bg-[var(--workspace-surface)] sm:max-w-3xl"
                >

                    <SheetHeader>

                        <SheetTitle className="flex items-center gap-2 text-[var(--workspace-text)]">

                            <FileText className="h-5 w-5" />

                            Revision Preview

                        </SheetTitle>


                        <SheetDescription className="text-[var(--workspace-text-muted)]">

                            Preview a previous version before restoring it.

                        </SheetDescription>

                    </SheetHeader>


                    <Divider className="my-6 border-[var(--workspace-border)]" />


                    {loading && (

                        <div className="space-y-4">

                            <Skeleton className="h-8 w-2/3" />

                            <Skeleton className="h-5 w-1/3" />

                            <Skeleton className="h-80 rounded-xl" />

                        </div>

                    )}


                    {!loading && revision && (

                        <div className="space-y-6">


                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <h2 className="text-2xl font-bold text-[var(--workspace-text)]">
                                        {revision.title}
                                    </h2>


                                    <p className="text-sm text-[var(--workspace-text-muted)]">
                                        {revision.slug}
                                    </p>

                                </div>


                                <Badge
                                    variant={
                                        revision.status === "PUBLISHED"
                                            ? "success"
                                            : revision.status === "ARCHIVED"
                                                ? "warning"
                                                : "default"
                                    }
                                >
                                    {revision.status}
                                </Badge>

                            </div>



                            <div className="flex flex-wrap gap-6 text-sm text-[var(--workspace-text-muted)]">

                                <div className="flex items-center gap-2">

                                    <User className="h-4 w-4" />

                                    {revision?.author?.name ??
                                        revision?.author?.email}

                                </div>


                                <div className="flex items-center gap-2">

                                    <Clock3 className="h-4 w-4" />

                                    {revision.readingTime} min read

                                </div>


                                <div>

                                    {new Date(
                                        revision.createdAt
                                    ).toLocaleString()}

                                </div>

                            </div>



                            {revision.excerpt && (

                                <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4 text-sm text-[var(--workspace-text)]">

                                    {revision.excerpt}

                                </div>

                            )}



                            <Divider className="border-[var(--workspace-border)]" />


                            <div>

                                <h3 className="mb-3 text-lg font-semibold text-[var(--workspace-text)]">
                                    Content
                                </h3>


                                <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4">

                                    <Editor
                                        value={revision.content}
                                        onChange={() => { }}
                                        editable={false}
                                        showToolbar={false}
                                    />

                                </div>

                            </div>



                            <Divider className="border-[var(--workspace-border)]" />



                            <div className="flex justify-end gap-3">

                                <WorkspaceButton
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        setDiffOpen(true)
                                    }
                                    disabled={!currentPost}
                                >
                                    Compare Changes
                                </WorkspaceButton>


                                <WorkspaceButton
                                    type="button"
                                    variant="primary"
                                    onClick={() =>
                                        setConfirmOpen(true)
                                    }
                                    disabled={restoring}
                                >

                                    <RotateCcw className="h-4 w-4" />

                                    Restore Revision

                                </WorkspaceButton>

                            </div>


                        </div>

                    )}

                </SheetContent>

            </Sheet>



            <AlertDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
            >

                <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)]">

                    <AlertDialogHeader>

                        <AlertDialogTitle className="text-[var(--workspace-text)]">
                            Restore this revision?
                        </AlertDialogTitle>


                        <AlertDialogDescription className="text-[var(--workspace-text-muted)]">

                            Your current post will be saved
                            as a new revision before this
                            revision is restored.

                        </AlertDialogDescription>

                    </AlertDialogHeader>



                    <AlertDialogFooter>

                        <AlertDialogCancel className="rounded-lg border-[var(--workspace-border)] bg-[var(--workspace-surface)] text-[var(--workspace-text)] hover:bg-[var(--workspace-background)]">
                            Cancel
                        </AlertDialogCancel>


                        <AlertDialogAction
                            onClick={(e) => {

                                e.preventDefault();

                                restoreRevision();

                            }}
                            disabled={restoring}
                            className="rounded-lg bg-[var(--workspace-primary)] hover:bg-[var(--workspace-primary-hover)]"
                        >

                            {restoring ? (

                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Restoring...
                                </>

                            ) : (

                                <>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Restore
                                </>

                            )}

                        </AlertDialogAction>


                    </AlertDialogFooter>


                </AlertDialogContent>


            </AlertDialog>

            <RevisionDiffDrawer
                open={diffOpen}
                onOpenChange={setDiffOpen}
                leftRevision={revision}
                rightRevision={currentPost}
            />
        </>
    );
}