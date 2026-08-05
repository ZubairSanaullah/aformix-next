"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function PostsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    function updateParam(
        key: string,
        value: string,
        replace = false
    ) {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.delete("page");

        const url = `/workspace/blog?${params.toString()}`;

        if (replace) {
            router.replace(url);
        } else {
            router.push(url);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (searchParams.get("search") ?? "")) {
                updateParam("search", search, true);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                    value={search}
                    placeholder="Search posts..."
                    className="w-full rounded-lg border bg-background py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Status */}
            <select
                defaultValue={searchParams.get("status") ?? ""}
                onChange={(e) => updateParam("status", e.target.value)}
                className="rounded-lg border bg-background px-3 py-2 text-sm"
            >
                <option value="">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
            </select>

            {/* Sort */}
            <select
                defaultValue={searchParams.get("sort") ?? ""}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="rounded-lg border bg-background px-3 py-2 text-sm"
            >
                <option value="">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="updated">Recently Updated</option>
                <option value="views">Most Viewed</option>
                <option value="published">Published Date</option>
            </select>
        </div>
    );
}