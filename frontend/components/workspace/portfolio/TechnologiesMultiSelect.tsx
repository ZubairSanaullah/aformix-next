"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import {
    fetchPortfolioTechnologies,
    createPortfolioTechnologyRequest,
    type PortfolioTechnologyItem,
} from "@/lib/api/portfolio";

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

interface TechnologiesMultiSelectProps {
    value: string[]; // technology IDs
    onChange: (ids: string[]) => void;
}

export default function TechnologiesMultiSelect({
    value,
    onChange,
}: TechnologiesMultiSelectProps) {
    const [options, setOptions] = useState<PortfolioTechnologyItem[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        let cancelled = false;

        fetchPortfolioTechnologies()
            .then((technologies) => {
                if (!cancelled) setOptions(technologies);
            })
            .catch((error) => {
                console.error(error);
                if (!cancelled) toast.error("Failed to load technologies.");
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const selected = options.filter((option) => value.includes(option.id));
    const filtered = options.filter(
        (option) =>
            !value.includes(option.id) &&
            option.name.toLowerCase().includes(inputValue.trim().toLowerCase()),
    );

    const exactMatch = options.some(
        (option) => option.name.toLowerCase() === inputValue.trim().toLowerCase(),
    );

    async function handleCreate() {
        const name = inputValue.trim();
        if (!name) return;

        setIsCreating(true);

        try {
            const technology = await createPortfolioTechnologyRequest({
                name,
                slug: slugify(name),
            });

            setOptions((current) => [...current, technology]);
            onChange([...value, technology.id]);
            setInputValue("");
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create technology.",
            );
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="space-y-2.5">
            <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-2.5">
                {selected.map((tech) => (
                    <span
                        key={tech.id}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--workspace-primary)]/30 bg-[var(--workspace-primary-soft)] px-2 py-1 text-[10px] font-medium text-[var(--workspace-primary)]"
                    >
                        {tech.name}
                        <button
                            type="button"
                            onClick={() =>
                                onChange(value.filter((id) => id !== tech.id))
                            }
                            aria-label={`Remove ${tech.name}`}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}

                {selected.length === 0 && !isLoading && (
                    <span className="text-xs text-[var(--workspace-text-subtle)]">
                        No technologies selected
                    </span>
                )}
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Search or add a technology..."
                    className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-sm text-[var(--workspace-text)] outline-none transition focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10"
                />

                {inputValue.trim() && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] shadow-lg">
                        {filtered.slice(0, 8).map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                    onChange([...value, option.id]);
                                    setInputValue("");
                                }}
                                className="flex w-full items-center px-3 py-2 text-left text-xs text-[var(--workspace-text)] hover:bg-[var(--workspace-primary-soft)]"
                            >
                                {option.name}
                            </button>
                        ))}

                        {!exactMatch && (
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={isCreating}
                                className="flex w-full items-center gap-1.5 border-t border-[var(--workspace-border)] px-3 py-2 text-left text-xs font-medium text-[var(--workspace-primary)] hover:bg-[var(--workspace-primary-soft)] disabled:opacity-60"
                            >
                                <Plus className="h-3 w-3" />
                                {isCreating
                                    ? "Creating..."
                                    : `Create "${inputValue.trim()}"`}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}