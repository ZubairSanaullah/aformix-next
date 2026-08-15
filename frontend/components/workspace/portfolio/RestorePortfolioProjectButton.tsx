"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { restorePortfolioProjectRequest } from "@/lib/api/portfolio";

interface RestorePortfolioProjectButtonProps {
    projectId: string;
}

export default function RestorePortfolioProjectButton({
    projectId,
}: RestorePortfolioProjectButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function handleRestore() {
        try {
            await restorePortfolioProjectRequest(projectId);
            toast.success("Project restored.");

            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to restore the project.");
        }
    }

    return (
        <button
            type="button"
            onClick={handleRestore}
            disabled={isPending}
            className="
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--workspace-border)]
                text-[var(--workspace-text-muted)]
                transition-colors
                hover:border-[var(--workspace-primary)]/30
                hover:bg-[var(--workspace-primary-soft)]
                hover:text-[var(--workspace-primary)]
                disabled:cursor-not-allowed
                disabled:opacity-60
            "
            title="Restore project"
            aria-label="Restore project"
        >
            <RotateCcw className="h-4 w-4" />
        </button>
    );
}