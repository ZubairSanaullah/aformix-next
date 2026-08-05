"use client";

import {
    RefreshCw,
    Search,
    X,
} from "lucide-react";

import MediaGrid from "@/components/workspace/media/MediaGrid";
import type { MediaItem } from "@/components/workspace/media/MediaCard";
import { UploadDropzone } from "@/components/workspace/media/UploadDropzone";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "active" | "trash";

export default function MediaLibraryPage() {
    const [tab, setTab] = useState<Tab>("active");
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");

    const debouncedSearch = useDebouncedValue(searchInput, 350);

    const fetchMedia = useCallback(async (activeTab: Tab, query: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (activeTab === "trash") params.set("status", "trash");
            if (query.trim()) params.set("q", query.trim());

            const res = await fetch(`/api/media?${params.toString()}`);
            if (!res.ok) throw new Error(`Failed to load media (${res.status})`);
            const data: MediaItem[] = await res.json();
            setMedia(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load media");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedia(tab, debouncedSearch);
    }, [tab, debouncedSearch, fetchMedia]);

    useEffect(() => {
        setConfirmId(null);
    }, [tab]);

    const handleUploadComplete = useCallback(
        (item: MediaItem) => {
            if (tab === "active" && !debouncedSearch) {
                setMedia((prev) => [item, ...prev]);
            }
        },
        [tab, debouncedSearch]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            setConfirmId(null);
            setPendingIds((prev) => new Set(prev).add(id));

            const previous = media;
            setMedia((prev) => prev.filter((m) => m.id !== id));

            try {
                const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
                if (!res.ok) throw new Error(`Delete failed (${res.status})`);
            } catch (err) {
                setMedia(previous);
                setError(
                    err instanceof Error ? err.message : "Failed to delete media"
                );
            } finally {
                setPendingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }
        },
        [media]
    );

    const handleRestore = useCallback(
        async (id: string) => {
            setPendingIds((prev) => new Set(prev).add(id));

            const previous = media;
            setMedia((prev) => prev.filter((m) => m.id !== id));

            try {
                const res = await fetch(`/api/media/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "restore" }),
                });
                if (!res.ok) throw new Error(`Restore failed (${res.status})`);
            } catch (err) {
                setMedia(previous);
                setError(
                    err instanceof Error ? err.message : "Failed to restore media"
                );
            } finally {
                setPendingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }
        },
        [media]
    );

    return (
        <div className="mx-auto max-w-6xl space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Media Library
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Upload and manage images used across the Workspace.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchMedia(tab, debouncedSearch)}
                    disabled={isLoading}
                >
                    <RefreshCw
                        className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
                    />
                    Refresh
                </Button>
            </div>

            {tab === "active" && (
                <UploadDropzone onUploadComplete={handleUploadComplete} />
            )}

            <div className="flex items-center justify-between gap-4 border-b">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setTab("active")}
                        className={cn(
                            "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                            tab === "active"
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Active
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("trash")}
                        className={cn(
                            "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                            tab === "trash"
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Trash
                    </button>
                </div>

                <div className="relative mb-2 w-64">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by filename or alt text..."
                        className="h-8 pl-8 pr-8 text-sm"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={() => setSearchInput("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">
                    {isLoading
                        ? "Loading..."
                        : `${media.length} item${media.length === 1 ? "" : "s"}`}
                </h2>

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
                />
            </div>
        </div>
    );
}