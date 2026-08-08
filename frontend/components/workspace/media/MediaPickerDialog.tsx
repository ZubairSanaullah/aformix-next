"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Search,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { UploadDropzone } from "@/components/workspace/media/UploadDropzone";
import MediaGrid from "@/components/workspace/media/MediaGrid";
import type { MediaItem } from "@/components/workspace/media/MediaCard";
import type { FolderItem } from "@/components/workspace/media/FolderSidebar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface MediaPickerDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (media: MediaItem) => void;
}

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

export default function MediaPickerDialog({
    open,
    onClose,
    onSelect,
}: MediaPickerDialogProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);

    const [selected, setSelected] =
        useState<MediaItem | null>(null);

    const [searchInput, setSearchInput] = useState("");

    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [folderId, setFolderId] = useState("");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] =
        useState<MediaPagination | null>(null);

    const debouncedSearch =
        useDebouncedValue(searchInput, 350);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const fetchFolders = useCallback(async () => {
        try {
            const res = await fetch("/api/folders");
            if (!res.ok) return;

            const data = await res.json();
            setFolders(data.folders);
        } catch {
            /* non-critical: dropdown just stays empty */
        }
    }, []);

    const fetchMedia = useCallback(
        async (requestedPage: number) => {
            setIsLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();

                if (debouncedSearch.trim()) {
                    params.set(
                        "q",
                        debouncedSearch.trim()
                    );
                }

                if (folderId) {
                    params.set("folderId", folderId);
                }

                params.set("type", "IMAGE");

                params.set(
                    "page",
                    String(requestedPage)
                );

                params.set(
                    "limit",
                    String(PAGE_SIZE)
                );

                const res = await fetch(
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
                setPagination(data.pagination);
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
        [debouncedSearch, folderId]
    );

    /*
     * Reset to page 1 when search or folder changes.
     */
    useEffect(() => {
        if (!open) return;

        setPage(1);
    }, [
        open,
        debouncedSearch,
        folderId,
    ]);

    /*
     * Fetch media whenever the dialog,
     * search, folder, or page changes.
     */
    useEffect(() => {
        if (!open) return;

        fetchMedia(page);
    }, [
        open,
        page,
        fetchMedia,
    ]);

    /*
     * Fetch folders and reset selection when opening the picker.
     */
    useEffect(() => {
        if (!open) return;

        setSelected(null);
        fetchFolders();
    }, [open, fetchFolders]);

    const handleUploadComplete = useCallback(
        async () => {
            /*
             * Refresh the current page after upload.
             */
            await fetchMedia(page);
            await fetchFolders();
        },
        [fetchMedia, fetchFolders, page]
    );

    const goToPreviousPage = () => {
        if (
            pagination?.hasPreviousPage &&
            !isLoading
        ) {
            setPage((prev) =>
                Math.max(1, prev - 1)
            );
        }
    };

    const goToNextPage = () => {
        if (
            pagination?.hasNextPage &&
            !isLoading
        ) {
            setPage((prev) => prev + 1);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div
                className="
                    flex
                    max-h-[90vh]
                    w-full
                    max-w-5xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-white
                    shadow-2xl
                    dark:bg-zinc-950
                "
            >
                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        px-6
                        py-4
                    "
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            Select Media
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Choose an image from your library.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-muted"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Upload */}
                <div className="border-b bg-muted/20 p-6">
                    {folderId && (
                        <div className="mb-3 rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground">
                            New uploads will be added to{" "}
                            <span className="font-medium text-foreground">
                                {folders.find(
                                    (folder) => folder.id === folderId
                                )?.name ?? "selected folder"}
                            </span>
                            .
                        </div>
                    )}

                    {!folderId && (
                        <div className="mb-3 rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground">
                            New uploads will be added to the{" "}
                            <span className="font-medium text-foreground">
                                uploads
                            </span>{" "}
                            folder.
                        </div>
                    )}

                    <UploadDropzone
                        onUploadComplete={handleUploadComplete}
                        folderId={folderId || undefined}
                    />
                </div>

                {/* Search + Folder */}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-muted-foreground
                                "
                            />

                            <Input
                                value={searchInput}
                                onChange={(e) =>
                                    setSearchInput(
                                        e.target.value
                                    )
                                }
                                placeholder="Search media..."
                                className="pl-9 pr-9"
                            />

                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchInput("")
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-muted-foreground
                                    "
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <select
                            value={folderId}
                            onChange={(e) =>
                                setFolderId(
                                    e.target.value
                                )
                            }
                            className="
                                h-10
                                rounded-md
                                border
                                bg-background
                                px-3
                                text-sm
                                outline-none
                                focus:ring-2
                                focus:ring-ring
                            "
                        >
                            <option value="">
                                All folders
                            </option>

                            {folders.map((folder) => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : (
                        <>
                            <MediaGrid
                                media={media}
                                tab="active"
                                isLoading={false}
                                error={error}
                                search={debouncedSearch}
                                pendingIds={new Set()}
                                confirmId={null}
                                onDelete={() => { }}
                                onRestore={() => { }}
                                onConfirmChange={() => { }}
                                selectionMode
                                selectedId={
                                    selected?.id ??
                                    null
                                }
                                onSelect={(item) =>
                                    setSelected(item)
                                }
                            />

                            {/* Pagination */}
                            {pagination &&
                                pagination.totalPages >
                                1 && (
                                    <div className="flex items-center justify-between pt-6">
                                        <span className="text-xs text-muted-foreground">
                                            {pagination.total}{" "}
                                            items
                                        </span>

                                        <div className="flex items-center gap-2">
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

                                            <span className="min-w-16 text-center text-sm font-medium">
                                                Page{" "}
                                                {
                                                    pagination.page
                                                }{" "}
                                                of{" "}
                                                {
                                                    pagination.totalPages
                                                }
                                            </span>

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
                                    </div>
                                )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        px-6
                        py-4
                    "
                >
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={!selected}
                        onClick={() => {
                            if (!selected) return;

                            onSelect(selected);
                            onClose();
                        }}
                    >
                        <Check className="mr-2 h-4 w-4" />
                        Insert Image
                    </Button>
                </div>
            </div>
        </div>
    );
}