"use client";

import { ImageIcon } from "lucide-react";
import MediaCard, { MediaItem } from "./MediaCard";

export type MediaTab = "active" | "trash";

interface MediaGridProps {
    media: MediaItem[];
    tab: "active" | "trash";
    isLoading: boolean;
    error: string | null;
    search: string;

    pendingIds: Set<string>;
    confirmId: string | null;

    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onConfirmChange: (id: string | null) => void;


    // picker support
    selectionMode?: boolean;
    selectedId?: string | null;
    onSelect?: (media: MediaItem) => void;
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

    selectionMode,
    selectedId,
    onSelect,

}: MediaGridProps) {
    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-square animate-pulse rounded-md bg-muted"
                    />
                ))}
            </div>
        );
    }

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

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {media.map((item) => (
                <MediaCard
                    key={item.id}
                    item={item}
                    tab={tab}

                    pending={
                        pendingIds.has(item.id)
                    }

                    confirming={
                        confirmId === item.id
                    }

                    onDeleteClick={() =>
                        onConfirmChange(item.id)
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


                    selectionMode={selectionMode}

                    selected={
                        selectedId === item.id
                    }

                    onSelect={() => {
                        onSelect?.(item)
                    }}
                />
            ))}
        </div>
    );
}