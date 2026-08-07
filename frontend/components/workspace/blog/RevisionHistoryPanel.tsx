"use client";

import { useCallback, useEffect, useState } from "react";
import {
    History,
    Clock3,
    User,
    RefreshCw,
} from "lucide-react";


import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Divider from "@/components/ui/Divider";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button";
import RevisionPreviewDrawer from "@/components/workspace/blog/revisions/RevisionPreviewDrawer";
import RevisionDiffDrawer from "./revisions/RevisionDiffDrawer";
import type { Revision } from "@/components/workspace/blog/revisions/types";


interface RevisionHistoryPanelProps {
    postId: string;

}

export default function RevisionHistoryPanel({
    postId,
}: RevisionHistoryPanelProps) {
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRevisionId, setSelectedRevisionId] =
        useState<string | null>(null);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [compareMode, setCompareMode] =
        useState(false);

    const [selectedRevisions, setSelectedRevisions] =
        useState<string[]>([]);

    const [diffOpen, setDiffOpen] =
        useState(false);

    const [leftRevision, setLeftRevision] =
        useState<any>(null);

    const [rightRevision, setRightRevision] =
        useState<any>(null);

    const [loadingComparison, setLoadingComparison] =
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

    function toggleRevisionSelection(id: string) {

        setSelectedRevisions((previous) => {

            if (previous.includes(id)) {
                return previous.filter(
                    (revisionId) => revisionId !== id
                );
            }

            if (previous.length >= 2) {
                return previous;
            }

            return [...previous, id];
        });

    }

    async function compareSelectedRevisions() {

        if (selectedRevisions.length !== 2) return;

        try {

            setLoadingComparison(true);

            const [leftResponse, rightResponse] =
                await Promise.all([

                    fetch(
                        `/api/posts/${postId}/revisions/${selectedRevisions[0]}`,
                        {
                            cache: "no-store",
                        }
                    ),

                    fetch(
                        `/api/posts/${postId}/revisions/${selectedRevisions[1]}`,
                        {
                            cache: "no-store",
                        }
                    ),

                ]);

            if (!leftResponse.ok || !rightResponse.ok) {
                throw new Error(
                    "Failed to load revisions."
                );
            }

            const leftData =
                await leftResponse.json();

            const rightData =
                await rightResponse.json();

            setLeftRevision(
                leftData.revision
            );

            setRightRevision(
                rightData.revision
            );

            setDiffOpen(true);

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingComparison(false);

        }

    }

    return (
        <GlassCard className="flex h-full flex-col p-6">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">

                    <Button
                        type="button"
                        size="sm"
                        variant={
                            compareMode
                                ? "default"
                                : "outline"
                        }
                        onClick={() => {

                            setCompareMode(!compareMode);

                            setSelectedRevisions([]);

                        }}
                    >
                        Compare
                    </Button>


                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={fetchRevisions}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>

                </div>
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

                                if (compareMode) {

                                    toggleRevisionSelection(
                                        revision.id
                                    );

                                    return;
                                }

                                setSelectedRevisionId(
                                    revision.id
                                );

                                setDrawerOpen(true);

                            }}
                            className={`
                                w-full
                                rounded-2xl
                                border
                                p-4
                                text-left
                                transition-all
                                ${selectedRevisions.includes(revision.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-[var(--color-glass-border)] bg-[var(--color-surface)]"
                                }
                                hover:border-[var(--color-primary)]/30
                                hover:bg-[var(--color-surface-elevated)]
                            `}
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
            {compareMode && (

                <div className="mt-6">

                    <Button
                        className="w-full"
                        disabled={
                            selectedRevisions.length !== 2 ||
                            loadingComparison
                        }
                        onClick={compareSelectedRevisions}
                    >
                        {
                            loadingComparison
                                ? "Loading..."
                                : "Compare Selected"
                        }
                    </Button>

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

            <RevisionDiffDrawer
                open={diffOpen}
                onOpenChange={setDiffOpen}
                leftRevision={leftRevision}
                rightRevision={rightRevision}
            />

        </GlassCard>
    );
}