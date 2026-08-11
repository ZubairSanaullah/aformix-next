"use client";

import { useDroppable } from "@dnd-kit/core";

import DealKanbanCard, { type KanbanDeal } from "@/components/workspace/crm/deals/DealKanbanCard";

interface DealKanbanColumnProps {
    stageId: string;
    stageName: string;
    stageColor: string | null;
    deals: KanbanDeal[];
    activeDealId: string | null;
}

function formatColumnValue(deals: KanbanDeal[]) {
    const total = deals.reduce((sum, deal) => {
        const numeric = Number(deal.value);
        return Number.isNaN(numeric) ? sum : sum + numeric;
    }, 0);

    if (total === 0) {
        return null;
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(total);
}

export default function DealKanbanColumn({
    stageId,
    stageName,
    stageColor,
    deals,
    activeDealId,
}: DealKanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: stageId,
    });

    const columnTotal = formatColumnValue(deals);

    return (
        <div className="flex w-72 shrink-0 flex-col">
            <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                            backgroundColor: stageColor ?? "var(--workspace-primary)",
                        }}
                    />

                    <h3 className="text-xs font-semibold text-[var(--workspace-text)]">
                        {stageName}
                    </h3>

                    <span className="rounded-full bg-[var(--workspace-background)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--workspace-text-muted)]">
                        {deals.length}
                    </span>
                </div>
            </div>

            {columnTotal && (
                <p className="mb-2 px-1 text-[10px] text-[var(--workspace-text-subtle)]">
                    {columnTotal}
                </p>
            )}

            <div
                ref={setNodeRef}
                className={`flex min-h-[120px] flex-1 flex-col gap-2 rounded-xl border p-2 transition-colors ${isOver
                    ? "border-[var(--workspace-primary)] bg-[var(--workspace-primary-soft)]"
                    : "border-[var(--workspace-border)] bg-[var(--workspace-background)]"
                    }`}
            >
                {deals.length === 0 && !isOver && (
                    <div className="flex flex-1 items-center justify-center py-8 text-center text-[11px] text-[var(--workspace-text-subtle)]">
                        No deals in this stage
                    </div>
                )}

                {deals.map((deal) => (
                    <DealKanbanCard
                        key={deal.id}
                        deal={deal}
                        isDragging={deal.id === activeDealId}
                    />
                ))}
            </div>
        </div>
    );
}   