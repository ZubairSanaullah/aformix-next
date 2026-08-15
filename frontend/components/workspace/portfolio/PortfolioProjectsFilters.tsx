"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import WorkspaceFilterBar from "@/components/workspace/ui/WorkspaceFilterBar";
import WorkspaceSearch from "@/components/workspace/ui/WorkspaceSearch";

interface CategoryOption {
    id: string;
    name: string;
}

interface PortfolioProjectsFiltersProps {
    categories?: CategoryOption[];
}

const SORT_OPTIONS: {
    value: string;
    label: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
}[] = [
    { value: "", label: "Recently updated", sortBy: "updatedAt", sortOrder: "desc" },
    { value: "oldest-updated", label: "Oldest updated", sortBy: "updatedAt", sortOrder: "asc" },
    { value: "newest", label: "Newest created", sortBy: "createdAt", sortOrder: "desc" },
    { value: "oldest", label: "Oldest created", sortBy: "createdAt", sortOrder: "asc" },
    { value: "title-asc", label: "Title (A–Z)", sortBy: "title", sortOrder: "asc" },
    { value: "title-desc", label: "Title (Z–A)", sortBy: "title", sortOrder: "desc" },
    { value: "published", label: "Recently published", sortBy: "publishedAt", sortOrder: "desc" },
];

export default function PortfolioProjectsFilters({
    categories = [],
}: PortfolioProjectsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");

    useEffect(() => {
        setSearch(searchParams.get("search") ?? "");
    }, [searchParams]);

    function updateParams(
        updates: Record<string, string>,
        replace = false,
    ) {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        params.delete("page");

        const query = params.toString();
        const url = query
            ? `/workspace/portfolio?${query}`
            : "/workspace/portfolio";

        if (replace) {
            router.replace(url);
        } else {
            router.push(url);
        }
    }

    function resetFilters() {
        setSearch("");
        router.push("/workspace/portfolio");
    }

    useEffect(() => {
        const currentSearch = searchParams.get("search") ?? "";

        if (search === currentSearch) {
            return;
        }

        const timeout = setTimeout(() => {
            updateParams({ search }, true);
        }, 400);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const currentSortValue =
        SORT_OPTIONS.find(
            (option) =>
                option.sortBy === (searchParams.get("sortBy") ?? "updatedAt") &&
                option.sortOrder === (searchParams.get("sortOrder") ?? "desc"),
        )?.value ?? "";

    const hasFilters =
        Boolean(search) ||
        Boolean(searchParams.get("status")) ||
        Boolean(searchParams.get("categoryId")) ||
        Boolean(searchParams.get("visibility")) ||
        Boolean(searchParams.get("featured")) ||
        Boolean(currentSortValue);

    return (
        <WorkspaceFilterBar showReset={hasFilters} onReset={resetFilters}>
            <WorkspaceSearch
                value={search}
                onChange={setSearch}
                placeholder="Search projects..."
                className="sm:w-72"
            />

            <FilterSelect
                value={searchParams.get("status") ?? ""}
                onChange={(value) => updateParams({ status: value })}
                ariaLabel="Filter by status"
            >
                <option value="">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
            </FilterSelect>

            <FilterSelect
                value={searchParams.get("visibility") ?? ""}
                onChange={(value) => updateParams({ visibility: value })}
                ariaLabel="Filter by visibility"
            >
                <option value="">All Visibility</option>
                <option value="INTERNAL">Internal</option>
                <option value="PUBLIC">Public</option>
            </FilterSelect>

            <FilterSelect
                value={searchParams.get("categoryId") ?? ""}
                onChange={(value) => updateParams({ categoryId: value })}
                ariaLabel="Filter by category"
            >
                <option value="">All Categories</option>

                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </FilterSelect>

            <FilterSelect
                value={searchParams.get("featured") ?? ""}
                onChange={(value) => updateParams({ featured: value })}
                ariaLabel="Filter by featured"
            >
                <option value="">Featured &amp; Standard</option>
                <option value="true">Featured only</option>
                <option value="false">Not featured</option>
            </FilterSelect>

            <FilterSelect
                value={currentSortValue}
                onChange={(value) => {
                    const option = SORT_OPTIONS.find((o) => o.value === value);
                    updateParams({
                        sortBy: option?.sortBy ?? "",
                        sortOrder: option?.sortOrder ?? "",
                    });
                }}
                ariaLabel="Sort projects"
            >
                {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </FilterSelect>
        </WorkspaceFilterBar>
    );
}

interface FilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    ariaLabel: string;
    children: React.ReactNode;
}

function FilterSelect({
    value,
    onChange,
    ariaLabel,
    children,
}: FilterSelectProps) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-label={ariaLabel}
                className="
                    h-9
                    min-w-[132px]
                    appearance-none
                    rounded-lg
                    border
                    border-[var(--workspace-border)]
                    bg-[var(--workspace-surface)]
                    px-3
                    pr-8
                    text-xs
                    text-[var(--workspace-text)]
                    outline-none
                    transition-all
                    focus:border-[var(--workspace-primary)]
                    focus:ring-2
                    focus:ring-[var(--workspace-primary)]/10
                "
            >
                {children}
            </select>

            <ChevronDown
                className="
                    pointer-events-none
                    absolute
                    right-2.5
                    top-1/2
                    h-3.5
                    w-3.5
                    -translate-y-1/2
                    text-[var(--workspace-text-subtle)]
                "
            />
        </div>
    );
}