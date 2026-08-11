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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CompanyDeleteButtonProps {
    companyId: string;
    companyName: string;
}

interface RelationshipCounts {
    contacts?: number;
    leads?: number;
    deals?: number;
    notes?: number;
    activities?: number;
}

export default function CompanyDeleteButton({
    companyId,
    companyName,
}: CompanyDeleteButtonProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [relationshipCounts, setRelationshipCounts] =
        useState<RelationshipCounts | null>(null);

    async function handleDelete() {
        if (isDeleting) return;

        setIsDeleting(true);
        setError(null);
        setRelationshipCounts(null);

        try {
            const response = await fetch(
                `/api/crm/companies/${companyId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data?.error ||
                    "Unable to delete this company."
                );

                if (response.status === 409 && data?.counts) {
                    setRelationshipCounts(data.counts);
                }

                return;
            }

            toast.success("Company deleted successfully.");

            setOpen(false);

            router.refresh();
        } catch (error) {
            console.error(
                "Company deletion failed:",
                error
            );

            setError(
                "Something went wrong while deleting the company."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (!nextOpen) {
            setError(null);
            setRelationshipCounts(null);
        }
    }

    const hasRelationships =
        relationshipCounts &&
        Object.values(relationshipCounts).some(
            (count) => Number(count) > 0
        );

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Company
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-xl border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[var(--workspace-text)]">
                        Delete company?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-[var(--workspace-text-muted)]">
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-[var(--workspace-text)]">
                            {companyName}
                        </span>
                        ? This will permanently remove the company from your CRM.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <div>
                            <p className="text-sm font-medium text-red-800">
                                Unable to delete this company
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-700">
                                {error}
                            </p>
                        </div>

                        {hasRelationships && (
                            <div>
                                <p className="text-xs font-medium text-red-800">
                                    Related CRM records
                                </p>

                                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {Number(
                                        relationshipCounts?.contacts ?? 0
                                    ) > 0 && (
                                            <div className="rounded-lg border border-red-200 bg-white px-3 py-2">
                                                <p className="text-[11px] text-red-600">
                                                    Contacts
                                                </p>

                                                <p className="mt-0.5 text-sm font-semibold text-red-800">
                                                    {
                                                        relationshipCounts
                                                            ?.contacts
                                                    }
                                                </p>
                                            </div>
                                        )}

                                    {Number(
                                        relationshipCounts?.leads ?? 0
                                    ) > 0 && (
                                            <div className="rounded-lg border border-red-200 bg-white px-3 py-2">
                                                <p className="text-[11px] text-red-600">
                                                    Leads
                                                </p>

                                                <p className="mt-0.5 text-sm font-semibold text-red-800">
                                                    {
                                                        relationshipCounts
                                                            ?.leads
                                                    }
                                                </p>
                                            </div>
                                        )}

                                    {Number(
                                        relationshipCounts?.deals ?? 0
                                    ) > 0 && (
                                            <div className="rounded-lg border border-red-200 bg-white px-3 py-2">
                                                <p className="text-[11px] text-red-600">
                                                    Deals
                                                </p>

                                                <p className="mt-0.5 text-sm font-semibold text-red-800">
                                                    {
                                                        relationshipCounts
                                                            ?.deals
                                                    }
                                                </p>
                                            </div>
                                        )}

                                    {Number(
                                        relationshipCounts?.notes ?? 0
                                    ) > 0 && (
                                            <div className="rounded-lg border border-red-200 bg-white px-3 py-2">
                                                <p className="text-[11px] text-red-600">
                                                    Notes
                                                </p>

                                                <p className="mt-0.5 text-sm font-semibold text-red-800">
                                                    {
                                                        relationshipCounts
                                                            ?.notes
                                                    }
                                                </p>
                                            </div>
                                        )}

                                    {Number(
                                        relationshipCounts?.activities ?? 0
                                    ) > 0 && (
                                            <div className="rounded-lg border border-red-200 bg-white px-3 py-2">
                                                <p className="text-[11px] text-red-600">
                                                    Activities
                                                </p>

                                                <p className="mt-0.5 text-sm font-semibold text-red-800">
                                                    {
                                                        relationshipCounts
                                                            ?.activities
                                                    }
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}

                        {hasRelationships && (
                            <p className="text-xs leading-5 text-red-700">
                                Remove or reassign these related
                                records before deleting the company.
                            </p>
                        )}
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
                            handleDelete();
                        }}
                        disabled={isDeleting || !!hasRelationships}
                        className="rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete Company
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}