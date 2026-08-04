"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { cn } from "@/lib/utils";

import { slashItems } from "./items";
import type { SlashItem } from "./types";

export interface SlashCommandListRef {
    onKeyDown: (event: KeyboardEvent) => boolean;
}

interface Props {
    items: SlashItem[];
    command: (item: SlashItem) => void;
}

const SlashCommandList = forwardRef<SlashCommandListRef, Props>(
    ({ items, command }, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0);

        useEffect(() => {
            setSelectedIndex(0);
        }, [items]);

        function selectItem(index: number) {
            const item = items[index];

            if (!item) return;

            command(item);
        }

        useImperativeHandle(ref, () => ({
            onKeyDown: (event: KeyboardEvent) => {
                switch (event.key) {
                    case "ArrowUp":
                        event.preventDefault();

                        setSelectedIndex((selectedIndex + items.length - 1) % items.length);

                        return true;

                    case "ArrowDown":
                        event.preventDefault();

                        setSelectedIndex((selectedIndex + 1) % items.length);

                        return true;

                    case "Enter":
                        event.preventDefault();

                        selectItem(selectedIndex);

                        return true;

                    default:
                        return false;
                }
            },
        }));

        if (items.length === 0) {
            return (
                <div className="rounded-xl border bg-popover p-3 text-sm text-muted-foreground shadow-xl">
                    No results found.
                </div>
            );
        }

        return (
            <div className="w-80 overflow-hidden rounded-xl border bg-popover p-2 shadow-xl">
                {items.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.title}
                            type="button"
                            onClick={() => selectItem(index)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors",
                                index === selectedIndex
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent/60"
                            )}
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                <Icon className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="font-medium">
                                    {item.title}
                                </p>

                                <p className="truncate text-xs text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    }
);

SlashCommandList.displayName = "SlashCommandList";

export default SlashCommandList;