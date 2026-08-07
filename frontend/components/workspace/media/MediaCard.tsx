"use client";

import {
    Check,
    FileAudio,
    FileText,
    FileVideo,
    Image as ImageIcon,
    Loader2,
    RotateCcw,
    Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type MediaType =
    | "IMAGE"
    | "VIDEO"
    | "AUDIO"
    | "DOCUMENT"
    | "OTHER";

export interface MediaItem {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    type: MediaType;
    size: number;
    width?: number | null;
    height?: number | null;
    folder?: string | null;
    alt?: string | null;
    createdAt: string;
    updatedAt: string;
}

interface MediaCardProps {
    item: MediaItem;
    tab: "active" | "trash";

    pending: boolean;
    confirming: boolean;

    onDeleteClick: () => void;
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;
    onRestore: () => void;

    selectionMode?: boolean;
    selected?: boolean;
    onSelect?: () => void;

}

function formatFileSize(size: number) {
    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    if (size < 1024 * 1024 * 1024) {
        return `${(size / 1024 / 1024).toFixed(2)} MB`;
    }

    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;

}

function getTypeLabel(type: MediaItem["type"]) {
    switch (type) {
        case "IMAGE":
            return "Image";


        case "VIDEO":
            return "Video";

        case "AUDIO":
            return "Audio";

        case "DOCUMENT":
            return "Document";

        default:
            return "File";
    }
}

function MediaPreview({ item }: { item: MediaItem }) {
    switch (item.type) {
        case "IMAGE":
            return (
                <img
                    src={item.url}
                    alt={item.alt || item.originalName}
                    className="h-full w-full object-cover"
                />
            );


        case "VIDEO":
            return (
                <div className="relative flex h-full w-full items-center justify-center bg-muted">
                    <FileVideo className="h-12 w-12 text-muted-foreground" />

                    <span className="absolute bottom-2 rounded bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                        VIDEO
                    </span>
                </div>
            );

        case "AUDIO":
            return (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted px-4">
                    <FileAudio className="h-12 w-12 text-muted-foreground" />

                    <audio
                        controls
                        preload="metadata"
                        src={item.url}
                        className="w-full max-w-[220px]"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            );

        case "DOCUMENT":
            return (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted">
                    <FileText className="h-12 w-12 text-muted-foreground" />

                    <span className="rounded bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground">
                        DOCUMENT
                    </span>
                </div>
            );

        default:
            return (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted">
                    <FileText className="h-12 w-12 text-muted-foreground" />

                    <span className="rounded bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground">
                        FILE
                    </span>
                </div>
            );
    }
}


export default function MediaCard({
    item,
    tab,
    pending,
    confirming,
    onDeleteClick,
    onDeleteConfirm,
    onDeleteCancel,
    onRestore,
    selected,
    onSelect,
    selectionMode,
}: MediaCardProps) {
    return (<div className="space-y-1">
        <div
            onClick={() => {
                if (selectionMode) {
                    onSelect?.();
                }
            }}
            className={cn(
                "group relative overflow-hidden rounded-md border bg-muted/30 transition",
                selectionMode &&
                "cursor-pointer hover:ring-2 hover:ring-primary",
                selected && "ring-2 ring-primary"
            )}
        > <div className="aspect-square"> <MediaPreview item={item} /> </div>

            {selectionMode && selected && (
                <div className="absolute right-2 top-2 z-20 rounded-full bg-primary p-1 text-primary-foreground shadow">
                    <Check className="h-3.5 w-3.5" />
                </div>
            )}

            {!selectionMode && (
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center gap-2 bg-black/50 transition-opacity",
                        confirming
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                    )}
                >
                    {pending ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : tab === "trash" ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRestore();
                            }}
                            className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium hover:bg-white"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Restore
                        </button>
                    ) : confirming ? (
                        <div className="flex flex-col items-center gap-1.5">
                            <span className="text-[11px] text-white">
                                Delete this?
                            </span>

                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteConfirm();
                                    }}
                                    className="rounded bg-red-600 px-2 py-0.5 text-[11px] text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteCancel();
                                    }}
                                    className="rounded bg-white px-2 py-0.5 text-[11px]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick();
                            }}
                            className="rounded-full bg-white/90 p-2 text-red-600 hover:bg-white"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}
        </div>

        <div className="min-w-0 px-1">
            <div className="flex items-center gap-1.5">
                {item.type === "IMAGE" ? (
                    <ImageIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                ) : item.type === "VIDEO" ? (
                    <FileVideo className="h-3 w-3 shrink-0 text-muted-foreground" />
                ) : item.type === "AUDIO" ? (
                    <FileAudio className="h-3 w-3 shrink-0 text-muted-foreground" />
                ) : (
                    <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                )}

                <span
                    className="truncate text-[11px] font-medium"
                    title={item.originalName}
                >
                    {item.originalName}
                </span>
            </div>

            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">
                    {getTypeLabel(item.type)}
                </span>

                <span className="text-[10px] text-muted-foreground">
                    {formatFileSize(item.size)}
                </span>
            </div>
        </div>
    </div>
    );
}
