"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Archive } from "lucide-react";
import { toast } from "sonner";

import { archivePortfolioCategoryRequest } from "@/lib/api/portfolio";

interface ArchivePortfolioCategoryButtonProps {
    categoryId: string;
}

export default function ArchivePortfolioCategoryButton({
    categoryId,
}: ArchivePortfolioCategoryButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function handleArchive() {
        try {
            await archivePortfolioCategoryRequest(categoryId);
            toast.success("Category archived.");

            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to archive the category.",
            );
        }
    }

    return (
        <button
            type="button"
            onClick={handleArchive}
            disabled={isPending}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--workspace-border)] text-[var(--workspace-text-muted)] transition-colors hover:border-[var(--workspace-primary)]/30 hover:bg-[var(--workspace-primary-soft)] hover:text-[var(--workspace-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            title="Archive category"
            aria-label="Archive category"
        >
            <Archive className="h-4 w-4" />
        </button>
    );
}