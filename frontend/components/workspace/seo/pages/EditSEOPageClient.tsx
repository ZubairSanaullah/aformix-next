"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

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

import SEOPageForm from "@/components/workspace/seo/forms/SEOPageForm";
import type { SEOPageInput } from "@/lib/validations/seo";

interface EditSEOPageClientProps {
    pageId: string;
    defaultValues: Partial<SEOPageInput>;
}

export default function EditSEOPageClient({
    pageId,
    defaultValues,
}: EditSEOPageClientProps) {
    const router = useRouter();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    async function handleSubmit(values: SEOPageInput) {
        try {
            const response = await fetch(`/api/seo/pages/${pageId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("You need to sign in again to do that.");
                    return;
                }

                if (response.status === 404) {
                    toast.error("This SEO page no longer exists.");
                    router.push("/workspace/seo/pages");
                    return;
                }

                if (response.status === 409) {
                    toast.error(
                        data?.error ??
                            "An SEO configuration already exists for this path."
                    );
                    return;
                }

                toast.error(data?.error ?? "Unable to update this SEO page.");
                return;
            }

            toast.success("SEO page updated successfully.");

            router.push("/workspace/seo/pages");
            router.refresh();
        } catch (error) {
            console.error("SEO page update failed:", error);
            toast.error("Something went wrong while updating this SEO page.");
        }
    }

    async function handleConfirmDelete() {
        if (isDeleting) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(`/api/seo/pages/${pageId}`, {
                method: "DELETE",
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setDeleteError(
                    data?.error ?? "Unable to delete this SEO page."
                );
                return;
            }

            toast.success("SEO page deleted successfully.");

            setConfirmOpen(false);

            router.push("/workspace/seo/pages");
            router.refresh();
        } catch (error) {
            console.error("SEO page deletion failed:", error);
            setDeleteError(
                "Something went wrong while deleting this SEO page."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    function handleOpenChange(nextOpen: boolean) {
        setConfirmOpen(nextOpen);

        if (!nextOpen) {
            setDeleteError(null);
        }
    }

    return (
        <>
            <SEOPageForm
                mode="edit"
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                onDelete={() => setConfirmOpen(true)}
                isDeleting={isDeleting}
                pageId={pageId}
            />

            <AlertDialog open={confirmOpen} onOpenChange={handleOpenChange}>
                <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[var(--workspace-text)]">
                            Delete SEO page?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-[var(--workspace-text-muted)]">
                            This will permanently remove this page&apos;s
                            SEO configuration. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {deleteError && (
                        <div className="rounded-xl border border-[var(--workspace-danger)]/30 bg-[var(--workspace-danger)]/5 p-4">
                            <p className="text-sm font-medium text-[var(--workspace-danger)]">
                                Unable to delete this SEO page
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[var(--workspace-text-muted)]">
                                {deleteError}
                            </p>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isDeleting}
                            className="rounded-lg border-[var(--workspace-border)] bg-[var(--workspace-surface)] text-[var(--workspace-text)] hover:bg-[var(--workspace-background)]"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                handleConfirmDelete();
                            }}
                            disabled={isDeleting}
                            className="rounded-lg bg-[var(--workspace-danger)] text-white transition-opacity hover:opacity-90 focus:ring-[var(--workspace-danger)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Page
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
