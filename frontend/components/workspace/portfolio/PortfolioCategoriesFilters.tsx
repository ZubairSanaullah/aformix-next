"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import WorkspaceFilterBar from "@/components/workspace/ui/WorkspaceFilterBar";
import WorkspaceSearch from "@/components/workspace/ui/WorkspaceSearch";

export default function PortfolioCategoriesFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const showArchived = searchParams.get("includeDeleted") === "true";

    useEffect(() => {
        setSearch(searchParams.get("search") ?? "");
    }, [searchParams]);

    function updateParams(updates: Record<string, string>) {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        const query = params.toString();
        router.push(
            query
                ? `/workspace/portfolio/categories?${query}`
                : "/workspace/portfolio/categories",
        );
    }

    useEffect(() => {
        const currentSearch = searchParams.get("search") ?? "";

        if (search === currentSearch) {
            return;
        }

        const timeout = setTimeout(() => {
            updateParams({ search });
        }, 400);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const hasFilters = Boolean(search) || showArchived;

    return (
        <WorkspaceFilterBar
            showReset={hasFilters}
            onReset={() => {
                setSearch("");
                router.push("/workspace/portfolio/categories");
            }}
        >
            <WorkspaceSearch
                value={search}
                onChange={setSearch}
                placeholder="Search categories..."
                className="sm:w-72"
            />

            <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-xs text-[var(--workspace-text-muted)]">
                <input
                    type="checkbox"
                    checked={showArchived}
                    onChange={(event) =>
                        updateParams({
                            includeDeleted: event.target.checked ? "true" : "",
                        })
                    }
                    className="h-3.5 w-3.5 accent-[var(--workspace-primary)]"
                />
                Show archived
            </label>
        </WorkspaceFilterBar>
    );
}