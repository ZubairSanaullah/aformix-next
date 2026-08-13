"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Search,
    User,
    Building2,
    Target,
    BriefcaseBusiness,
    CalendarDays,
    StickyNote,
    Loader2,
    X,
} from "lucide-react";

import type {
    SearchResult,
    SearchResultType,
} from "@/lib/services/search";

const typeConfig: Record<
    SearchResultType,
    { label: string; icon: typeof User }
> = {
    contact: { label: "Contacts", icon: User },
    company: { label: "Companies", icon: Building2 },
    lead: { label: "Leads", icon: Target },
    deal: { label: "Deals", icon: BriefcaseBusiness },
    activity: { label: "Activities", icon: CalendarDays },
    note: { label: "Notes", icon: StickyNote },
};

const typeOrder: SearchResultType[] = [
    "contact",
    "company",
    "lead",
    "deal",
    "activity",
    "note",
];

type ResultsByType = Record<SearchResultType, SearchResult[]>;

export default function GlobalSearchBar() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ResultsByType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Debounced fetch
    useEffect(() => {
        if (!query.trim()) {
            setResults(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const timeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/crm/search?q=${encodeURIComponent(
                        query
                    )}&limit=5`
                );

                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                }
            } catch (error) {
                console.error("Global search failed:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!query.trim()) return;

        setIsOpen(false);
        router.push(
            `/workspace/crm/search?q=${encodeURIComponent(query)}`
        );
    }

    function handleResultClick() {
        setIsOpen(false);
    }

    const totalResults = results
        ? Object.values(results).reduce(
            (sum, group) => sum + group.length,
            0
        )
        : 0;

    return (
        <div ref={containerRef} className="relative w-full max-w-xs">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--workspace-text-subtle)]" />

                    <input
                        type="text"
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => {
                            if (query.trim()) setIsOpen(true);
                        }}
                        placeholder="Search CRM..."
                        aria-label="Search CRM"
                        className="h-8 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] pl-8 pr-7 text-xs text-[var(--workspace-text)] outline-none placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setResults(null);
                                setIsOpen(false);
                            }}
                            aria-label="Clear search"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--workspace-text-subtle)] hover:text-[var(--workspace-text)]"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </form>

            {isOpen && query.trim() && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-96 overflow-y-auto rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] shadow-lg">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-6 text-xs text-[var(--workspace-text-muted)]">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Searching...
                        </div>
                    ) : totalResults === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-[var(--workspace-text-muted)]">
                            No results for &quot;{query}&quot;
                        </div>
                    ) : (
                        <div className="py-1">
                            {typeOrder.map((type) => {
                                const group = results?.[type] ?? [];

                                if (group.length === 0) return null;

                                const { label, icon: Icon } =
                                    typeConfig[type];

                                return (
                                    <div key={type} className="px-2 py-1.5">
                                        <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                                            {label}
                                        </p>

                                        {group.map((result) => (
                                            <Link
                                                key={result.id}
                                                href={result.href}
                                                onClick={handleResultClick}
                                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-[var(--workspace-background)]"
                                            >
                                                <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--workspace-text-muted)]" />

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-[var(--workspace-text)]">
                                                        {result.title}
                                                    </p>

                                                    {result.subtitle && (
                                                        <p className="truncate text-[10px] text-[var(--workspace-text-subtle)]">
                                                            {result.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                );
                            })}

                            <div className="border-t border-[var(--workspace-border)] px-2 pt-1.5">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-full rounded-md px-2 py-1.5 text-left text-xs font-medium text-[var(--workspace-primary)] hover:bg-[var(--workspace-primary-soft)]"
                                >
                                    View all results for &quot;{query}
                                    &quot;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}