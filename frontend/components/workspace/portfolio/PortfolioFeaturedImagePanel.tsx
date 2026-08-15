"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Trash2 } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import MediaPickerDialog from "@/components/workspace/media/MediaPickerDialog";
import type { MediaItem } from "@/components/workspace/media/MediaCard";
import type { GalleryImage } from "./PortfolioGalleryPanel";

interface PortfolioFeaturedImagePanelProps {
    gallery: GalleryImage[];
    onChange: (gallery: GalleryImage[]) => void;
}

export default function PortfolioFeaturedImagePanel({
    gallery,
    onChange,
}: PortfolioFeaturedImagePanelProps) {
    const [pickerOpen, setPickerOpen] = useState(false);

    const primary = gallery.find((image) => image.isPrimary) ?? gallery[0] ?? null;

    function handleSelect(media: MediaItem) {
        const existing = gallery.find((image) => image.media.id === media.id);

        if (existing) {
            onChange(
                gallery.map((image) => ({
                    ...image,
                    isPrimary: image.key === existing.key,
                })),
            );
            return;
        }

        const newImage: GalleryImage = {
            key: `${media.id}-${Date.now()}`,
            media,
            isPrimary: true,
            caption: "",
        };

        onChange([
            newImage,
            ...gallery.map((image) => ({ ...image, isPrimary: false })),
        ]);
    }

    function handleRemove() {
        if (!primary) return;

        const next = gallery.filter((image) => image.key !== primary.key);

        if (next.length > 0) {
            next[0] = { ...next[0], isPrimary: true };
        }

        onChange(next);
    }

    return (
        <WorkspaceCard padding="lg" className="space-y-5">
            <div>
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Featured Image
                </h2>
                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    The primary image shown in listings and previews. This is
                    the starred image in your Project Gallery below.
                </p>
            </div>

            {primary ? (
                <div className="space-y-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface-soft)]">
                        <Image
                            src={primary.media.url}
                            alt={primary.media.alt ?? "Featured image"}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex gap-2">
                        <WorkspaceButton
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setPickerOpen(true)}
                        >
                            Change Image
                        </WorkspaceButton>

                        <WorkspaceButton
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemove}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </WorkspaceButton>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[var(--workspace-border)] bg-[var(--workspace-surface-soft)] px-6 py-10 text-center transition hover:border-[var(--workspace-primary)]/40 hover:bg-[var(--workspace-primary-soft)]/30"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                        <ImageIcon className="h-4 w-4" />
                    </div>
                    <span className="mt-3 text-xs font-medium text-[var(--workspace-text)]">
                        Choose from media library
                    </span>
                </button>
            )}

            <MediaPickerDialog
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleSelect}
            />
        </WorkspaceCard>
    );
}