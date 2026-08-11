import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import TaskForm from "@/components/workspace/tasks/TaskForm";

import {
    getCRMContacts,
    getCRMCompaniesForFilter,
    getCRMLeads,
} from "@/lib/services/crm";

import { prisma } from "@/lib/prisma";

export default async function CreateTaskPage() {
    const [
        contacts,
        companies,
        leads,
        deals,
    ] = await Promise.all([
        getCRMContacts(),
        getCRMCompaniesForFilter(),
        getCRMLeads(),
        prisma.deal.findMany({
            select: {
                id: true,
                title: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
    ]);

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    {
                        label: "Tasks",
                        href: "/workspace/tasks",
                    },
                    {
                        label: "Create Task",
                    },
                ]}
            />

            <WorkspacePageHeader
                title="Create Task"
                description="Create a task and optionally connect it to your CRM records."
            />

            <div className="max-w-4xl">
                <TaskForm
                    contacts={contacts}
                    companies={companies}
                    leads={leads.map((lead) => ({
                        id: lead.id,
                        title: lead.title,
                    }))}
                    deals={deals}
                />
            </div>
        </div>
    );
}