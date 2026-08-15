"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Archive } from "lucide-react";
import { toast } from "sonner";

import { archivePortfolioProjectRequest } from "@/lib/api/portfolio";

interface ArchivePortfolioProjectButtonProps {
    projectId: string;
}

export default function ArchivePortfolioProjectButton({
    projectId,
}: ArchivePortfolioProjectButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function handleArchive() {
        try {
            await archivePortfolioProjectRequest(projectId);
            toast.success("Project archived.");

            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to archive the project.");
        }
    }

    return (
        <button
            type="button"
            onClick={handleArchive}
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
            title="Archive project"
            aria-label="Archive project"
        >
            <Archive className="h-4 w-4" />
        </button>
    );
}