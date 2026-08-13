"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, ArchiveRestore, Loader2, Trash2 } from "lucide-react";

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

import { WorkspaceButton } from "@/components/workspace/ui";

type LifecycleAction = "archive" | "restore" | "delete";

interface ProjectLifecycleActionsProps {
    projectId: string;
    projectName: string;
    /** ADMIN-only actions surface here; caller decides isAdmin before rendering. */
    isArchived: boolean;
    /** Where to send the user after a successful archive/delete (list view). */
    redirectAfterArchiveOrDeleteTo?: string;
}

const ACTION_CONFIG: Record<
    LifecycleAction,
    {
        endpoint: (id: string) => string;
        method: "POST" | "DELETE";
        icon: React.ComponentType<{ className?: string }>;
        label: string;
        confirmTitle: string;
        confirmDescription: (name: string) => string;
        confirmLabel: string;
        successMessage: string;
        variant: "danger" | "secondary";
    }
> = {
    archive: {
        endpoint: (id) => `/api/projects/${id}/archive`,
        method: "POST",
        icon: Archive,
        label: "Archive",
        confirmTitle: "Archive project?",
        confirmDescription: (name) =>
            `"${name}" will be moved out of the active project list. It can be restored later from the archived view.`,
        confirmLabel: "Archive Project",
        successMessage: "Project archived successfully.",
        variant: "secondary",
    },
    restore: {
        endpoint: (id) => `/api/projects/${id}/restore`,
        method: "POST",
        icon: ArchiveRestore,
        label: "Restore",
        confirmTitle: "Restore project?",
        confirmDescription: (name) =>
            `"${name}" will be restored and become active in the Projects list again.`,
        confirmLabel: "Restore Project",
        successMessage: "Project restored successfully.",
        variant: "secondary",
    },
    delete: {
        endpoint: (id) => `/api/projects/${id}`,
        method: "DELETE",
        icon: Trash2,
        label: "Delete",
        confirmTitle: "Delete project?",
        confirmDescription: (name) =>
            `This will permanently remove "${name}" and cannot be undone. All related tasks and activity remain linked for historical records.`,
        confirmLabel: "Delete Project",
        successMessage: "Project deleted successfully.",
        variant: "danger",
    },
};

function LifecycleButton({
    action,
    projectId,
    projectName,
    redirectTo,
    compact = false,
}: {
    action: LifecycleAction;
    projectId: string;
    projectName: string;
    redirectTo?: string;
    compact?: boolean;
}) {
    const router = useRouter();
    const config = ACTION_CONFIG[action];
    const Icon = config.icon;

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleConfirm() {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(config.endpoint(projectId), {
                method: config.method,
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data?.error ??
                        `Unable to ${config.label.toLowerCase()} this project.`
                );
                return;
            }

            toast.success(config.successMessage);
            setOpen(false);

            if (redirectTo && (action === "archive" || action === "delete")) {
                router.push(redirectTo);
            }

            router.refresh();
        } catch (err) {
            console.error(`${config.label} project failed:`, err);
            setError(
                `Something went wrong while trying to ${config.label.toLowerCase()} the project.`
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        if (!nextOpen) setError(null);
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                {compact ? (
                    <button
                        type="button"
                        aria-label={`${config.label} project`}
                        title={config.label}
                        className={
                            config.variant === "danger"
                                ? "inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-red-50 hover:text-red-600"
                                : "inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                        }
                    >
                        <Icon className="h-3.5 w-3.5" />
                    </button>
                ) : (
                    <WorkspaceButton
                        type="button"
                        variant={config.variant === "danger" ? "danger" : "outline"}
                        size="sm"
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                    </WorkspaceButton>
                )}
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[var(--workspace-text)]">
                        {config.confirmTitle}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-[var(--workspace-text-muted)]">
                        {config.confirmDescription(projectName)}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-800">
                            Action failed
                        </p>
                        <p className="mt-1 text-xs leading-5 text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isSubmitting}
                        className="rounded-lg border-[var(--workspace-border)] bg-[var(--workspace-surface)] text-[var(--workspace-text)] hover:bg-[var(--workspace-background)]"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            handleConfirm();
                        }}
                        disabled={isSubmitting}
                        className={
                            config.variant === "danger"
                                ? "rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                : "rounded-lg bg-[var(--workspace-primary)] text-white hover:bg-[var(--workspace-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Working...
                            </>
                        ) : (
                            <>
                                <Icon className="h-4 w-4" />
                                {config.confirmLabel}
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/**
 * Renders Archive OR Restore (mutually exclusive based on isArchived) plus
 * Delete. Callers are responsible for only rendering this for admin users —
 * per spec section 19, the backend (requireAdmin) remains the real boundary.
 */
export default function ProjectLifecycleActions({
    projectId,
    projectName,
    isArchived,
    redirectAfterArchiveOrDeleteTo,
    compact = false,
}: ProjectLifecycleActionsProps & { compact?: boolean }) {
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {isArchived ? (
                <LifecycleButton
                    action="restore"
                    projectId={projectId}
                    projectName={projectName}
                    compact={compact}
                />
            ) : (
                <LifecycleButton
                    action="archive"
                    projectId={projectId}
                    projectName={projectName}
                    redirectTo={redirectAfterArchiveOrDeleteTo}
                    compact={compact}
                />
            )}

            <LifecycleButton
                action="delete"
                projectId={projectId}
                projectName={projectName}
                redirectTo={redirectAfterArchiveOrDeleteTo}
                compact={compact}
            />
        </div>
    );
}
