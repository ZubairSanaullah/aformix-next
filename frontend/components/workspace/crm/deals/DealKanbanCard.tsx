"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { Building2, ExternalLink, User } from "lucide-react";

export interface KanbanDeal {
    id: string;
    title: string;
    value: unknown;
    stageId: string;
    contact: {
        firstName: string;
        lastName: string | null;
    } | null;
    company: {
        name: string;
    } | null;
}

interface DealKanbanCardProps {
    deal: KanbanDeal;
    isDragging?: boolean;
}

function formatValue(value: unknown) {
    if (value === null || value === undefined) {
        return null;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return null;
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(numericValue);
}

export default function DealKanbanCard({
    deal,
    isDragging,
}: DealKanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging: isActivelyDragging,
    } = useDraggable({
        id: deal.id,
        data: { deal },
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    const contactName = deal.contact
        ? [deal.contact.firstName, deal.contact.lastName]
            .filter(Boolean)
            .join(" ")
        : null;

    const formattedValue = formatValue(deal.value);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`group relative cursor-grab rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-3 shadow-sm transition-shadow active:cursor-grabbing ${isActivelyDragging || isDragging
                    ? "opacity-50 shadow-md"
                    : "hover:shadow-md"
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1 truncate text-xs font-semibold text-[var(--workspace-text)]">
                    {deal.title}
                </p>

                <Link
                    href={`/workspace/crm/deals/${deal.id}`}
                    onClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                    aria-label={`View ${deal.title}`}
                    title="View deal"
                    className="shrink-0 text-[var(--workspace-text-subtle)] opacity-0 transition-opacity hover:text-[var(--workspace-primary)] group-hover:opacity-100"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                </Link>
            </div>

            {formattedValue && (
                <p className="mt-1.5 text-xs font-semibold text-[var(--workspace-text)]">
                    {formattedValue}
                </p>
            )}

            {(contactName || deal.company) && (
                <div className="mt-2 space-y-1 border-t border-[var(--workspace-border)] pt-2">
                    {contactName && (
                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--workspace-text-muted)]">
                            <User className="h-3 w-3 shrink-0" />
                            <span className="truncate">{contactName}</span>
                        </div>
                    )}

                    {deal.company && (
                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--workspace-text-muted)]">
                            <Building2 className="h-3 w-3 shrink-0" />
                            <span className="truncate">{deal.company.name}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}