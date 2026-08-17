"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import { restorePortfolioProjectRequest } from "@/lib/api/portfolio";

interface PortfolioTrashedNoticeProps {
    projectId: string;
    projectTitle: string;
}

/**
 * Editing a trashed (deletedAt set) project doesn't make sense — the
 * record isn't meant to be actively worked on. Rather than silently
 * allowing edits to a trashed row, the edit page shows this instead of
 * the form and requires restoring first.
 */
export default function PortfolioTrashedNotice({
    projectId,
    projectTitle,
}: PortfolioTrashedNoticeProps) {
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
        <WorkspaceCard padding="lg">
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <Trash2 className="h-6 w-6" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-[var(--workspace-text)]">
                        &ldquo;{projectTitle}&rdquo; is in the trash
                    </p>
                    <p className="mt-1 max-w-sm text-sm text-[var(--workspace-text-muted)]">
                        Restore this project before editing it.
                    </p>
                </div>

                <WorkspaceButton
                    variant="primary"
                    size="md"
                    onClick={handleRestore}
                    disabled={isPending}
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restore Project
                </WorkspaceButton>
            </div>
        </WorkspaceCard>
    );
}
