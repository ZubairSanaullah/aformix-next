import { notFound } from "next/navigation";

import {
    WorkspaceBreadcrumbs,
} from "@/components/workspace/ui";

import {
    getCRMLead,
    getCRMCompaniesForFilter,
    getCRMContacts,
} from "@/lib/services/crm";

import LeadEditForm from "@/components/workspace/crm/leads/LeadEditForm";

interface LeadEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function LeadEditPage({
    params,
}: LeadEditPageProps) {
    const { id } = await params;

    const [
        lead,
        companies,
        contacts,
    ] = await Promise.all([
        getCRMLead(id),
        getCRMCompaniesForFilter(),
        getCRMContacts(),
    ]);

    if (!lead) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    {
                        label: "CRM",
                        href: "/workspace/crm",
                    },
                    {
                        label: "Leads",
                        href: "/workspace/crm/leads",
                    },
                    {
                        label: lead.title,
                        href: `/workspace/crm/leads/${lead.id}`,
                    },
                    {
                        label: "Edit",
                    },
                ]}
            />

            <div>
                <h1 className="text-xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-2xl">
                    Edit Lead
                </h1>

                <p className="mt-1.5 text-sm text-[var(--workspace-text-muted)]">
                    Update lead information,
                    relationships, and sales details.
                </p>
            </div>

            <LeadEditForm
                lead={lead}
                companies={companies}
                contacts={contacts}
            />
        </div>
    );
}