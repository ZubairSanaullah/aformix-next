"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X, Star } from "lucide-react";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

import PipelineStageManager from "@/components/workspace/crm/deals/PipelineStageManager";
import type { ManagedStage } from "@/components/workspace/crm/deals/PipelineStageRow";

interface ManagedPipeline {
    id: string;
    name: string;
    description: string | null;
    isDefault: boolean;
    stages: ManagedStage[];
}

interface PipelineManagerProps {
    initialPipelines: ManagedPipeline[];
}

export default function PipelineManager({
    initialPipelines,
}: PipelineManagerProps) {
    const router = useRouter();

    const [pipelines, setPipelines] = useState(initialPipelines);
    const [activeId, setActiveId] = useState(
        initialPipelines[0]?.id ?? null
    );

    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [saving, setSaving] = useState(false);

    const [confirmingDeleteId, setConfirmingDeleteId] = useState<
        string | null
    >(null);
    const [deleting, setDeleting] = useState(false);

    const activePipeline = pipelines.find((p) => p.id === activeId);

    async function handleCreatePipeline() {
        if (!newName.trim()) return;

        setCreating(true);

        try {
            const response = await fetch("/api/crm/pipelines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error || "Failed to create pipeline."
                );
            }

            setPipelines((current) => [
                ...current,
                { ...data, stages: [] },
            ]);
            setActiveId(data.id);
            setNewName("");
            setIsCreating(false);
            toast.success("Pipeline created.");
            router.refresh();
        } catch (error) {
            console.error("Pipeline creation failed:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Couldn't create the pipeline."
            );
        } finally {
            setCreating(false);
        }
    }

    async function handleRenamePipeline(id: string) {
        if (!editName.trim()) {
            setEditingId(null);
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(`/api/crm/pipelines/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName.trim() }),
            });

            if (!response.ok) {
                throw new Error("Failed to rename pipeline.");
            }

            setPipelines((current) =>
                current.map((p) =>
                    p.id === id ? { ...p, name: editName.trim() } : p
                )
            );
            setEditingId(null);
            toast.success("Pipeline renamed.");
            router.refresh();
        } catch (error) {
            console.error("Pipeline rename failed:", error);
            toast.error("Couldn't rename the pipeline.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeletePipeline(id: string) {
        setDeleting(true);

        try {
            const response = await fetch(`/api/crm/pipelines/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error || "Failed to delete pipeline."
                );
            }

            const remaining = pipelines.filter((p) => p.id !== id);
            setPipelines(remaining);

            if (activeId === id) {
                setActiveId(remaining[0]?.id ?? null);
            }

            toast.success("Pipeline deleted.");
            router.refresh();
        } catch (error) {
            console.error("Pipeline deletion failed:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Couldn't delete the pipeline."
            );
        } finally {
            setDeleting(false);
            setConfirmingDeleteId(null);
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Pipeline list */}
            <WorkspaceCard>
                <WorkspaceCardHeader
                    title="Pipelines"
                    description="Select a pipeline to manage its stages."
                />

                <div className="space-y-1.5 p-3">
                    {pipelines.map((pipeline) => (
                        <div
                            key={pipeline.id}
                            className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors ${pipeline.id === activeId
                                    ? "bg-[var(--workspace-primary-soft)]"
                                    : "hover:bg-[var(--workspace-background)]"
                                }`}
                        >
                            {editingId === pipeline.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(event) =>
                                            setEditName(event.target.value)
                                        }
                                        autoFocus
                                        disabled={saving}
                                        className="h-7 flex-1 rounded-md border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2 text-xs text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRenamePipeline(pipeline.id)
                                        }
                                        disabled={saving}
                                        aria-label="Save"
                                        className="text-[var(--workspace-primary)]"
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        disabled={saving}
                                        aria-label="Cancel"
                                        className="text-[var(--workspace-text-muted)]"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveId(pipeline.id)
                                        }
                                        className="flex flex-1 items-center gap-1.5 truncate text-left text-xs font-medium text-[var(--workspace-text)]"
                                    >
                                        {pipeline.isDefault && (
                                            <Star className="h-3 w-3 shrink-0 fill-[var(--workspace-primary)] text-[var(--workspace-primary)]" />
                                        )}
                                        <span className="truncate">
                                            {pipeline.name}
                                        </span>
                                    </button>

                                    {confirmingDeleteId === pipeline.id ? (
                                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--workspace-text-muted)]">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeletePipeline(
                                                        pipeline.id
                                                    )
                                                }
                                                disabled={deleting}
                                                className="font-medium text-red-600"
                                            >
                                                {deleting ? "..." : "Yes"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConfirmingDeleteId(
                                                        null
                                                    )
                                                }
                                                disabled={deleting}
                                            >
                                                No
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="hidden items-center gap-0.5 group-hover:flex">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(pipeline.id);
                                                    setEditName(pipeline.name);
                                                }}
                                                aria-label={`Rename ${pipeline.name}`}
                                                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--workspace-text-muted)] hover:text-[var(--workspace-text)]"
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConfirmingDeleteId(
                                                        pipeline.id
                                                    )
                                                }
                                                aria-label={`Delete ${pipeline.name}`}
                                                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}

                    {isCreating ? (
                        <div className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--workspace-border)] px-2.5 py-2">
                            <input
                                type="text"
                                value={newName}
                                onChange={(event) =>
                                    setNewName(event.target.value)
                                }
                                placeholder="Pipeline name"
                                autoFocus
                                disabled={creating}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleCreatePipeline();
                                    }
                                }}
                                className="h-7 flex-1 rounded-md border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2 text-xs text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                            />

                            <button
                                type="button"
                                onClick={handleCreatePipeline}
                                disabled={creating || !newName.trim()}
                                aria-label="Save"
                                className="text-[var(--workspace-primary)] disabled:opacity-50"
                            >
                                <Check className="h-3.5 w-3.5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewName("");
                                }}
                                disabled={creating}
                                aria-label="Cancel"
                                className="text-[var(--workspace-text-muted)]"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            New pipeline
                        </button>
                    )}
                </div>
            </WorkspaceCard>

            {/* Stage manager for active pipeline */}
            <WorkspaceCard>
                <WorkspaceCardHeader
                    title={
                        activePipeline
                            ? `${activePipeline.name} Stages`
                            : "Stages"
                    }
                    description="Drag to reorder. Deals move through stages in this order."
                />

                <div className="p-6">
                    {activePipeline ? (
                        <PipelineStageManager
                            pipelineId={activePipeline.id}
                            initialStages={activePipeline.stages}
                        />
                    ) : (
                        <p className="text-xs text-[var(--workspace-text-subtle)]">
                            Create a pipeline to manage its stages.
                        </p>
                    )}
                </div>
            </WorkspaceCard>
        </div>
    );
}