"use client";

import { useCallback, useEffect, useState } from "react";
import {
    History,
    Clock3,
    User,
    RefreshCw,
    GitCompare,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import Divider from "@/components/ui/Divider";
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

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [compareMode, setCompareMode] = useState(false);

    const [selectedRevisions, setSelectedRevisions] =
        useState<string[]>([]);

    const [diffOpen, setDiffOpen] = useState(false);

    const [leftRevision, setLeftRevision] = useState<any>(null);
    const [rightRevision, setRightRevision] = useState<any>(null);

    const [loadingComparison, setLoadingComparison] =
        useState(false);

    const fetchRevisions = useCallback(async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `/api/posts/${postId}/revisions`,
                {
                    cache: "no-store",
                }
            );

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

            const leftData = await leftResponse.json();
            const rightData = await rightResponse.json();

            setLeftRevision(leftData.revision);
            setRightRevision(rightData.revision);

            setDiffOpen(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingComparison(false);
        }
    }

    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-[var(--workspace-border)]
                bg-[var(--workspace-surface)]
            "
        >
            {/* Header */}
            <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-[var(--workspace-border)]
                                bg-[var(--workspace-primary-soft)]
                                text-[var(--workspace-primary)]
                            "
                        >
                            <History className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-[var(--workspace-text)]
                                "
                            >
                                Revision History
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    leading-5
                                    text-[var(--workspace-text-muted)]
                                "
                            >
                                Review previous versions of this
                                post or compare two revisions.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={fetchRevisions}
                        disabled={loading}
                        className="
                            h-8
                            w-8
                            shrink-0
                            rounded-lg
                            p-0
                            text-[var(--workspace-text-muted)]
                            hover:bg-[var(--workspace-primary-soft)]
                            hover:text-[var(--workspace-primary)]
                        "
                        aria-label="Refresh revision history"
                        title="Refresh"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${loading
                                    ? "animate-spin"
                                    : ""
                                }`}
                        />
                    </Button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <div
                        className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.08em]
                            text-[var(--workspace-text-subtle)]
                        "
                    >
                        {revisions.length}{" "}
                        {revisions.length === 1
                            ? "revision"
                            : "revisions"}
                    </div>

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
                        className="
                            h-8
                            rounded-lg
                            text-[11px]
                        "
                    >
                        <GitCompare className="mr-1.5 h-3.5 w-3.5" />
                        {compareMode
                            ? "Cancel Compare"
                            : "Compare"}
                    </Button>
                </div>
            </div>

            <Divider />

            {/* Content */}
            <div className="p-5">
                {loading && (
                    <div className="space-y-3">
                        <Skeleton className="h-24 rounded-xl" />
                        <Skeleton className="h-24 rounded-xl" />
                        <Skeleton className="h-24 rounded-xl" />
                    </div>
                )}

                {!loading && error && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-[var(--workspace-border)]
                            bg-[var(--workspace-surface-elevated)]
                            px-4
                            py-6
                            text-center
                        "
                    >
                        <p
                            className="
                                text-xs
                                font-medium
                                text-[var(--workspace-text)]
                            "
                        >
                            Unable to load revisions
                        </p>

                        <p
                            className="
                                mt-1
                                text-[11px]
                                text-[var(--workspace-text-muted)]
                            "
                        >
                            {error}
                        </p>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={fetchRevisions}
                            className="mt-4 h-8 rounded-lg text-[11px]"
                        >
                            Try again
                        </Button>
                    </div>
                )}

                {!loading &&
                    !error &&
                    revisions.length === 0 && (
                        <div
                            className="
                                rounded-xl
                                border
                                border-dashed
                                border-[var(--workspace-border)]
                                bg-[var(--workspace-surface-elevated)]
                                px-5
                                py-8
                                text-center
                            "
                        >
                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[var(--workspace-primary-soft)]
                                    text-[var(--workspace-primary)]
                                "
                            >
                                <History className="h-4 w-4" />
                            </div>

                            <p
                                className="
                                    mt-3
                                    text-xs
                                    font-semibold
                                    text-[var(--workspace-text)]
                                "
                            >
                                No revisions yet
                            </p>

                            <p
                                className="
                                    mx-auto
                                    mt-1
                                    max-w-[260px]
                                    text-[11px]
                                    leading-5
                                    text-[var(--workspace-text-muted)]
                                "
                            >
                                Every time you update this post,
                                a snapshot will appear here.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    revisions.length > 0 && (
                        <div className="space-y-3">
                            {revisions.map((revision) => {
                                const isSelected =
                                    selectedRevisions.includes(
                                        revision.id
                                    );

                                return (
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
                                            group
                                            w-full
                                            rounded-xl
                                            border
                                            p-4
                                            text-left
                                            transition-all
                                            ${isSelected
                                                ? `
                                                        border-[var(--workspace-primary)]
                                                        bg-[var(--workspace-primary-soft)]
                                                      `
                                                : `
                                                        border-[var(--workspace-border)]
                                                        bg-[var(--workspace-surface-elevated)]
                                                      `
                                            }
                                            hover:border-[var(--workspace-primary)]/30
                                            hover:bg-[var(--workspace-primary-soft)]/40
                                        `}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h4
                                                    className="
                                                        truncate
                                                        text-xs
                                                        font-semibold
                                                        text-[var(--workspace-text)]
                                                    "
                                                >
                                                    {revision.title}
                                                </h4>

                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-[10px]
                                                        text-[var(--workspace-text-subtle)]
                                                    "
                                                >
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

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-x-4
                                                gap-y-2
                                                text-[10px]
                                                text-[var(--workspace-text-muted)]
                                            "
                                        >
                                            <span className="inline-flex items-center gap-1.5">
                                                <User className="h-3 w-3" />

                                                {revision.author?.name ??
                                                    revision.author
                                                        ?.email ??
                                                    "Unknown"}
                                            </span>

                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock3 className="h-3 w-3" />

                                                {revision.readingTime}{" "}
                                                min read
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                mt-3
                                                border-t
                                                border-[var(--workspace-border)]
                                                pt-3
                                                text-[10px]
                                                text-[var(--workspace-text-subtle)]
                                            "
                                        >
                                            {new Date(
                                                revision.createdAt
                                            ).toLocaleString()}
                                        </div>

                                        {compareMode && (
                                            <div
                                                className={`
                                                    mt-3
                                                    text-[10px]
                                                    font-medium
                                                    ${isSelected
                                                        ? "text-[var(--workspace-primary)]"
                                                        : "text-[var(--workspace-text-subtle)]"
                                                    }
                                                `}
                                            >
                                                {isSelected
                                                    ? "Selected for comparison"
                                                    : "Click to select"}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                {/* Compare Action */}
                {compareMode && (
                    <div
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-[var(--workspace-border)]
                            bg-[var(--workspace-surface-elevated)]
                            p-3
                        "
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p
                                    className="
                                        text-[11px]
                                        font-medium
                                        text-[var(--workspace-text)]
                                    "
                                >
                                    {selectedRevisions.length}/2
                                    revisions selected
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-[10px]
                                        text-[var(--workspace-text-subtle)]
                                    "
                                >
                                    Select two revisions to compare.
                                </p>
                            </div>

                            <Button
                                type="button"
                                size="sm"
                                disabled={
                                    selectedRevisions.length !==
                                    2 ||
                                    loadingComparison
                                }
                                onClick={
                                    compareSelectedRevisions
                                }
                                className="h-8 rounded-lg text-[11px]"
                            >
                                {loadingComparison
                                    ? "Loading..."
                                    : "Compare Selected"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

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
        </section>
    );
}