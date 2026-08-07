"use client";

import {
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Search,
    X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Input from "@/components/ui/Input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useCallback, useEffect, useState } from "react";
import MediaGrid from "@/components/workspace/media/MediaGrid";
import type { MediaItem } from "@/components/workspace/media/MediaCard";
import { UploadDropzone } from "@/components/workspace/media/UploadDropzone";
import { Button } from "@/components/ui/button";
import MediaDetailsDrawer from "@/components/workspace/media/MediaDetailsDrawer";

type Tab = "active" | "trash";

type MediaType =
    | "ALL"
    | "IMAGE"
    | "VIDEO"
    | "AUDIO"
    | "DOCUMENT"
    | "OTHER";

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

    const [mediaType, setMediaType] =
        useState<MediaType>("ALL");

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
            selectedType: MediaType
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
     * tab, search, or filter changes.
     */
    useEffect(() => {
        setPage(1);
    }, [
        tab,
        debouncedSearch,
        mediaFilter,
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
            mediaFilter
        );
    }, [
        tab,
        debouncedSearch,
        page,
        mediaFilter,
        fetchMedia,
    ]);

    /*
     * Close confirmation when
     * switching tabs.
     */
    useEffect(() => {
        setConfirmId(null);
    }, [tab]);

    const handleUploadComplete =
        useCallback(
            (item: MediaItem) => {
                /*
                 * Only prepend newly uploaded
                 * media when:
                 *
                 * - active tab
                 * - no search
                 * - no type filter
                 * - page 1
                 */
                if (
                    tab === "active" &&
                    !debouncedSearch &&
                    mediaFilter ===
                    "ALL" &&
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
                     * another page.
                     */
                    fetchMedia(
                        tab,
                        debouncedSearch,
                        page,
                        mediaFilter
                    );
                }
            },
            [
                tab,
                debouncedSearch,
                page,
                mediaFilter,
                fetchMedia,
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
                            mediaFilter
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
                fetchMedia,
            ]
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
                            mediaFilter
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
                fetchMedia,
            ]
        );

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
        <div className="mx-auto max-w-6xl space-y-8 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Media Library
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Upload and manage files used across the Workspace.
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        fetchMedia(
                            tab,
                            debouncedSearch,
                            page,
                            mediaFilter
                        )
                    }
                    disabled={
                        isLoading
                    }
                >
                    <RefreshCw
                        className={cn(
                            "mr-2 h-4 w-4",
                            isLoading &&
                            "animate-spin"
                        )}
                    />

                    Refresh
                </Button>
            </div>

            {/* Upload */}
            {tab ===
                "active" && (
                    <UploadDropzone
                        onUploadComplete={
                            handleUploadComplete
                        }
                    />
                )}

            {/* Tabs */}
            <div className="flex items-center justify-between gap-4 border-b">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() =>
                            setTab(
                                "active"
                            )
                        }
                        className={cn(
                            "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                            tab ===
                                "active"
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
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
                            "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                            tab ===
                                "trash"
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Trash
                    </button>
                </div>
            </div>

            {selectedMedia && (
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={selectedMedia.url}
                            alt={selectedMedia.alt ?? selectedMedia.originalName}
                            className="h-12 w-12 rounded object-cover"
                        />

                        <div>
                            <p className="text-sm font-medium">
                                {selectedMedia.originalName}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Selected image
                            </p>
                        </div>
                    </div>


                    <Button
                        size="sm"
                        onClick={() => {
                            onSelect?.(selectedMedia);
                        }}
                    >
                        Insert Image
                    </Button>
                </div>
            )}

            {/* Search + Type Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={
                            searchInput
                        }
                        onChange={(e) =>
                            setSearchInput(
                                e.target
                                    .value
                            )
                        }
                        placeholder="Search by filename or alt text..."
                        className="h-9 pl-8 pr-8 text-sm"
                    />

                    {searchInput && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearchInput(
                                    ""
                                )
                            }
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-1 rounded-lg border bg-muted/30 p-1">
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
                                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                                    mediaFilter ===
                                        filter.value
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
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
                    <h2 className="text-sm font-medium text-muted-foreground">
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
                            <span className="text-xs text-muted-foreground">
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


                    selectionMode={true}

                    selectedId={
                        selectedMedia?.id ?? null
                    }

                    onSelect={(item) =>
                        setSelectedMedia(item)
                    }
                />

                {/* Pagination */}
                {pagination &&
                    pagination.totalPages >
                    1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={
                                    goToPreviousPage
                                }
                                disabled={
                                    !pagination.hasPreviousPage ||
                                    isLoading
                                }
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Previous
                            </Button>

                            <div className="flex h-8 min-w-8 items-center justify-center rounded-md border px-3 text-sm font-medium">
                                {
                                    pagination.page
                                }
                            </div>

                            <Button
                                variant="outline"
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
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    )}
            </div>
            <MediaDetailsDrawer
                media={selectedMedia}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />
        </div>
    );
}
