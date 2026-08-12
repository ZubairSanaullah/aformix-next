"use client";

import { useDroppable } from "@dnd-kit/core";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DroppableCellProps {
    id: string;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
}

export default function DroppableCell({
    id,
    children,
    className,
    style,
    onClick,
    ...rest
}: DroppableCellProps & Record<string, unknown>) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={cn(className, isOver && "bg-[var(--workspace-primary-soft)]")}
            {...rest}
        >
            {children}
        </div>
    );
}
