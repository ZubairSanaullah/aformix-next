"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import WorkspaceFilterBar from "@/components/workspace/ui/WorkspaceFilterBar";
import WorkspaceSearch from "@/components/workspace/ui/WorkspaceSearch";

interface FilterOption {
    id: string;
    name: string;
}

interface PostsFiltersProps {
    categories?: FilterOption[];
    tags?: FilterOption[];
}

export default function PostsFilters({
    categories = [],
    tags = [],
}: PostsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    useEffect(() => {
        setSearch(searchParams.get("search") ?? "");
    }, [searchParams]);

    function updateParam(
        key: string,
        value: string,
        replace = false
    ) {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.delete("page");

        const query = params.toString();

        const url = query
            ? `/workspace/blog?${query}`
            : "/workspace/blog";

        if (replace) {
            router.replace(url);
        } else {
            router.push(url);
        }
    }

    function resetFilters() {
        setSearch("");
        router.push("/workspace/blog");
    }

    useEffect(() => {
        const currentSearch =
            searchParams.get("search") ?? "";

        if (search === currentSearch) {
            return;
        }

        const timeout = setTimeout(() => {
            updateParam("search", search, true);
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const hasFilters =
        Boolean(search) ||
        Boolean(searchParams.get("status")) ||
        Boolean(searchParams.get("category")) ||
        Boolean(searchParams.get("tag")) ||
        Boolean(searchParams.get("sort"));

    return (
        <WorkspaceFilterBar
            showReset={hasFilters}
            onReset={resetFilters}
        >
            <WorkspaceSearch
                value={search}
                onChange={setSearch}
                placeholder="Search posts..."
                className="sm:w-72"
            />

            <FilterSelect
                value={searchParams.get("status") ?? ""}
                onChange={(value) =>
                    updateParam("status", value)
                }
                ariaLabel="Filter by status"
            >
                <option value="">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
            </FilterSelect>

            <FilterSelect
                value={searchParams.get("category") ?? ""}
                onChange={(value) =>
                    updateParam("category", value)
                }
                ariaLabel="Filter by category"
            >
                <option value="">All Categories</option>

                {categories.map((category) => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </FilterSelect>

            <FilterSelect
                value={searchParams.get("tag") ?? ""}
                onChange={(value) =>
                    updateParam("tag", value)
                }
                ariaLabel="Filter by tag"
            >
                <option value="">All Tags</option>

                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </FilterSelect>

            <FilterSelect
                value={searchParams.get("sort") ?? ""}
                onChange={(value) =>
                    updateParam("sort", value)
                }
                ariaLabel="Sort posts"
            >
                <option value="">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="updated">
                    Recently Updated
                </option>
                <option value="views">Most Viewed</option>
                <option value="published">
                    Published Date
                </option>
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
                onChange={(event) =>
                    onChange(event.target.value)
                }
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