import Link from "next/link";
import {
    User,
    Building2,
    Target,
    BriefcaseBusiness,
    CalendarDays,
    StickyNote,
    Search,
} from "lucide-react";

import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
    WorkspaceCard,
    WorkspaceCardHeader,
    WorkspaceEmptyState,
} from "@/components/workspace/ui";

import {
    searchCRM,
    type SearchResultType,
} from "@/lib/services/search";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}

const typeConfig: Record<
    SearchResultType,
    { label: string; icon: typeof User }
> = {
    contact: { label: "Contacts", icon: User },
    company: { label: "Companies", icon: Building2 },
    lead: { label: "Leads", icon: Target },
    deal: { label: "Deals", icon: BriefcaseBusiness },
    activity: { label: "Activities", icon: CalendarDays },
    note: { label: "Notes", icon: StickyNote },
};

const typeOrder: SearchResultType[] = [
    "contact",
    "company",
    "lead",
    "deal",
    "activity",
    "note",
];

export default async function SearchPage({
    searchParams,
}: SearchPageProps) {
    const params = await searchParams;
    const query = params.q ?? "";

    const results = query.trim()
        ? await searchCRM(query, { limitPerType: 25 })
        : null;

    const totalResults = results
        ? Object.values(results).reduce(
            (sum, group) => sum + group.length,
            0
        )
        : 0;

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    { label: "CRM", href: "/workspace/crm" },
                    { label: "Search" },
                ]}
            />

            <WorkspacePageHeader
                title="Search Results"
                description={
                    query
                        ? `Showing results for "${query}"`
                        : "Search across contacts, companies, leads, deals, activities, and notes."
                }
            />

            {!query.trim() ? (
                <WorkspaceEmptyState
                    title="Start typing to search"
                    description="Use the search bar above to find records across your entire CRM."
                />
            ) : totalResults === 0 ? (
                <WorkspaceEmptyState
                    title={`No results for "${query}"`}
                    description="Try a different search term, or check the spelling."
                />
            ) : (
                <div className="space-y-4">
                    {typeOrder.map((type) => {
                        const group = results?.[type] ?? [];

                        if (group.length === 0) return null;

                        const { label, icon: Icon } = typeConfig[type];

                        return (
                            <WorkspaceCard key={type}>
                                <WorkspaceCardHeader
                                    title={`${label} (${group.length})`}
                                />

                                <div className="divide-y divide-[var(--workspace-border)]">
                                    {group.map((result) => (
                                        <Link
                                            key={result.id}
                                            href={result.href}
                                            className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--workspace-background)]"
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                                <Icon className="h-4 w-4" />
                                            </span>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-[var(--workspace-text)]">
                                                    {result.title}
                                                </p>

                                                {result.subtitle && (
                                                    <p className="truncate text-xs text-[var(--workspace-text-muted)]">
                                                        {result.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </WorkspaceCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}