"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import PipelineStageRow, {
    type ManagedStage,
} from "@/components/workspace/crm/deals/PipelineStageRow";

interface PipelineStageManagerProps {
    pipelineId: string;
    initialStages: ManagedStage[];
}

export default function PipelineStageManager({
    pipelineId,
    initialStages,
}: PipelineStageManagerProps) {
    const router = useRouter();

    const [stages, setStages] = useState<ManagedStage[]>(
        [...initialStages].sort((a, b) => a.order - b.order)
    );

    const [isAddingStage, setIsAddingStage] = useState(false);
    const [newStageName, setNewStageName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = stages.findIndex((s) => s.id === active.id);
        const newIndex = stages.findIndex((s) => s.id === over.id);

        const reordered = arrayMove(stages, oldIndex, newIndex).map(
            (stage, index) => ({ ...stage, order: index })
        );

        const previousStages = stages;
        setStages(reordered);

        try {
            const response = await fetch("/api/crm/stages/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    updates: reordered.map((stage) => ({
                        id: stage.id,
                        order: stage.order,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save new stage order.");
            }

            router.refresh();
        } catch (error) {
            console.error("Stage reorder failed:", error);
            setStages(previousStages);
            toast.error("Couldn't save the new stage order.");
        }
    }

    async function handleRename(id: string, name: string) {
        const previousStages = stages;

        setStages((current) =>
            current.map((stage) =>
                stage.id === id ? { ...stage, name } : stage
            )
        );

        try {
            const response = await fetch(`/api/crm/stages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                throw new Error("Failed to rename stage.");
            }

            toast.success("Stage renamed.");
            router.refresh();
        } catch (error) {
            console.error("Stage rename failed:", error);
            setStages(previousStages);
            toast.error("Couldn't rename the stage.");
        }
    }

    async function handleDelete(id: string) {
        const previousStages = stages;

        setStages((current) => current.filter((stage) => stage.id !== id));

        try {
            const response = await fetch(`/api/crm/stages/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error || "Failed to delete stage."
                );
            }

            toast.success("Stage deleted.");
            router.refresh();
        } catch (error) {
            console.error("Stage deletion failed:", error);
            setStages(previousStages);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Couldn't delete the stage."
            );
        }
    }

    async function handleCreateStage() {
        if (!newStageName.trim()) {
            return;
        }

        setIsCreating(true);

        try {
            const response = await fetch("/api/crm/stages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newStageName.trim(),
                    order: stages.length,
                    pipelineId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error || "Failed to create stage."
                );
            }

            setStages((current) => [...current, data]);
            setNewStageName("");
            setIsAddingStage(false);
            toast.success("Stage created.");
            router.refresh();
        } catch (error) {
            console.error("Stage creation failed:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Couldn't create the stage."
            );
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="space-y-3">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={stages.map((stage) => stage.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {stages.map((stage) => (
                            <PipelineStageRow
                                key={stage.id}
                                stage={stage}
                                onRename={handleRename}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {stages.length === 0 && !isAddingStage && (
                <p className="px-1 text-xs text-[var(--workspace-text-subtle)]">
                    No stages yet. Add one to get started.
                </p>
            )}

            {isAddingStage ? (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--workspace-border)] px-3 py-2.5">
                    <input
                        type="text"
                        value={newStageName}
                        onChange={(event) =>
                            setNewStageName(event.target.value)
                        }
                        placeholder="Stage name"
                        autoFocus
                        disabled={isCreating}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleCreateStage();
                            }
                        }}
                        className="h-8 flex-1 rounded-md border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-2 text-xs text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                    />

                    <button
                        type="button"
                        onClick={handleCreateStage}
                        disabled={isCreating || !newStageName.trim()}
                        className="rounded-md bg-[var(--workspace-primary)] px-2.5 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"
                    >
                        {isCreating ? "Adding..." : "Add"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingStage(false);
                            setNewStageName("");
                        }}
                        disabled={isCreating}
                        className="text-[11px] text-[var(--workspace-text-muted)] hover:text-[var(--workspace-text)]"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsAddingStage(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--workspace-border)] px-3 py-2 text-xs font-medium text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Add stage
                </button>
            )}
        </div>
    );
}