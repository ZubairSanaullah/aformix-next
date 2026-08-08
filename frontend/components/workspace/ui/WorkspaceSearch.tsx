"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface WorkspaceSearchProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function WorkspaceSearch({
    value,
    onChange,
    placeholder = "Search...",
    className,
}: WorkspaceSearchProps) {
    const [internalValue, setInternalValue] = useState("");

    const currentValue = value ?? internalValue;

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const nextValue = event.target.value;

        if (value === undefined) {
            setInternalValue(nextValue);
        }

        onChange?.(nextValue);
    };

    const clear = () => {
        if (value === undefined) {
            setInternalValue("");
        }

        onChange?.("");
    };

    return (
        <div
            className={cn(
                "relative flex h-9 w-full items-center sm:w-64",
                className
            )}
        >
            <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[var(--workspace-text-subtle)]" />

            <input
                value={currentValue}
                onChange={handleChange}
                placeholder={placeholder}
                aria-label={placeholder}
                className="
                    h-full
                    w-full
                    rounded-lg
                    border
                    border-[var(--workspace-border)]
                    bg-[var(--workspace-surface)]
                    pl-9
                    pr-8
                    text-xs
                    text-[var(--workspace-text)]
                    outline-none
                    transition-all
                    placeholder:text-[var(--workspace-text-subtle)]
                    focus:border-[var(--workspace-primary)]
                    focus:ring-2
                    focus:ring-[var(--workspace-primary)]/10
                "
            />

            {currentValue && (
                <button
                    type="button"
                    onClick={clear}
                    aria-label="Clear search"
                    className="absolute right-2.5 text-[var(--workspace-text-subtle)] transition-colors hover:text-[var(--workspace-text)]"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}