"use client";

import { useState } from "react";
import Image from "next/image";
import { GripVertical, Plus, Star, Trash2 } from "lucide-react";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import MediaPickerDialog from "@/components/workspace/media/MediaPickerDialog";
import type { MediaItem } from "@/components/workspace/media/MediaCard";

export interface GalleryImage {
    key: string; // local key, distinct from mediaId to allow dupes-safe DnD
    media: MediaItem;
    isPrimary: boolean;
    caption: string;
}

interface PortfolioGalleryPanelProps {
    value: GalleryImage[];
    onChange: (images: GalleryImage[]) => void;
}

export default function PortfolioGalleryPanel({
    value,
    onChange,
}: PortfolioGalleryPanelProps) {
    const [pickerOpen, setPickerOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    );

    function handleAdd(media: MediaItem) {
        if (value.some((image) => image.media.id === media.id)) {
            return; // already in the gallery
        }

        onChange([
            ...value,
            {
                key: `${media.id}-${Date.now()}`,
                media,
                isPrimary: value.length === 0,
                caption: "",
            },
        ]);
    }

    function handleRemove(key: string) {
        const next = value.filter((image) => image.key !== key);

        // If we removed the primary image, promote the new first item.
        if (next.length > 0 && !next.some((image) => image.isPrimary)) {
            next[0] = { ...next[0], isPrimary: true };
        }

        onChange(next);
    }

    function handleSetPrimary(key: string) {
        onChange(
            value.map((image) => ({
                ...image,
                isPrimary: image.key === key,
            })),
        );
    }

    function handleCaptionChange(key: string, caption: string) {
        onChange(
            value.map((image) =>
                image.key === key ? { ...image, caption } : image,
            ),
        );
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = value.findIndex((image) => image.key === active.id);
        const newIndex = value.findIndex((image) => image.key === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        onChange(arrayMove(value, oldIndex, newIndex));
    }

    return (
        <WorkspaceCard padding="lg" className="space-y-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Project Gallery
                    </h2>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Add images from your media library. Drag to reorder,
                        star to set the primary gallery image.
                    </p>
                </div>

                <WorkspaceButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                >
                    <Plus className="h-3.5 w-3.5" />
                    Add Image
                </WorkspaceButton>
            </div>

            {value.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={value.map((image) => image.key)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {value.map((image) => (
                                <SortableGalleryRow
                                    key={image.key}
                                    image={image}
                                    onRemove={() => handleRemove(image.key)}
                                    onSetPrimary={() => handleSetPrimary(image.key)}
                                    onCaptionChange={(caption) =>
                                        handleCaptionChange(image.key, caption)
                                    }
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <MediaPickerDialog
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleAdd}
            />
        </WorkspaceCard>
    );
}

function SortableGalleryRow({
    image,
    onRemove,
    onSetPrimary,
    onCaptionChange,
}: {
    image: GalleryImage;
    onRemove: () => void;
    onSetPrimary: () => void;
    onCaptionChange: (caption: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: image.key });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-2.5"
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-[var(--workspace-text-subtle)] hover:bg-[var(--workspace-background)] active:cursor-grabbing"
                aria-label="Reorder image"
            >
                <GripVertical className="h-4 w-4" />
            </button>

            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--workspace-border)]">
                <Image
                    src={image.media.url}
                    alt={image.media.alt ?? ""}
                    fill
                    className="object-cover"
                />
            </div>

            <input
                type="text"
                value={image.caption}
                onChange={(event) => onCaptionChange(event.target.value)}
                placeholder="Optional caption..."
                className="h-9 flex-1 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-xs text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10"
            />

            <button
                type="button"
                onClick={onSetPrimary}
                title={image.isPrimary ? "Primary image" : "Set as primary"}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
                    image.isPrimary
                        ? "border-amber-300 bg-amber-50 text-amber-500"
                        : "border-[var(--workspace-border)] text-[var(--workspace-text-subtle)] hover:text-amber-500"
                }`}
            >
                <Star className={`h-4 w-4 ${image.isPrimary ? "fill-amber-400" : ""}`} />
            </button>

            <button
                type="button"
                onClick={onRemove}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--workspace-border)] text-red-500 hover:bg-red-50"
                aria-label="Remove image"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}
