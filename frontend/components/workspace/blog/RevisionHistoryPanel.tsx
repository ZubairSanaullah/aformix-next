"use client";

import { useCallback, useEffect, useState } from "react";
import {
    History,
    Clock3,
    User,
    RefreshCw,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Divider from "@/components/ui/Divider";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button";
import RevisionPreviewDrawer from "@/components/workspace/blog/RevisionPreviewDrawer";
import RevisionPreviewDialog from "@/components/workspace/blog/RevisionPreviewDialog";


type Revision = {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    readingTime: number;
    createdAt: string;

    author: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    };
};

interface RevisionHistoryPanelProps {
    postId: string;

}

export default function RevisionHistoryPanel({
    postId,
}: RevisionHistoryPanelProps) {
    const router = useRouter();
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRevision, setSelectedRevision] =
        useState<Revision | null>(null);

    const [previewOpen, setPreviewOpen] =
        useState(false);
    const [selectedRevisionId, setSelectedRevisionId] =
        useState<string | null>(null);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const fetchRevisions = useCallback(async () => {
        try {
            setLoading(true);

            const res = await fetch(`/api/posts/${postId}/revisions`, {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch revisions");
            }

            const data = await res.json();

            setRevisions(data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load revision history.");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchRevisions();
    }, [fetchRevisions]);

    const getStatusVariant = (
        status: Revision["status"]
    ): "success" | "warning" | "default" => {
        switch (status) {
            case "PUBLISHED":
                return "success";

            case "ARCHIVED":
                return "warning";

            default:
                return "default";
        }
    };
    const handleRestore = async (
        revision: Revision
    ) => {
        try {
            const response = await fetch(
                `/api/posts/${postId}/revisions/${revision.id}/restore`,
                {
                    method: "PATCH",
                }
            );


            const result = await response.json();


            if (!response.ok) {
                toast.error(
                    result.message ||
                    "Failed to restore revision."
                );

                return;
            }


            toast.success(
                "Revision restored successfully!"
            );


            setPreviewOpen(false);

            setSelectedRevision(null);


            router.refresh();

        } catch (error) {

            console.error(error);

            toast.error(
                "Something went wrong."
            );
        }
    };

    return (
        <GlassCard className="flex h-full flex-col p-6">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-[var(--color-primary)]" />

                    <h2 className="text-lg font-semibold">
                        Revision History
                    </h2>
                </div>

                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={fetchRevisions}
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <Divider />

            {loading && (
                <div className="mt-6 space-y-4">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                </div>
            )}

            {!loading && error && (
                <EmptyState
                    title="Unable to load revisions"
                    description={error}
                />
            )}

            {!loading && !error && revisions.length === 0 && (
                <EmptyState
                    title="No revisions yet"
                    description="Every time you update this post, a snapshot will appear here."
                />
            )}

            {!loading && !error && revisions.length > 0 && (
                <div className="mt-5 space-y-4 overflow-y-auto">
                    {revisions.map((revision) => (
                        <button
                            key={revision.id}
                            type="button"
                            onClick={() => {
                                setSelectedRevisionId(revision.id);
                                setDrawerOpen(true);
                            }}
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-[var(--color-glass-border)]
                                bg-[var(--color-surface)]
                                p-4
                                text-left
                                transition-all
                                hover:border-[var(--color-primary)]/30
                                hover:bg-[var(--color-surface-elevated)]
                            "
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="truncate font-semibold">
                                        {revision.title}
                                    </h3>

                                    <p className="mt-1 truncate text-sm text-[var(--color-text-muted)]">
                                        {revision.slug}
                                    </p>
                                </div>

                                <Badge
                                    variant={getStatusVariant(
                                        revision.status
                                    )}
                                >
                                    {revision.status}
                                </Badge>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--color-text-muted)]">
                                <div className="flex items-center gap-1">
                                    <User className="h-3.5 w-3.5" />

                                    {revision.author?.name ??
                                        revision.author?.email ??
                                        "Unknown"}
                                </div>

                                <div className="flex items-center gap-1">
                                    <Clock3 className="h-3.5 w-3.5" />

                                    {revision.readingTime} min read
                                </div>
                            </div>

                            <div className="mt-3 text-xs text-[var(--color-text-muted)]">
                                {new Date(
                                    revision.createdAt
                                ).toLocaleString()}
                            </div>
                        </button>
                    ))}
                </div>
            )}
            <RevisionPreviewDrawer
                postId={postId}
                revisionId={selectedRevisionId}
                open={drawerOpen}
                onOpenChange={(open) => {
                    setDrawerOpen(open);

                    if (!open) {
                        setSelectedRevisionId(null);
                        fetchRevisions();
                    }
                }}
            />
            <RevisionPreviewDialog
                revision={selectedRevision}
                open={previewOpen}
                onClose={() =>
                    setPreviewOpen(false)
                }
                onRestore={handleRestore}
            />
        </GlassCard>
    );
}