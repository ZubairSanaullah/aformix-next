"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Check,
    Folder as FolderIcon,
    FolderPlus,
    Loader2,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";

export interface FolderItem {
    id: string;
    name: string;
    mediaCount: number;
    isProtected: boolean;
}

interface FolderSidebarProps {
    selectedFolderId: string | null;
    onSelectFolder: (id: string | null) => void;
    /*
     * Bump this whenever an action elsewhere (upload, bulk
     * move, single move) may have changed folder counts.
     */
    refreshSignal?: number;
}

export default function FolderSidebar({
    selectedFolderId,
    onSelectFolder,
    refreshSignal,
}: FolderSidebarProps) {
    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");

    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [reassignToId, setReassignToId] = useState<string>("");

    const fetchFolders = useCallback(async () => {
        setIsLoading(true);

        try {
            const res = await fetch("/api/folders");

            if (!res.ok) {
                throw new Error("Failed to load folders");
            }

            const data = await res.json();
            setFolders(data.folders);
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to load folders"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFolders();
    }, [fetchFolders, refreshSignal]);

    async function handleCreate() {
        const name = newFolderName.trim();

        if (!name) return;

        setIsSaving(true);

        try {
            const res = await fetch("/api/folders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create folder");
            }

            toast.success(`Folder "${name}" created.`);
            setNewFolderName("");
            setIsCreating(false);
            await fetchFolders();
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to create folder"
            );
        } finally {
            setIsSaving(false);
        }
    }

    function startRename(folder: FolderItem) {
        setRenamingId(folder.id);
        setRenameValue(folder.name);
    }

    async function handleRename(id: string) {
        const name = renameValue.trim();

        if (!name) return;

        setIsSaving(true);

        try {
            const res = await fetch(`/api/folders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to rename folder");
            }

            toast.success("Folder renamed.");
            setRenamingId(null);
            await fetchFolders();
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to rename folder"
            );
        } finally {
            setIsSaving(false);
        }
    }

    function startDelete(folder: FolderItem) {
        setDeleteTargetId(folder.id);
        setReassignToId("");
    }

    async function handleDeleteConfirm(folder: FolderItem) {
        if (folder.mediaCount > 0 && !reassignToId) {
            toast.error("Choose a folder to move its media into first.");
            return;
        }

        setIsSaving(true);

        try {
            const res = await fetch(`/api/folders/${folder.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    folder.mediaCount > 0
                        ? { reassignToId }
                        : {}
                ),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to delete folder");
            }

            toast.success(`Folder "${folder.name}" deleted.`);
            setDeleteTargetId(null);

            if (selectedFolderId === folder.id) {
                onSelectFolder(null);
            }

            await fetchFolders();
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to delete folder"
            );
        } finally {
            setIsSaving(false);
        }
    }

    const totalActive = folders.reduce(
        (sum, f) => sum + f.mediaCount,
        0
    );

    return (
        <div className="w-56 shrink-0 space-y-1">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Folders
                </h3>

                <button
                    type="button"
                    onClick={() => setIsCreating((v) => !v)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="New folder"
                >
                    <FolderPlus className="h-3.5 w-3.5" />
                </button>
            </div>

            {isCreating && (
                <div className="flex items-center gap-1 px-2 py-1">
                    <Input
                        autoFocus
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreate();
                            if (e.key === "Escape") {
                                setIsCreating(false);
                                setNewFolderName("");
                            }
                        }}
                        placeholder="Folder name"
                        className="h-7 text-xs"
                        disabled={isSaving}
                    />

                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={isSaving || !newFolderName.trim()}
                        className="rounded p-1 text-green-600 hover:bg-muted disabled:opacity-40"
                    >
                        <Check className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsCreating(false);
                            setNewFolderName("");
                        }}
                        className="rounded p-1 text-muted-foreground hover:bg-muted"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <button
                type="button"
                onClick={() => onSelectFolder(null)}
                className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                    selectedFolderId === null
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-foreground hover:bg-muted"
                )}
            >
                <span>All Media</span>

                <span className="text-xs text-muted-foreground">
                    {totalActive}
                </span>
            </button>

            {isLoading ? (
                <div className="flex justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="space-y-0.5">
                    {folders.map((folder) => (
                        <div key={folder.id} className="group">
                            {renamingId === folder.id ? (
                                <div className="flex items-center gap-1 px-2 py-1">
                                    <Input
                                        autoFocus
                                        value={renameValue}
                                        onChange={(e) =>
                                            setRenameValue(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                handleRename(folder.id);
                                            if (e.key === "Escape")
                                                setRenamingId(null);
                                        }}
                                        className="h-7 text-xs"
                                        disabled={isSaving}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleRename(folder.id)}
                                        disabled={isSaving}
                                        className="rounded p-1 text-green-600 hover:bg-muted"
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRenamingId(null)}
                                        className="rounded p-1 text-muted-foreground hover:bg-muted"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ) : deleteTargetId === folder.id ? (
                                <div className="space-y-1.5 rounded-md border bg-muted/40 p-2">
                                    <p className="text-[11px] text-muted-foreground">
                                        {folder.mediaCount > 0
                                            ? `Move ${folder.mediaCount} item(s) to:`
                                            : `Delete "${folder.name}"?`}
                                    </p>

                                    {folder.mediaCount > 0 && (
                                        <select
                                            value={reassignToId}
                                            onChange={(e) =>
                                                setReassignToId(e.target.value)
                                            }
                                            className="h-7 w-full rounded border bg-background px-1.5 text-xs"
                                        >
                                            <option value="">
                                                Select folder...
                                            </option>

                                            {folders
                                                .filter((f) => f.id !== folder.id)
                                                .map((f) => (
                                                    <option key={f.id} value={f.id}>
                                                        {f.name}
                                                    </option>
                                                ))}
                                        </select>
                                    )}

                                    <div className="flex gap-1.5">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="h-6 flex-1 text-[11px] text-red-600"
                                            disabled={isSaving}
                                            onClick={() =>
                                                handleDeleteConfirm(folder)
                                            }
                                        >
                                            Delete
                                        </Button>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="h-6 flex-1 text-[11px]"
                                            disabled={isSaving}
                                            onClick={() => setDeleteTargetId(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={cn(
                                        "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                                        selectedFolderId === folder.id
                                            ? "bg-primary/10 font-medium text-primary"
                                            : "text-foreground hover:bg-muted"
                                    )}
                                >
                                    <button
                                        type="button"
                                        onClick={() => onSelectFolder(folder.id)}
                                        className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                                    >
                                        <FolderIcon className="h-3.5 w-3.5 shrink-0" />

                                        <span className="truncate">
                                            {folder.name}
                                        </span>
                                    </button>

                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-muted-foreground">
                                            {folder.mediaCount}
                                        </span>

                                        {!folder.isProtected && (
                                            <div className="hidden items-center gap-0.5 group-hover:flex">
                                                <button
                                                    type="button"
                                                    onClick={() => startRename(folder)}
                                                    className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                                                    title="Rename"
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => startDelete(folder)}
                                                    className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}