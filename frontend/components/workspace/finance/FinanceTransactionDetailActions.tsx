"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FinanceTransactionDetailActionsProps {
    transactionId: string;
    transactionStatus: string;
}

export default function FinanceTransactionDetailActions({
    transactionId,
    transactionStatus,
}: FinanceTransactionDetailActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleArchive = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `/api/finance/transactions/${transactionId}/archive`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to archive transaction");
            }

            toast.success("Transaction archived successfully");
            router.push("/workspace/finance/transactions");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `/api/finance/transactions/${transactionId}/restore`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to restore transaction");
            }

            toast.success("Transaction restored successfully");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `/api/finance/transactions/${transactionId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Failed to delete transaction"
                );
            }

            toast.success("Transaction deleted successfully");
            router.push("/workspace/finance/transactions");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred"
            );
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={handleArchive}
                disabled={loading}
                className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-[var(--workspace-border)]
          bg-[var(--workspace-background)]
          px-3
          py-2
          text-sm
          font-medium
          text-[var(--workspace-text)]
          transition-colors
          hover:bg-[var(--workspace-card-background)]
          disabled:opacity-50
          disabled:cursor-not-allowed
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--workspace-primary)]
        "
            >
                <Archive className="h-4 w-4" />
                Archive
            </button>

            <button
                onClick={handleRestore}
                disabled={loading}
                className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-[var(--workspace-border)]
          bg-[var(--workspace-background)]
          px-3
          py-2
          text-sm
          font-medium
          text-[var(--workspace-text)]
          transition-colors
          hover:bg-[var(--workspace-card-background)]
          disabled:opacity-50
          disabled:cursor-not-allowed
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--workspace-primary)]
        "
            >
                <RotateCcw className="h-4 w-4" />
                Restore
            </button>

            {!showDeleteConfirm ? (
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading}
                    className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-red-200 dark:border-red-800
            bg-red-50 dark:bg-red-950
            px-3
            py-2
            text-sm
            font-medium
            text-red-600 dark:text-red-400
            transition-colors
            hover:bg-red-100 dark:hover:bg-red-900
            disabled:opacity-50
            disabled:cursor-not-allowed
            focus:outline-none
            focus:ring-2
            focus:ring-red-500
          "
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </button>
            ) : (
                <div className="flex gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-red-300 dark:border-red-700
              bg-red-100 dark:bg-red-900
              px-3
              py-2
              text-sm
              font-medium
              text-red-700 dark:text-red-300
              transition-colors
              hover:bg-red-200 dark:hover:bg-red-800
              disabled:opacity-50
              disabled:cursor-not-allowed
              focus:outline-none
              focus:ring-2
              focus:ring-red-500
            "
                    >
                        {loading ? "Deleting..." : "Confirm Delete"}
                    </button>

                    <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={loading}
                        className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              font-medium
              text-[var(--workspace-text)]
              transition-colors
              hover:bg-[var(--workspace-card-background)]
              disabled:opacity-50
              disabled:cursor-not-allowed
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
