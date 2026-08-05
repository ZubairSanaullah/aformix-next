"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { UploadDropzone } from "@/components/workspace/media/UploadDropzone";
import MediaGrid from "@/components/workspace/media/MediaGrid";
import { MediaItem } from "@/components/workspace/media/MediaCard";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface MediaPickerDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (media: MediaItem) => void;
}

export default function MediaPickerDialog({
    open,
    onClose,
    onSelect,
}: MediaPickerDialogProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [selected, setSelected] = useState<MediaItem | null>(null);

    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebouncedValue(searchInput, 350);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            if (debouncedSearch.trim()) {
                params.set("q", debouncedSearch.trim());
            }

            const res = await fetch(
                `/api/media?${params.toString()}`
            );

            if (!res.ok) {
                throw new Error("Failed to load media");
            }

            const data: MediaItem[] = await res.json();

            setMedia(data);

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load media"
            );
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);


    useEffect(() => {
        if (!open) return;

        fetchMedia();
        setSelected(null);

    }, [open, fetchMedia]);


    const handleUploadComplete = useCallback(
        async () => {
            await fetchMedia();
        },
        [fetchMedia]
    );


    if (!open) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

            <div className="
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
            ">

                {/* Header */}
                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    px-6
                    py-4
                ">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Select Media
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Choose an image from your library.
                        </p>
                    </div>


                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-muted"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>


                {/* Upload */}
                <div className="border-b bg-muted/20 p-6">
                    <UploadDropzone
                        onUploadComplete={handleUploadComplete}
                    />
                </div>


                {/* Search */}
                <div className="border-b px-6 py-4">

                    <div className="relative">

                        <Search className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-muted-foreground
                        "/>

                        <Input
                            value={searchInput}
                            onChange={(e) =>
                                setSearchInput(e.target.value)
                            }
                            placeholder="Search media..."
                            className="pl-9 pr-9"
                        />


                        {searchInput && (
                            <button
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

                </div>


                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {isLoading ? (
                        <div className="
                            flex
                            justify-center
                            py-20
                        ">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>

                    ) : (

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
                            selectedId={selected?.id ?? null}

                            onSelect={(item) =>
                                setSelected(item)
                            }
                        />

                    )}

                </div>


                {/* Footer */}
                <div className="
                    flex
                    justify-end
                    gap-3
                    border-t
                    px-6
                    py-4
                ">

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