"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
    icon: LucideIcon;
    title: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    size?: "sm" | "md";
}

export default function ToolbarButton({
    icon: Icon,
    title,
    active = false,
    disabled = false,
    onClick,
    size = "md",
}: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant={active ? "default" : "ghost"}
            size="icon"
            disabled={disabled}
            title={title}
            onClick={onClick}
            className={cn(
                "rounded-lg transition-all",
                size === "md"
                    ? "h-9 w-9"
                    : "h-8 w-8",
                active && "shadow-sm"
            )}
        >
            <Icon
                className={cn(
                    size === "md"
                        ? "h-4 w-4"
                        : "h-3.5 w-3.5"
                )}
            />
        </Button>
    );
}