"use client";

import { useState } from "react";
import {
    Archive,
    CheckCircle2,
    FileEdit,
    Send,
} from "lucide-react";
import { toast } from "sonner";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceBadge from "@/components/workspace/ui/WorkspaceBadge";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

interface PublishingPanelProps {
    postId: string;

    status:
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";
}

export default function PublishingPanel({
    postId,
    status,
}: PublishingPanelProps) {
    const [currentStatus, setCurrentStatus] =
        useState(status);

    const [loading, setLoading] =
        useState(false);

    async function updateStatus(
        newStatus:
            | "DRAFT"
            | "PUBLISHED"
            | "ARCHIVED"
    ) {
        try {
            setLoading(true);

            const response = await fetch(
                `/api/posts/${postId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update status."
                );
            }

            setCurrentStatus(newStatus);

            toast.success(
                "Publishing status updated."
            );
        } catch (error) {
            console.error(error);

            toast.error(
                "Failed to update publishing status."
            );
        } finally {
            setLoading(false);
        }
    }

    const statusVariant =
        currentStatus === "PUBLISHED"
            ? "success"
            : currentStatus === "DRAFT"
                ? "warning"
                : "default";

    return (
        <WorkspaceCard
            padding="md"
            className="space-y-5"
        >
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Publishing
                    </h2>

                    <p className="mt-1 text-[10px] text-[var(--workspace-text-muted)]">
                        Manage post visibility.
                    </p>
                </div>

                <WorkspaceBadge
                    variant={statusVariant}
                >
                    {currentStatus ===
                        "PUBLISHED"
                        ? "Published"
                        : currentStatus ===
                            "DRAFT"
                            ? "Draft"
                            : "Archived"}
                </WorkspaceBadge>
            </div>

            <div className="space-y-2">
                <WorkspaceButton
                    className="w-full"
                    size="sm"
                    disabled={loading}
                    onClick={() =>
                        updateStatus(
                            "PUBLISHED"
                        )
                    }
                >
                    <Send className="h-3.5 w-3.5" />
                    Publish
                </WorkspaceButton>

                <WorkspaceButton
                    variant="outline"
                    className="w-full"
                    size="sm"
                    disabled={loading}
                    onClick={() =>
                        updateStatus(
                            "DRAFT"
                        )
                    }
                >
                    <FileEdit className="h-3.5 w-3.5" />
                    Move to Draft
                </WorkspaceButton>

                <WorkspaceButton
                    variant="outline"
                    className="w-full"
                    size="sm"
                    disabled={loading}
                    onClick={() =>
                        updateStatus(
                            "ARCHIVED"
                        )
                    }
                >
                    <Archive className="h-3.5 w-3.5" />
                    Archive
                </WorkspaceButton>
            </div>

            <div className="flex items-center gap-2 border-t border-[var(--workspace-border)] pt-4 text-[10px] text-[var(--workspace-text-subtle)]">
                <CheckCircle2 className="h-3.5 w-3.5" />

                <span>
                    Changes are saved to the post
                    immediately.
                </span>
            </div>
        </WorkspaceCard>
    );
}