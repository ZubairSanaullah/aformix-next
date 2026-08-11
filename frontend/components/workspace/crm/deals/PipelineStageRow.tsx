"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Check, X } from "lucide-react";

export interface ManagedStage {
    id: string;
    name: string;
    color: string | null;
    order: number;
}

interface PipelineStageRowProps {
    stage: ManagedStage;
    onRename: (id: string, name: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function PipelineStageRow({
    stage,
    onRename,
    onDelete,
}: PipelineStageRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: stage.id });

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(stage.name);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    async function handleSave() {
        if (!name.trim() || name === stage.name) {
            setIsEditing(false);
            setName(stage.name);
            return;
        }

        setIsSaving(true);

        try {
            await onRename(stage.id, name.trim());
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        setIsDeleting(true);

        try {
            await onDelete(stage.id);
        } finally {
            setIsDeleting(false);
            setConfirmingDelete(false);
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 ${isDragging ? "opacity-50" : ""
                }`}
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                aria-label="Drag to reorder"
                className="cursor-grab text-[var(--workspace-text-subtle)] hover:text-[var(--workspace-text-muted)] active:cursor-grabbing"
            >
                <GripVertical className="h-4 w-4" />
            </button>

            <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                    backgroundColor: stage.color ?? "var(--workspace-primary)",
                }}
            />

            {isEditing ? (
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={isSaving}
                    autoFocus
                    className="h-8 flex-1 rounded-md border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-2 text-xs text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                />
            ) : (
                <span className="flex-1 text-xs font-medium text-[var(--workspace-text)]">
                    {stage.name}
                </span>
            )}

            {confirmingDelete ? (
                <div className="flex items-center gap-2 text-[11px] text-[var(--workspace-text-muted)]">
                    Delete stage?
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="font-medium text-red-600 hover:text-red-700"
                    >
                        {isDeleting ? "..." : "Yes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmingDelete(false)}
                        disabled={isDeleting}
                        className="hover:text-[var(--workspace-text)]"
                    >
                        No
                    </button>
                </div>
            ) : isEditing ? (
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        aria-label="Save stage name"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-primary)] hover:bg-[var(--workspace-primary-soft)]"
                    >
                        <Check className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsEditing(false);
                            setName(stage.name);
                        }}
                        disabled={isSaving}
                        aria-label="Cancel"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] hover:bg-[var(--workspace-background)]"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        aria-label={`Rename ${stage.name}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setConfirmingDelete(true)}
                        aria-label={`Delete ${stage.name}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}