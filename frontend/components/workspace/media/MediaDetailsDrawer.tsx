"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, FileAudio, FileText, FileVideo, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";

import type { MediaItem } from "./MediaCard";
import type { FolderItem } from "./FolderSidebar";

interface MediaDetailsDrawerProps {
    media: MediaItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated?: (media: MediaItem) => void;
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
    onUpdated,
}: MediaDetailsDrawerProps) {
    const [altInput, setAltInput] = useState("");
    const [folderIdInput, setFolderIdInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [foldersLoading, setFoldersLoading] = useState(false);

    const fetchFolders = useCallback(async () => {
        setFoldersLoading(true);

        try {
            const res = await fetch("/api/folders");
            if (!res.ok) return;

            const data = await res.json();
            setFolders(data.folders);
        } catch {
            /* dropdown just stays with current value only */
        } finally {
            setFoldersLoading(false);
        }
    }, []);

    /*
     * Fetch the folder list whenever the drawer opens.
     */
    useEffect(() => {
        if (!open) return;

        fetchFolders();
    }, [open, fetchFolders]);

    /*
     * Sync local editable state whenever the
     * selected media item changes.
     */
    useEffect(() => {
        if (!media) return;

        setAltInput(media.alt ?? "");
        setFolderIdInput(media.folderId ?? media.folder?.id ?? "");
    }, [media?.id]);

    if (!media) {
        return null;
    }

    const currentFolderId = media.folderId ?? media.folder?.id ?? "";

    const isDirty =
        altInput !== (media.alt ?? "") ||
        folderIdInput !== currentFolderId;

    async function copyUrl() {
        if (!media) return;

        await navigator.clipboard.writeText(
            media.url
        );

        toast.success(
            "Media URL copied."
        );
    }

    async function handleSave() {
        if (!media) return;

        setIsSaving(true);

        try {
            const res = await fetch(
                `/api/media/${media.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "update",
                        alt: altInput.trim() || null,
                        folderId: folderIdInput || undefined,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || "Failed to save changes"
                );
            }

            toast.success("Media details updated.");
            onUpdated?.(data);
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to save changes"
            );
        } finally {
            setIsSaving(false);
        }
    }

    function handleCancel() {
        if (!media) return;

        setAltInput(media.alt ?? "");
        setFolderIdInput(media.folderId ?? media.folder?.id ?? "");
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
                        View and edit asset information.
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


                    {/* Basic Information (read-only) */}
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

                    </div>


                    {/* Editable fields */}
                    <div className="space-y-4 border-t pt-4">

                        <div className="space-y-1.5">
                            <label
                                htmlFor="media-folder"
                                className="text-xs font-medium text-muted-foreground"
                            >
                                Folder
                            </label>

                            <select
                                id="media-folder"
                                value={folderIdInput}
                                onChange={(e) =>
                                    setFolderIdInput(e.target.value)
                                }
                                disabled={isSaving || foldersLoading}
                                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                                {/*
                                 * Ensure the media's current folder always
                                 * appears even if it somehow isn't in the
                                 * fetched list yet (e.g. stale cache).
                                 */}
                                {media.folder &&
                                    !folders.some((f) => f.id === media.folder!.id) && (
                                        <option value={media.folder.id}>
                                            {media.folder.name}
                                        </option>
                                    )}

                                {folders.map((folder) => (
                                    <option key={folder.id} value={folder.id}>
                                        {folder.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="space-y-1.5">
                            <label
                                htmlFor="media-alt"
                                className="text-xs font-medium text-muted-foreground"
                            >
                                Alt Text
                            </label>

                            <Textarea
                                id="media-alt"
                                rows={3}
                                value={altInput}
                                onChange={(e) =>
                                    setAltInput(e.target.value)
                                }
                                placeholder="Describe this image for accessibility and SEO..."
                                disabled={isSaving}
                            />
                        </div>


                        <div className="flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                className="flex-1"
                                onClick={handleSave}
                                disabled={!isDirty || isSaving}
                            >
                                {isSaving && (
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                )}
                                Save Changes
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={!isDirty || isSaving}
                            >
                                Cancel
                            </Button>
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