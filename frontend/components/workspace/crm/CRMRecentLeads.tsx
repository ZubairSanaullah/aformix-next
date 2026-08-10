import {
    WorkspaceBadge,
    WorkspaceCard,
    WorkspaceEmptyState,
    WorkspaceSectionHeader,
} from "@/components/workspace/ui";

const leads: Array<{
    id: string;
    name: string;
    company: string;
    status: "New" | "Qualified" | "Contacted";
}> = [];

export default function CRMRecentLeads() {
    return (
        <WorkspaceCard className="p-5">
            <WorkspaceSectionHeader
                title="Recent Leads"
                description="Your latest CRM leads and their current status."
            />

            {leads.length === 0 ? (
                <div className="mt-4">
                    <WorkspaceEmptyState
                        title="No leads yet"
                        description="New leads will appear here once they are added to your CRM."
                    />
                </div>
            ) : (
                <div className="mt-4 divide-y divide-[var(--workspace-border)]">
                    {leads.map((lead) => (
                        <div
                            key={lead.id}
                            className="flex items-center gap-3 py-3"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-[var(--workspace-text)]">
                                    {lead.name}
                                </p>

                                <p className="mt-0.5 truncate text-[11px] text-[var(--workspace-text-subtle)]">
                                    {lead.company}
                                </p>
                            </div>

                            <WorkspaceBadge>
                                {lead.status}
                            </WorkspaceBadge>
                        </div>
                    ))}
                </div>
            )}
        </WorkspaceCard>
    );
}