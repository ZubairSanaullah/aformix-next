"use client";

import {
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    CheckSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useCallback, useEffect, useState } from "react";
import MediaGrid from "@/components/workspace/media/MediaGrid";
import type { MediaItem } from "@/components/workspace/media/MediaCard";
import { UploadDropzone } from "@/components/workspace/media/UploadDropzone";
import MediaDetailsDrawer from "@/components/workspace/media/MediaDetailsDrawer";
import FolderSidebar, {
    type FolderItem,
} from "@/components/workspace/media/FolderSidebar";
import { toast } from "sonner";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspacePageActions from "@/components/workspace/ui/WorkspacePageActions";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceSearch from "@/components/workspace/ui/WorkspaceSearch";

type Tab = "active" | "trash";

type MediaFilter =
    | "ALL"
    | "IMAGE"
    | "VIDEO"
    | "AUDIO"
    | "DOCUMENT"
    | "OTHER";

interface MediaPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface MediaResponse {
    media: MediaItem[];
    pagination: MediaPagination;
}

const PAGE_SIZE = 24;

const MEDIA_FILTERS: {
    value: MediaFilter;
    label: string;
}[] = [
        {
            value: "ALL",
            label: "All",
        },
        {
            value: "IMAGE",
            label: "Images",
        },
        {
            value: "VIDEO",
            label: "Videos",
        },
        {
            value: "AUDIO",
            label: "Audio",
        },
        {
            value: "DOCUMENT",
            label: "Documents",
        },
        {
            value: "OTHER",
            label: "Other",
        },
    ];

interface MediaLibraryPageProps {
    onSelect?: (media: MediaItem) => void;
}

export default function MediaLibraryPage({
    onSelect,
}: MediaLibraryPageProps) {

    const [selectedMedia, setSelectedMedia] =
        useState<MediaItem | null>(null);

    const [detailsOpen, setDetailsOpen] =
        useState(false);

    const [tab, setTab] =
        useState<Tab>("active");

    const [media, setMedia] =
        useState<MediaItem[]>([]);

    const [pagination, setPagination] =
        useState<MediaPagination | null>(
            null
        );

    const [page, setPage] =
        useState(1);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [pendingIds, setPendingIds] =
        useState<Set<string>>(
            new Set()
        );

    const [confirmId, setConfirmId] =
        useState<string | null>(null);

    const [searchInput, setSearchInput] =
        useState("");

    const [mediaFilter, setMediaFilter] =
        useState<MediaFilter>("ALL");

    /*
     * Folder navigation. null = "All Media".
     */
    const [selectedFolderId, setSelectedFolderId] =
        useState<string | null>(null);

    const [folderRefreshSignal, setFolderRefreshSignal] =
        useState(0);

    const bumpFolderRefresh = useCallback(() => {
        setFolderRefreshSignal((v) => v + 1);
    }, []);

    /*
     * Bulk multi-select mode.
     */
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkSelectedIds, setBulkSelectedIds] =
        useState<Set<string>>(new Set());
    const [bulkMoveTargetId, setBulkMoveTargetId] =
        useState("");
    const [bulkFolders, setBulkFolders] =
        useState<FolderItem[]>([]);
    const [isBulkMoving, setIsBulkMoving] =
        useState(false);

    const debouncedSearch =
        useDebouncedValue(
            searchInput,
            350
        );

    const fetchMedia = useCallback(
        async (
            activeTab: Tab,
            query: string,
            requestedPage: number,
            selectedType: MediaFilter,
            folderId: string | null
        ) => {
            setIsLoading(true);
            setError(null);

            try {
                const params =
                    new URLSearchParams();

                if (
                    activeTab ===
                    "trash"
                ) {
                    params.set(
                        "status",
                        "trash"
                    );
                }

                if (selectedType !== "ALL") {
                    params.set(
                        "type",
                        selectedType
                    );
                }

                if (folderId) {
                    params.set("folderId", folderId);
                }

                if (query.trim()) {
                    params.set(
                        "q",
                        query.trim()
                    );
                }


                params.set(
                    "page",
                    String(
                        requestedPage
                    )
                );

                params.set(
                    "limit",
                    String(
                        PAGE_SIZE
                    )
                );

                const res =
                    await fetch(
                        `/api/media?${params.toString()}`
                    );

                if (!res.ok) {
                    throw new Error(
                        `Failed to load media (${res.status})`
                    );
                }

                const data: MediaResponse =
                    await res.json();

                setMedia(data.media);
                setPagination(
                    data.pagination
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load media"
                );
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /*
     * Reset pagination whenever
     * tab, search, filter, or folder changes.
     */
    useEffect(() => {
        setPage(1);
    }, [
        tab,
        debouncedSearch,
        mediaFilter,
        selectedFolderId,
    ]);

    /*
     * Fetch whenever the current
     * view parameters change.
     */
    useEffect(() => {
        fetchMedia(
            tab,
            debouncedSearch,
            page,
            mediaFilter,
            selectedFolderId
        );
    }, [
        tab,
        debouncedSearch,
        page,
        mediaFilter,
        selectedFolderId,
        fetchMedia,
    ]);

    /*
     * Close confirmation and bulk mode when switching tabs.
     */
    useEffect(() => {
        setConfirmId(null);
        setBulkMode(false);
        setBulkSelectedIds(new Set());
    }, [tab]);

    /*
     * Load folders for the bulk-move target dropdown.
     */
    useEffect(() => {
        if (!bulkMode) return;

        fetch("/api/folders")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data) setBulkFolders(data.folders);
            })
            .catch(() => { });
    }, [bulkMode, folderRefreshSignal]);

    const handleUploadComplete =
        useCallback(
            (item: MediaItem) => {
                bumpFolderRefresh();

                /*
                 * Only prepend newly uploaded media when:
                 *
                 * - active tab
                 * - no search
                 * - no type filter
                 * - matches the currently viewed folder
                 *   (or "All Media")
                 * - page 1
                 */
                const matchesFolder =
                    !selectedFolderId ||
                    item.folderId === selectedFolderId ||
                    item.folder?.id === selectedFolderId;

                if (
                    tab === "active" &&
                    !debouncedSearch &&
                    mediaFilter ===
                    "ALL" &&
                    matchesFolder &&
                    page === 1
                ) {
                    setMedia((prev) => [
                        item,
                        ...prev,
                    ]);

                    setPagination(
                        (prev) =>
                            prev
                                ? {
                                    ...prev,
                                    total:
                                        prev.total +
                                        1,
                                    totalPages:
                                        Math.ceil(
                                            (prev.total +
                                                1) /
                                            prev.limit
                                        ),
                                }
                                : prev
                    );
                } else {
                    /*
                     * Refresh when searching,
                     * filtering, or viewing
                     * another page/folder.
                     */
                    fetchMedia(
                        tab,
                        debouncedSearch,
                        page,
                        mediaFilter,
                        selectedFolderId
                    );
                }
            },
            [
                tab,
                debouncedSearch,
                page,
                mediaFilter,
                selectedFolderId,
                fetchMedia,
                bumpFolderRefresh,
            ]
        );

    const handleDelete =
        useCallback(
            async (id: string) => {
                setConfirmId(null);

                setPendingIds(
                    (prev) => {
                        const next =
                            new Set(
                                prev
                            );

                        next.add(id);

                        return next;
                    }
                );

                const previousMedia =
                    media;

                const previousPagination =
                    pagination;

                /*
                 * Optimistic removal.
                 */
                setMedia((prev) =>
                    prev.filter(
                        (item) =>
                            item.id !==
                            id
                    )
                );

                if (pagination) {
                    setPagination({
                        ...pagination,
                        total: Math.max(
                            0,
                            pagination.total -
                            1
                        ),
                        totalPages:
                            Math.ceil(
                                Math.max(
                                    0,
                                    pagination.total -
                                    1
                                ) /
                                pagination.limit
                            ),
                    });
                }

                try {
                    const res =
                        await fetch(
                            `/api/media/${id}`,
                            {
                                method: "DELETE",
                            }
                        );

                    if (!res.ok) {
                        throw new Error(
                            `Delete failed (${res.status})`
                        );
                    }

                    bumpFolderRefresh();

                    /*
                     * If the page becomes empty,
                     * go back one page.
                     */
                    if (
                        media.length ===
                        1 &&
                        page > 1
                    ) {
                        setPage(
                            (prev) =>
                                Math.max(
                                    1,
                                    prev -
                                    1
                                )
                        );
                    } else {
                        await fetchMedia(
                            tab,
                            debouncedSearch,
                            page,
                            mediaFilter,
                            selectedFolderId
                        );
                    }
                } catch (err) {
                    /*
                     * Rollback on failure.
                     */
                    setMedia(
                        previousMedia
                    );

                    setPagination(
                        previousPagination
                    );

                    setError(
                        err instanceof
                            Error
                            ? err.message
                            : "Failed to delete media"
                    );
                } finally {
                    setPendingIds(
                        (prev) => {
                            const next =
                                new Set(
                                    prev
                                );

                            next.delete(
                                id
                            );

                            return next;
                        }
                    );
                }
            },
            [
                media,
                pagination,
                page,
                tab,
                debouncedSearch,
                mediaFilter,
                selectedFolderId,
                fetchMedia,
                bumpFolderRefresh,
            ]
        );

    const handleMediaUpdated = useCallback(
        (updated: MediaItem) => {
            bumpFolderRefresh();

            setMedia((prev) => {
                /*
                 * If the item was moved out of the
                 * currently viewed folder, drop it
                 * from the visible list.
                 */
                const stillMatchesFolder =
                    !selectedFolderId ||
                    updated.folderId === selectedFolderId ||
                    updated.folder?.id === selectedFolderId;

                if (!stillMatchesFolder) {
                    return prev.filter(
                        (item) => item.id !== updated.id
                    );
                }

                return prev.map((item) =>
                    item.id === updated.id ? updated : item
                );
            });

            setSelectedMedia((prev) =>
                prev && prev.id === updated.id ? updated : prev
            );
        },
        [selectedFolderId, bumpFolderRefresh]
    );

    const handleRestore =
        useCallback(
            async (id: string) => {
                setPendingIds(
                    (prev) => {
                        const next =
                            new Set(
                                prev
                            );

                        next.add(id);

                        return next;
                    }
                );

                const previousMedia =
                    media;

                const previousPagination =
                    pagination;

                /*
                 * Optimistic removal
                 * from trash.
                 */
                setMedia((prev) =>
                    prev.filter(
                        (item) =>
                            item.id !==
                            id
                    )
                );

                if (pagination) {
                    setPagination({
                        ...pagination,
                        total: Math.max(
                            0,
                            pagination.total -
                            1
                        ),
                        totalPages:
                            Math.ceil(
                                Math.max(
                                    0,
                                    pagination.total -
                                    1
                                ) /
                                pagination.limit
                            ),
                    });
                }

                try {
                    const res =
                        await fetch(
                            `/api/media/${id}`,
                            {
                                method: "PATCH",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },
                                body: JSON.stringify(
                                    {
                                        action: "restore",
                                    }
                                ),
                            }
                        );

                    if (!res.ok) {
                        throw new Error(
                            `Restore failed (${res.status})`
                        );
                    }

                    bumpFolderRefresh();

                    if (
                        media.length ===
                        1 &&
                        page > 1
                    ) {
                        setPage(
                            (prev) =>
                                Math.max(
                                    1,
                                    prev -
                                    1
                                )
                        );
                    } else {
                        await fetchMedia(
                            tab,
                            debouncedSearch,
                            page,
                            mediaFilter,
                            selectedFolderId
                        );
                    }
                } catch (err) {
                    /*
                     * Rollback on failure.
                     */
                    setMedia(
                        previousMedia
                    );

                    setPagination(
                        previousPagination
                    );

                    setError(
                        err instanceof
                            Error
                            ? err.message
                            : "Failed to restore media"
                    );
                } finally {
                    setPendingIds(
                        (prev) => {
                            const next =
                                new Set(
                                    prev
                                );

                            next.delete(
                                id
                            );

                            return next;
                        }
                    );
                }
            },
            [
                media,
                pagination,
                page,
                tab,
                debouncedSearch,
                mediaFilter,
                selectedFolderId,
                fetchMedia,
                bumpFolderRefresh,
            ]
        );

    function toggleBulkSelect(item: MediaItem) {
        setBulkSelectedIds((prev) => {
            const next = new Set(prev);

            if (next.has(item.id)) {
                next.delete(item.id);
            } else {
                next.add(item.id);
            }

            return next;
        });
    }

    async function handleBulkMove() {
        if (!bulkMoveTargetId || bulkSelectedIds.size === 0) return;

        setIsBulkMoving(true);

        try {
            const res = await fetch("/api/media/bulk", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ids: Array.from(bulkSelectedIds),
                    folderId: bulkMoveTargetId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to move media");
            }

            toast.success(`Moved ${data.moved} item(s).`);

            setBulkSelectedIds(new Set());
            setBulkMoveTargetId("");
            setBulkMode(false);

            bumpFolderRefresh();

            await fetchMedia(
                tab,
                debouncedSearch,
                page,
                mediaFilter,
                selectedFolderId
            );
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to move media"
            );
        } finally {
            setIsBulkMoving(false);
        }
    }

    const goToPreviousPage =
        () => {
            if (
                pagination?.hasPreviousPage
            ) {
                setPage((prev) =>
                    Math.max(
                        1,
                        prev - 1
                    )
                );
            }
        };

    const goToNextPage = () => {
        if (
            pagination?.hasNextPage
        ) {
            setPage(
                (prev) => prev + 1
            );
        }
    };

    const handleMediaClick = (
        item: MediaItem
    ) => {
        setSelectedMedia(item);
        setDetailsOpen(true);
    };

    return (
        <div className="mx-auto flex max-w-7xl gap-6 p-6">
            <FolderSidebar
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
                refreshSignal={folderRefreshSignal}
            />

            <div className="min-w-0 flex-1 space-y-6">
                <WorkspacePageHeader
                    title="Media Library"
                    description="Upload and manage files used across the Workspace."
                    breadcrumbs={[
                        { label: "Workspace", href: "/workspace" },
                        { label: "Media Library" },
                    ]}
                    actions={
                        <WorkspacePageActions>
                            {tab === "active" && (
                                <WorkspaceButton
                                    variant={bulkMode ? "primary" : "secondary"}
                                    size="md"
                                    onClick={() => {
                                        setBulkMode((v) => !v);
                                        setBulkSelectedIds(new Set());
                                    }}
                                >
                                    <CheckSquare className="h-3.5 w-3.5" />
                                    {bulkMode ? "Done" : "Select multiple"}
                                </WorkspaceButton>
                            )}

                            <WorkspaceButton
                                variant="secondary"
                                size="md"
                                onClick={() =>
                                    fetchMedia(
                                        tab,
                                        debouncedSearch,
                                        page,
                                        mediaFilter,
                                        selectedFolderId
                                    )
                                }
                                disabled={isLoading}
                            >
                                <RefreshCw
                                    className={cn(
                                        "h-3.5 w-3.5",
                                        isLoading && "animate-spin"
                                    )}
                                />
                                Refresh
                            </WorkspaceButton>
                        </WorkspacePageActions>
                    }
                />

                {/* Upload */}
                {tab ===
                    "active" && (
                        <UploadDropzone
                            onUploadComplete={
                                handleUploadComplete
                            }
                            folderId={selectedFolderId ?? undefined}
                        />
                    )}

                {/* Tabs */}
                <div className="flex items-center justify-between gap-4 border-b border-[var(--workspace-border)]">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() =>
                                setTab(
                                    "active"
                                )
                            }
                            className={cn(
                                "border-b-2 px-3 py-2 text-xs font-semibold transition-colors",
                                tab ===
                                    "active"
                                    ? "border-[var(--workspace-primary)] text-[var(--workspace-text)]"
                                    : "border-transparent text-[var(--workspace-text-muted)] hover:text-[var(--workspace-text)]"
                            )}
                        >
                            Active
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setTab(
                                    "trash"
                                )
                            }
                            className={cn(
                                "border-b-2 px-3 py-2 text-xs font-semibold transition-colors",
                                tab ===
                                    "trash"
                                    ? "border-[var(--workspace-primary)] text-[var(--workspace-text)]"
                                    : "border-transparent text-[var(--workspace-text-muted)] hover:text-[var(--workspace-text)]"
                            )}
                        >
                            Trash
                        </button>
                    </div>
                </div>

                {/* Bulk action bar */}
                {bulkMode && (
                    <WorkspaceCard padding="sm" className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--workspace-text)]">
                            {bulkSelectedIds.size} selected
                        </span>

                        <div className="flex items-center gap-2">
                            <select
                                value={bulkMoveTargetId}
                                onChange={(e) =>
                                    setBulkMoveTargetId(e.target.value)
                                }
                                className="h-9 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-xs text-[var(--workspace-text)] outline-none transition-all focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10"
                                disabled={isBulkMoving}
                            >
                                <option value="">Move to folder...</option>

                                {bulkFolders.map((folder) => (
                                    <option key={folder.id} value={folder.id}>
                                        {folder.name}
                                    </option>
                                ))}
                            </select>

                            <WorkspaceButton
                                size="sm"
                                variant="primary"
                                onClick={handleBulkMove}
                                disabled={
                                    !bulkMoveTargetId ||
                                    bulkSelectedIds.size === 0 ||
                                    isBulkMoving
                                }
                            >
                                {isBulkMoving ? "Moving..." : "Move"}
                            </WorkspaceButton>
                        </div>
                    </WorkspaceCard>
                )}

                {!bulkMode && selectedMedia && (
                    <WorkspaceCard padding="sm" className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={selectedMedia.url}
                                alt={selectedMedia.alt ?? selectedMedia.originalName}
                                className="h-12 w-12 rounded-lg object-cover"
                            />

                            <div>
                                <p className="text-xs font-semibold text-[var(--workspace-text)]">
                                    {selectedMedia.originalName}
                                </p>

                                <p className="text-[10px] text-[var(--workspace-text-muted)]">
                                    Selected image
                                </p>
                            </div>
                        </div>


                        <WorkspaceButton
                            size="sm"
                            variant="primary"
                            onClick={() => {
                                onSelect?.(selectedMedia);
                            }}
                        >
                            Insert Image
                        </WorkspaceButton>
                    </WorkspaceCard>
                )}

                {/* Search + Type Filter */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <WorkspaceSearch
                        value={searchInput}
                        onChange={setSearchInput}
                        placeholder="Search by filename or alt text..."
                        className="sm:w-72"
                    />

                    <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-1">
                        {MEDIA_FILTERS.map(
                            (filter) => (
                                <button
                                    key={
                                        filter.value
                                    }
                                    type="button"
                                    onClick={() =>
                                        setMediaFilter(
                                            filter.value
                                        )
                                    }
                                    className={cn(
                                        "rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors",
                                        mediaFilter ===
                                            filter.value
                                            ? "bg-[var(--workspace-surface)] text-[var(--workspace-text)] shadow-sm"
                                            : "text-[var(--workspace-text-muted)] hover:text-[var(--workspace-text)]"
                                    )}
                                >
                                    {
                                        filter.label
                                    }
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Media */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            {isLoading
                                ? "Loading..."
                                : `${pagination?.total ??
                                media.length
                                } item${(pagination?.total ??
                                    media.length) ===
                                    1
                                    ? ""
                                    : "s"
                                }`}
                        </h2>

                        {pagination &&
                            pagination.totalPages >
                            1 && (
                                <span className="text-[10px] text-[var(--workspace-text-muted)]">
                                    Page{" "}
                                    {
                                        pagination.page
                                    }{" "}
                                    of{" "}
                                    {
                                        pagination.totalPages
                                    }
                                </span>
                            )}
                    </div>

                    <MediaGrid
                        media={media}
                        tab={tab}
                        isLoading={isLoading}
                        error={error}
                        search={debouncedSearch}
                        pendingIds={pendingIds}
                        confirmId={confirmId}

                        onDelete={handleDelete}
                        onRestore={handleRestore}
                        onConfirmChange={setConfirmId}
                        onDetailsClick={handleMediaClick}

                        selectionMode={!bulkMode}

                        selectedId={selectedMedia?.id ?? null}

                        onSelect={(item) => setSelectedMedia(item)}

                        multiSelectMode={bulkMode}
                        multiSelectedIds={bulkSelectedIds}
                        onToggleMultiSelect={toggleBulkSelect}
                    />

                    {/* Pagination */}
                    {pagination &&
                        pagination.totalPages >
                        1 && (
                            <div className="flex items-center justify-center gap-1.5 pt-4">
                                <WorkspaceButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={
                                        goToPreviousPage
                                    }
                                    disabled={
                                        !pagination.hasPreviousPage ||
                                        isLoading
                                    }
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    Previous
                                </WorkspaceButton>

                                <div className="flex h-8 items-center rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-[10px] font-medium text-[var(--workspace-text-muted)]">
                                    {
                                        pagination.page
                                    }
                                </div>

                                <WorkspaceButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={
                                        goToNextPage
                                    }
                                    disabled={
                                        !pagination.hasNextPage ||
                                        isLoading
                                    }
                                >
                                    Next
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </WorkspaceButton>
                            </div>
                        )}
                </div>
                <MediaDetailsDrawer
                    media={selectedMedia}
                    open={detailsOpen}
                    onOpenChange={setDetailsOpen}
                    onUpdated={handleMediaUpdated}
                />
            </div>
        </div>
    );
}