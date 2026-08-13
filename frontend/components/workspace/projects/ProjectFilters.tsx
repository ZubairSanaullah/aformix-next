"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { WorkspaceButton, WorkspaceCard } from "@/components/workspace/ui";

import {
    PROJECT_PRIORITY_OPTIONS,
    PROJECT_STATUS_OPTIONS,
} from "@/lib/utils/project-format";

interface ProjectFilterOwner {
    id: string;
    name: string | null;
    email: string;
}

interface ProjectFilterCompany {
    id: string;
    name: string;
}

interface ProjectFiltersProps {
    owners: ProjectFilterOwner[];
    companies: ProjectFilterCompany[];
}

const SORT_OPTIONS = [
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
    { value: "name", label: "Name" },
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
    { value: "progress", label: "Progress" },
] as const;

/**
 * Keeps Projects list state (search / filters / sort / page) in the URL —
 * see Phase 14.17 spec section 23 ("URL / State Handling"). Every filter
 * change replaces the query string and resets page=1; page itself is
 * advanced by ProjectPagination.
 */
export default function ProjectFilters({
    owners,
    companies,
}: ProjectFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    // Keep the local search box in sync if the URL changes elsewhere
    // (e.g. "Clear filters" from the empty state).
    useEffect(() => {
        setSearch(searchParams.get("search") ?? "");
    }, [searchParams]);

    const updateParams = useCallback(
        (updates: Record<string, string | undefined>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            });

            params.set("page", "1");

            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
            });
        },
        [pathname, router, searchParams]
    );

    function handleSearchSubmit(event: React.FormEvent) {
        event.preventDefault();
        updateParams({ search: search.trim() || undefined });
    }

    const status = searchParams.get("status") ?? "";
    const priority = searchParams.get("priority") ?? "";
    const ownerId = searchParams.get("ownerId") ?? "";
    const companyId = searchParams.get("companyId") ?? "";
    const sort = searchParams.get("sort") ?? "createdAt";
    const order = searchParams.get("order") ?? "desc";

    const hasActiveFilters =
        Boolean(status) ||
        Boolean(priority) ||
        Boolean(ownerId) ||
        Boolean(companyId) ||
        Boolean(searchParams.get("search"));

    function clearAll() {
        setSearch("");

        startTransition(() => {
            router.push(pathname);
        });
    }

    return (
        <WorkspaceCard padding="md">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex-1"
                    >
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--workspace-text-subtle)]" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search by name, slug, or description..."
                            className="w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] py-2.5 pl-9 pr-3 text-xs text-[var(--workspace-text)] outline-none transition-colors placeholder:text-[var(--workspace-text-subtle)] focus:border-[var(--workspace-primary)]"
                        />
                    </form>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                        <select
                            value={status}
                            onChange={(event) =>
                                updateParams({
                                    status: event.target.value || undefined,
                                })
                            }
                            className="rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2.5 py-2.5 text-xs text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                        >
                            <option value="">All Statuses</option>
                            {PROJECT_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={priority}
                            onChange={(event) =>
                                updateParams({
                                    priority: event.target.value || undefined,
                                })
                            }
                            className="rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2.5 py-2.5 text-xs text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                        >
                            <option value="">All Priorities</option>
                            {PROJECT_PRIORITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={ownerId}
                            onChange={(event) =>
                                updateParams({
                                    ownerId: event.target.value || undefined,
                                })
                            }
                            className="rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2.5 py-2.5 text-xs text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                        >
                            <option value="">All Owners</option>
                            {owners.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name ?? owner.email}
                                </option>
                            ))}
                        </select>

                        <select
                            value={companyId}
                            onChange={(event) =>
                                updateParams({
                                    companyId: event.target.value || undefined,
                                })
                            }
                            className="rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2.5 py-2.5 text-xs text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                        >
                            <option value="">All Companies</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--workspace-border)] pt-3">
                    <div className="flex items-center gap-2 text-[11px] text-[var(--workspace-text-muted)]">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Sort by
                        <select
                            value={sort}
                            onChange={(event) =>
                                updateParams({ sort: event.target.value })
                            }
                            className="rounded-md border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2 py-1.5 text-[11px] text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={order}
                            onChange={(event) =>
                                updateParams({ order: event.target.value })
                            }
                            className="rounded-md border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2 py-1.5 text-[11px] text-[var(--workspace-text)] outline-none focus:border-[var(--workspace-primary)]"
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>

                        {isPending && (
                            <span className="text-[var(--workspace-text-subtle)]">
                                Updating…
                            </span>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <WorkspaceButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearAll}
                        >
                            <X className="h-3.5 w-3.5" />
                            Clear filters
                        </WorkspaceButton>
                    )}
                </div>
            </div>
        </WorkspaceCard>
    );
}
