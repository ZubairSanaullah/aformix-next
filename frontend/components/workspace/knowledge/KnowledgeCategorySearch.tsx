"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { WorkspaceInput } from "@/components/workspace/ui";

export default function KnowledgeCategorySearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    const includeDeleted = searchParams.get("includeDeleted") === "true";

    useEffect(() => {
        setSearch(searchParams.get("search") ?? "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.get("search")]);

    function pushParams(next: Record<string, string>) {
        const params = new URLSearchParams(searchParams.toString());

        for (const [key, value] of Object.entries(next)) {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        }

        params.delete("page");

        router.push(`${pathname}?${params.toString()}`);
    }

    useEffect(() => {
        const currentValue = searchParams.get("search") ?? "";

        if (search === currentValue) {
            return;
        }

        const timeout = setTimeout(() => {
            pushParams({ search });
        }, 400);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--workspace-text-subtle)]" />

                <WorkspaceInput
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search categories by name, slug, or description..."
                    className="pl-9"
                />
            </div>

            <label className="flex select-none items-center gap-2 text-xs font-medium text-[var(--workspace-text-muted)]">
                <input
                    type="checkbox"
                    checked={includeDeleted}
                    onChange={(event) =>
                        pushParams({
                            includeDeleted: event.target.checked
                                ? "true"
                                : "",
                        })
                    }
                    className="h-3.5 w-3.5 rounded border-[var(--workspace-border-strong)] text-[var(--workspace-primary)] focus:ring-[var(--workspace-primary)]/30"
                />
                Show archived categories
            </label>
        </div>
    );
}
