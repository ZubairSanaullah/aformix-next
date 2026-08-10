"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
    WorkspaceFilterBar,
    WorkspaceInput,
    WorkspaceSelect,
} from "@/components/workspace/ui";

export default function CompanyFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";

    const updateFilter = (
        key: string,
        value: string
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(
            `/workspace/crm/companies?${params.toString()}`
        );
    };

    const clearFilters = () => {
        router.push("/workspace/crm/companies");
    };

    const hasFilters = Boolean(search || status);

    return (
        <WorkspaceFilterBar
            onClear={hasFilters ? clearFilters : undefined}
        >
            <WorkspaceInput
                value={search}
                onChange={(event) =>
                    updateFilter(
                        "search",
                        event.target.value
                    )
                }
                placeholder="Search companies..."
                aria-label="Search companies"
            />

            <WorkspaceSelect
                value={status}
                onChange={(event) =>
                    updateFilter(
                        "status",
                        event.target.value
                    )
                }
                aria-label="Filter companies by status"
            >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ARCHIVED">Archived</option>
            </WorkspaceSelect>
        </WorkspaceFilterBar>
    );
}