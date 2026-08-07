"use client";

import { Copy, FileAudio, FileText, FileVideo, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import type { MediaItem } from "./MediaCard";

interface MediaDetailsDrawerProps {
    media: MediaItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
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

function getTypeIcon(type: MediaItem["type"]) {
    switch (type) {
        case "IMAGE":
            return (
                <ImageIcon className="h-4 w-4" />
            );

        case "VIDEO":
            return (
                <FileVideo className="h-4 w-4" />
            );

        case "AUDIO":
            return (
                <FileAudio className="h-4 w-4" />
            );

        default:
            return (
                <FileText className="h-4 w-4" />
            );
    }
}

export default function MediaDetailsDrawer({
    media,
    open,
    onOpenChange,
}: MediaDetailsDrawerProps) {
    if (!media) {
        return null;
    }

    async function copyUrl() {
        await navigator.clipboard.writeText(
            media.url
        );

        toast.success(
            "Media URL copied."
        );
    }

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent
                side="right"
                className="w-full sm:max-w-md overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle>
                        Media Details
                    </SheetTitle>

                    <SheetDescription>
                        View asset information.
                    </SheetDescription>
                </SheetHeader>


                <div className="mt-6 space-y-6">

                    {/* Preview */}
                    <div className="overflow-hidden rounded-lg border bg-muted">
                        {media.type === "IMAGE" ? (
                            <img
                                src={media.url}
                                alt={
                                    media.alt ??
                                    media.originalName
                                }
                                className="aspect-square w-full object-cover"
                            />
                        ) : (
                            <div className="flex aspect-square items-center justify-center text-muted-foreground">
                                {getTypeIcon(media.type)}
                            </div>
                        )}
                    </div>


                    {/* Basic Information */}
                    <div className="space-y-3">

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Filename
                            </p>

                            <p className="truncate text-sm font-medium">
                                {media.originalName}
                            </p>
                        </div>


                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Type
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-sm">
                                    {getTypeIcon(
                                        media.type
                                    )}

                                    {media.type}
                                </div>
                            </div>


                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Size
                                </p>

                                <p className="mt-1 text-sm">
                                    {formatFileSize(
                                        media.size
                                    )}
                                </p>
                            </div>

                        </div>


                        {(media.width &&
                            media.height) && (
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Dimensions
                                    </p>

                                    <p className="mt-1 text-sm">
                                        {media.width}
                                        {" × "}
                                        {media.height}
                                    </p>
                                </div>
                            )}


                        <div>
                            <p className="text-xs text-muted-foreground">
                                MIME Type
                            </p>

                            <p className="mt-1 text-sm">
                                {media.mimeType}
                            </p>
                        </div>


                        <div>
                            <p className="text-xs text-muted-foreground">
                                Folder
                            </p>

                            <p className="mt-1 text-sm">
                                {media.folder ?? "uploads"}
                            </p>
                        </div>


                        <div>
                            <p className="text-xs text-muted-foreground">
                                Alt Text
                            </p>

                            <p className="mt-1 text-sm">
                                {media.alt ||
                                    "No alt text"}
                            </p>
                        </div>

                    </div>


                    {/* URL */}
                    <div className="space-y-2">

                        <p className="text-xs text-muted-foreground">
                            Public URL
                        </p>

                        <div className="flex items-center gap-2">

                            <p className="flex-1 truncate rounded-md border bg-muted px-3 py-2 text-xs">
                                {media.url}
                            </p>

                            <button
                                type="button"
                                onClick={copyUrl}
                                className="rounded-md border p-2 hover:bg-muted"
                            >
                                <Copy className="h-4 w-4" />
                            </button>

                        </div>

                    </div>

                </div>

            </SheetContent>
        </Sheet>
    );
}