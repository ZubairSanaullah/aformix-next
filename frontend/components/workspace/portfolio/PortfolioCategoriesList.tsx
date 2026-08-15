"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Pencil } from "lucide-react";
import { toast } from "sonner";

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
import WorkspaceBadge from "@/components/workspace/ui/WorkspaceBadge";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";

import PortfolioCategoryFormDialog from "./PortfolioCategoryFormDialog";
import ArchivePortfolioCategoryButton from "./ArchivePortfolioCategoryButton";
import RestorePortfolioCategoryButton from "./RestorePortfolioCategoryButton";
import DeletePortfolioCategoryButton from "./DeletePortfolioCategoryButton";

import {
    updatePortfolioCategoryRequest,
    type PortfolioCategoryItem,
} from "@/lib/api/portfolio";

interface PortfolioCategoriesListProps {
    initialCategories: PortfolioCategoryItem[];
}

export default function PortfolioCategoriesList({
    initialCategories,
}: PortfolioCategoriesListProps) {
    const router = useRouter();
    const [categories, setCategories] = useState(initialCategories);
    const [isSavingOrder, startTransition] = useTransition();

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        }),
    );

    // Reordering only makes sense among active (non-archived) categories
    // sorted by sortOrder; archived ones shown via "Show archived" stay
    // fixed at the bottom and aren't draggable.
    const activeCategories = categories.filter((c) => !c.deletedAt);
    const archivedCategories = categories.filter((c) => c.deletedAt);
    const isReorderable =
        activeCategories.length > 1 &&
        !archivedCategories.some((c) => categories.indexOf(c) === -1); // no-op guard, kept simple

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = activeCategories.findIndex((c) => c.id === active.id);
        const newIndex = activeCategories.findIndex((c) => c.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(activeCategories, oldIndex, newIndex);

        // Optimistic update
        setCategories([...reordered, ...archivedCategories]);

        const updates = reordered.map((category, index) => ({
            id: category.id,
            sortOrder: index,
        }));

        const changed = updates.filter(
            (update, index) => activeCategories[index]?.sortOrder !== update.sortOrder,
        );

        startTransition(async () => {
            try {
                await Promise.all(
                    changed.map((update) =>
                        updatePortfolioCategoryRequest(update.id, {
                            sortOrder: update.sortOrder,
                        }),
                    ),
                );

                toast.success("Category order updated.");
                router.refresh();
            } catch (error) {
                console.error(error);
                toast.error("Failed to save the new order.");
                setCategories(initialCategories);
            }
        });
    }

    if (categories.length === 0) {
        return (
            <WorkspaceEmptyState
                title="No categories yet"
                description="Create a category to start organizing portfolio projects."
            />
        );
    }

    return (
        <div className="space-y-6">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={activeCategories.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {activeCategories.map((category) => (
                            <SortableCategoryRow
                                key={category.id}
                                category={category}
                                disabled={!isReorderable || isSavingOrder}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {archivedCategories.length > 0 && (
                <div className="space-y-2">
                    <p className="px-1 text-[10px] font-medium uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                        Archived
                    </p>

                    {archivedCategories.map((category) => (
                        <CategoryRow
                            key={category.id}
                            category={category}
                            dragHandle={null}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function SortableCategoryRow({
    category,
    disabled,
}: {
    category: PortfolioCategoryItem;
    disabled: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: category.id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <CategoryRow
                category={category}
                dragHandle={
                    <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        disabled={disabled}
                        className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-lg text-[var(--workspace-text-subtle)] hover:bg-[var(--workspace-background)] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Reorder ${category.name}`}
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                }
            />
        </div>
    );
}

function CategoryRow({
    category,
    dragHandle,
}: {
    category: PortfolioCategoryItem;
    dragHandle: React.ReactNode;
}) {
    const isArchived = Boolean(category.deletedAt);

    return (
        <WorkspaceCard padding="sm">
            <div className="flex items-center gap-3">
                {dragHandle}

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-semibold text-[var(--workspace-text)]">
                            {category.name}
                        </p>

                        {isArchived && (
                            <WorkspaceBadge variant="default">Archived</WorkspaceBadge>
                        )}
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-[10px] text-[var(--workspace-text-subtle)]">
                        <span className="truncate">{category.slug}</span>
                        <span>
                            {category.projectCount ?? 0}{" "}
                            {(category.projectCount ?? 0) === 1 ? "project" : "projects"}
                        </span>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                    {!isArchived && (
                        <PortfolioCategoryFormDialog
                            mode="edit"
                            category={category}
                            trigger={
                                <button
                                    type="button"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--workspace-border)] text-[var(--workspace-text-muted)] transition-colors hover:border-[var(--workspace-primary)]/30 hover:bg-[var(--workspace-primary-soft)] hover:text-[var(--workspace-primary)]"
                                    title="Edit category"
                                    aria-label="Edit category"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            }
                        />
                    )}

                    {isArchived ? (
                        <RestorePortfolioCategoryButton categoryId={category.id} />
                    ) : (
                        <ArchivePortfolioCategoryButton categoryId={category.id} />
                    )}

                    <DeletePortfolioCategoryButton
                        categoryId={category.id}
                        categoryName={category.name}
                    />
                </div>
            </div>
        </WorkspaceCard>
    );
}