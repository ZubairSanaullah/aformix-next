"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import DealKanbanColumn from "@/components/workspace/crm/deals/DealKanbanColumn";
import DealKanbanCard, { type KanbanDeal } from "@/components/workspace/crm/deals/DealKanbanCard";

interface KanbanStage {
    id: string;
    name: string;
    color: string | null;
    order: number;
}

interface DealKanbanBoardProps {
    stages: KanbanStage[];
    deals: KanbanDeal[];
}

export default function DealKanbanBoard({
    stages,
    deals: initialDeals,
}: DealKanbanBoardProps) {
    const router = useRouter();

    const [deals, setDeals] = useState<KanbanDeal[]>(initialDeals);
    const [activeDealId, setActiveDealId] = useState<string | null>(null);

    // Require a small drag distance before activating, so clicking
    // still works for the card's "view" link.
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        })
    );

    const activeDeal = deals.find(
        (deal) => deal.id === activeDealId
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveDealId(String(event.active.id));
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        setActiveDealId(null);

        if (!over) {
            return;
        }

        const dealId = String(active.id);
        const targetStageId = String(over.id);

        const deal = deals.find((item) => item.id === dealId);

        if (!deal || deal.stageId === targetStageId) {
            return;
        }

        const previousStageId = deal.stageId;

        // Optimistic update
        setDeals((current) =>
            current.map((item) =>
                item.id === dealId
                    ? { ...item, stageId: targetStageId }
                    : item
            )
        );

        try {
            const response = await fetch(
                `/api/crm/deals/${dealId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        stageId: targetStageId,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to move deal to the new stage."
                );
            }

            router.refresh();
        } catch (error) {
            console.error("Deal stage update failed:", error);

            // Revert on failure
            setDeals((current) =>
                current.map((item) =>
                    item.id === dealId
                        ? { ...item, stageId: previousStageId }
                        : item
                )
            );

            toast.error(
                "Couldn't move the deal. Please try again."
            );
        }
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4">
                {stages.map((stage) => (
                    <DealKanbanColumn
                        key={stage.id}
                        stageId={stage.id}
                        stageName={stage.name}
                        stageColor={stage.color}
                        deals={deals.filter(
                            (deal) => deal.stageId === stage.id
                        )}
                        activeDealId={activeDealId}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeDeal ? (
                    <DealKanbanCard deal={activeDeal} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}