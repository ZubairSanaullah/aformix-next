"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Archive, ArrowLeft, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import {
    archivePortfolioProjectRequest,
    restorePortfolioProjectRequest,
    type PortfolioProjectStatus,
} from "@/lib/api/portfolio";

interface PortfolioEditHeaderActionsProps {
    projectId: string;
    status: PortfolioProjectStatus;
}

export default function PortfolioEditHeaderActions({
    projectId,
    status,
}: PortfolioEditHeaderActionsProps) {
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
        <div className="flex flex-wrap items-center gap-2">
            <Link href="/workspace/portfolio">
                <WorkspaceButton variant="secondary" size="md">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Portfolio
                </WorkspaceButton>
            </Link>

            <Link href={`/workspace/portfolio/${projectId}/preview`}>
                <WorkspaceButton variant="secondary" size="md">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                </WorkspaceButton>
            </Link>

            {status === "ARCHIVED" ? (
                <WorkspaceButton
                    variant="secondary"
                    size="md"
                    onClick={handleRestore}
                    disabled={isPending}
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restore
                </WorkspaceButton>
            ) : (
                <WorkspaceButton
                    variant="secondary"
                    size="md"
                    onClick={handleArchive}
                    disabled={isPending}
                >
                    <Archive className="h-3.5 w-3.5" />
                    Archive
                </WorkspaceButton>
            )}
        </div>
    );
}
