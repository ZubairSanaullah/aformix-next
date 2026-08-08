"use client";

import { ImageIcon } from "lucide-react";

import MediaCard, {
    type MediaItem,
} from "./MediaCard";

export type MediaTab = "active" | "trash";

interface MediaGridProps {
    media: MediaItem[];
    tab: MediaTab;

    isLoading: boolean;
    error: string | null;
    search: string;

    pendingIds: Set<string>;
    confirmId: string | null;

    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onConfirmChange: (
        id: string | null
    ) => void;

    onDetailsClick?: (
        media: MediaItem
    ) => void;

    /*
     * Picker support — single select
     */
    selectionMode?: boolean;
    selectedId?: string | null;
    onSelect?: (
        media: MediaItem
    ) => void;

    /*
     * Bulk support — multi select
     */
    multiSelectMode?: boolean;
    multiSelectedIds?: Set<string>;
    onToggleMultiSelect?: (
        media: MediaItem
    ) => void;
}

export default function MediaGrid({
    media,
    tab,
    isLoading,
    error,
    search,
    pendingIds,
    confirmId,
    onDelete,
    onRestore,
    onConfirmChange,
    onDetailsClick,

    selectionMode,
    selectedId,
    onSelect,

    multiSelectMode,
    multiSelectedIds,
    onToggleMultiSelect,
}: MediaGridProps) {
    /*
     * Error state
     */
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                <p className="text-sm text-destructive">
                    {error}
                </p>
            </div>
        );
    }

    /*
     * Loading state
     */
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({
                    length: 10,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="aspect-square animate-pulse rounded-md bg-muted"
                    />
                ))}
            </div>
        );
    }

    /*
     * Empty state
     */
    if (media.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                <ImageIcon className="mb-3 h-8 w-8 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                    {search
                        ? "No media matches your search."
                        : tab === "trash"
                            ? "Trash is empty."
                            : "No media uploaded yet."}
                </p>
            </div>
        );
    }

    /*
     * Media grid
     */
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {media.map((item) => (
                <MediaCard
                    key={item.id}
                    item={item}
                    tab={tab}
                    pending={pendingIds.has(
                        item.id
                    )}
                    confirming={
                        confirmId === item.id
                    }
                    onDeleteClick={() =>
                        onConfirmChange(
                            item.id
                        )
                    }
                    onDeleteConfirm={() =>
                        onDelete(item.id)
                    }
                    onDeleteCancel={() =>
                        onConfirmChange(null)
                    }
                    onRestore={() =>
                        onRestore(item.id)
                    }
                    onDetailsClick={
                        onDetailsClick
                            ? () =>
                                onDetailsClick(
                                    item
                                )
                            : undefined
                    }
                    /*
                     * Single selection / picker
                     */
                    selectionMode={
                        selectionMode
                    }
                    selected={
                        selectedId === item.id
                    }
                    onSelect={() =>
                        onSelect?.(item)
                    }
                    /*
                     * Multi selection / bulk actions
                     */
                    multiSelectMode={
                        multiSelectMode
                    }
                    multiSelected={
                        multiSelectedIds?.has(
                            item.id
                        ) ?? false
                    }
                    onToggleMultiSelect={
                        onToggleMultiSelect
                            ? () =>
                                onToggleMultiSelect(
                                    item
                                )
                            : undefined
                    }
                />
            ))}
        </div>
    );
}
