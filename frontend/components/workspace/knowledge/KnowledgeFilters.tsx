"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { WorkspaceInput, WorkspaceSelect } from "@/components/workspace/ui";

import type { KnowledgeCategorySummary } from "./types";

interface KnowledgeFiltersProps {
    categories: KnowledgeCategorySummary[];
}

export default function KnowledgeFilters({
    categories,
}: KnowledgeFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [, startTransition] = useTransition();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    // Keep the box in sync if params change elsewhere (e.g. pagination reset)
    useEffect(() => {
        setSearch(searchParams.get("search") ?? "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.get("search")]);

    const updateParam = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }

            // Any filter change resets pagination back to page 1
            params.delete("page");

            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
            });
        },
        [pathname, router, searchParams]
    );

    // Debounce the search box so we don't push a route change per keystroke
    useEffect(() => {
        const currentValue = searchParams.get("search") ?? "";

        if (search === currentValue) {
            return;
        }

        const timeout = setTimeout(() => {
            updateParam("search", search);
        }, 400);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--workspace-text-subtle)]" />

                <WorkspaceInput
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search articles by title, slug, or content..."
                    className="pl-9"
                />
            </div>

            <WorkspaceSelect
                value={searchParams.get("status") ?? ""}
                onChange={(event) => updateParam("status", event.target.value)}
                className="sm:w-40"
            >
                <option value="">All statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
            </WorkspaceSelect>

            <WorkspaceSelect
                value={searchParams.get("categoryId") ?? ""}
                onChange={(event) =>
                    updateParam("categoryId", event.target.value)
                }
                className="sm:w-48"
            >
                <option value="">All categories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </WorkspaceSelect>

            <WorkspaceSelect
                value={searchParams.get("visibility") ?? ""}
                onChange={(event) =>
                    updateParam("visibility", event.target.value)
                }
                className="sm:w-36"
            >
                <option value="">All visibility</option>
                <option value="INTERNAL">Internal</option>
                <option value="PUBLIC">Public</option>
            </WorkspaceSelect>

            <WorkspaceSelect
                value={searchParams.get("featured") ?? ""}
                onChange={(event) =>
                    updateParam("featured", event.target.value)
                }
                className="sm:w-36"
            >
                <option value="">All articles</option>
                <option value="true">Featured only</option>
                <option value="false">Not featured</option>
            </WorkspaceSelect>
        </div>
    );
}
