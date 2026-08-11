"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import {
    WorkspaceButton,
    WorkspaceInput,
    WorkspaceSelect,
} from "@/components/workspace/ui";

interface ContactFiltersProps {
    companies: {
        id: string;
        name: string;
    }[];
    search?: string;
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED" | "";
    companyId?: string;
}

export default function ContactFilters({
    companies,
    search: searchProp,
    status: statusProp,
    companyId: companyIdProp,
}: ContactFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search =
        searchParams.get("search") ?? searchProp ?? "";
    const status =
        searchParams.get("status") ?? statusProp ?? "";
    const companyId =
        searchParams.get("companyId") ?? companyIdProp ?? "";

    const updateFilter = (
        key: string,
        value: string
    ) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(
            `${pathname}?${params.toString()}`
        );
    };

    const clearFilters = () => {
        router.push(pathname);
    };

    const hasFilters =
        Boolean(search) ||
        Boolean(status) ||
        Boolean(companyId);

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1 lg:max-w-sm">
                <Search
                    className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-[var(--workspace-text-subtle)]
          "
                />

                <WorkspaceInput
                    value={search}
                    onChange={(event) =>
                        updateFilter(
                            "search",
                            event.target.value
                        )
                    }
                    placeholder="Search contacts..."
                    className="pl-9"
                />
            </div>

            <WorkspaceSelect
                value={status}
                onChange={(event) =>
                    updateFilter(
                        "status",
                        event.target.value
                    )
                }
            >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ARCHIVED">Archived</option>
            </WorkspaceSelect>

            <WorkspaceSelect
                value={companyId}
                onChange={(event) =>
                    updateFilter(
                        "companyId",
                        event.target.value
                    )
                }
            >
                <option value="">All companies</option>

                {companies.map((company) => (
                    <option
                        key={company.id}
                        value={company.id}
                    >
                        {company.name}
                    </option>
                ))}
            </WorkspaceSelect>

            {hasFilters && (
                <WorkspaceButton
                    type="button"
                    variant="ghost"
                    onClick={clearFilters}
                >
                    <X className="h-3.5 w-3.5" />
                    Clear
                </WorkspaceButton>
            )}
        </div>
    );
}