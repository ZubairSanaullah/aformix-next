"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface KBSearchBarProps {
    compact?: boolean;
}

export default function KBSearchBar({ compact = false }: KBSearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [value, setValue] = useState(searchParams.get("search") ?? "");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmed = value.trim();
        const params = new URLSearchParams();

        if (trimmed) {
            params.set("search", trimmed);
        }

        router.push(`/kb${params.toString() ? `?${params.toString()}` : ""}`);
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />

            <input
                type="search"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={
                    compact
                        ? "Search docs..."
                        : "Search articles, guides, and FAQs..."
                }
                className={`input-field pl-11 ${
                    compact ? "py-2.5 text-sm" : "py-4 text-base"
                }`}
            />
        </form>
    );
}
