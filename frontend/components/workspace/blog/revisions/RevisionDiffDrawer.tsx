"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import RevisionDiffViewer from "./RevisionDiffViewer";
import RestoreRevisionDialog from "@/components/workspace/blog/RestoreRevisionDialog";

interface RevisionDiffDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    leftRevision: any;
    rightRevision: any;

    /*
     * Optional — only pass these when restoring makes sense
     * (i.e. comparing an older revision against the live post).
     * When omitted, no restore action is shown.
     */
    postId?: string;
    restoreRevisionId?: string;
    onRestored?: () => void;
}

function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
}

export default function RevisionDiffDrawer({
    open,
    onOpenChange,
    leftRevision,
    rightRevision,
    postId,
    restoreRevisionId,
    onRestored,
}: RevisionDiffDrawerProps) {
    const router = useRouter();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const canRestore = Boolean(postId && restoreRevisionId);

    async function handleRestore() {
        if (!postId || !restoreRevisionId) return;

        try {
            setIsRestoring(true);

            const res = await fetch(
                `/api/posts/${postId}/revisions/${restoreRevisionId}/restore`,
                {
                    method: "PATCH",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message ?? "Restore failed.");
            }

            toast.success("Revision restored successfully.");

            setConfirmOpen(false);
            onOpenChange(false);
            onRestored?.();

            router.refresh();
        } catch (error) {
            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Restore failed."
            );
        } finally {
            setIsRestoring(false);
        }
    }

    if (!leftRevision || !rightRevision) {
        return null;
    }

    return (
        <>
            <Sheet
                open={open}
                onOpenChange={onOpenChange}
            >
                <SheetContent
                    side="right"
                    className="w-full overflow-y-auto border-l border-[var(--workspace-border)] bg-[var(--workspace-surface)] sm:max-w-5xl"
                >
                    <SheetHeader className="flex-row items-center justify-between space-y-0">
                        <SheetTitle className="text-[var(--workspace-text)]">
                            Compare Revisions
                        </SheetTitle>

                        {canRestore && (
                            <WorkspaceButton
                                variant="primary"
                                size="sm"
                                onClick={() => setConfirmOpen(true)}
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Restore This Version
                            </WorkspaceButton>
                        )}
                    </SheetHeader>

                    <div className="mt-6 rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div>
                                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--workspace-text)]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--workspace-text-subtle)]" />
                                    Older Revision
                                </p>
                                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                                    {leftRevision.title}
                                </p>
                                <p className="mt-0.5 text-[10px] text-[var(--workspace-text-subtle)]">
                                    {formatDate(leftRevision.createdAt)}
                                </p>
                            </div>

                            <div>
                                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--workspace-text)]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--workspace-primary)]" />
                                    Newer Revision
                                </p>
                                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                                    {rightRevision.title}
                                </p>
                                <p className="mt-0.5 text-[10px] text-[var(--workspace-text-subtle)]">
                                    {formatDate(rightRevision.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <RevisionDiffViewer
                            leftRevision={leftRevision}
                            rightRevision={rightRevision}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {canRestore && (
                <RestoreRevisionDialog
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                    onConfirm={handleRestore}
                    isRestoring={isRestoring}
                />
            )}
        </>
    );
}