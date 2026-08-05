"use client";

import {
    Check,
    Loader2,
    RotateCcw,
    Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MediaItem {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
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
    return (
        <div
            onClick={() => {
                if (selectionMode) {
                    onSelect?.();
                }
            }}
            className={cn(
                "group relative overflow-hidden rounded-md border bg-muted/30 transition cursor-pointer",
                selectionMode && "hover:ring-2 hover:ring-primary",
                selected && "ring-2 ring-primary"
            )}
        >
            <div className="relative aspect-square w-full">
                <img
                    src={item.url}
                    alt={item.alt || item.originalName}
                    className={cn(
                        "h-full w-full object-cover transition-opacity",
                        pending && "opacity-40",
                        tab === "trash" && "grayscale-[40%]"
                    )}
                />

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

            <div className="truncate px-2 py-1 text-[11px] text-muted-foreground">
                {item.originalName}
            </div>
        </div>
    );
}