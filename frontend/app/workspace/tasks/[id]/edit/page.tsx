import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
    WorkspaceBreadcrumbs,
    WorkspaceButton,
    WorkspaceCard,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import TaskForm from "@/components/workspace/tasks/TaskForm";

import {
    getTaskById,
} from "@/lib/services/tasks";

import {
    getCRMCompaniesForFilter,
    getCRMContacts,
    getCRMLeads,
} from "@/lib/services/crm";

interface EditTaskPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditTaskPage({
    params,
}: EditTaskPageProps) {
    const { id } = await params;

    const [
        task,
        contacts,
        companies,
        rawLeads,
    ] = await Promise.all([
        getTaskById(id),
        getCRMContacts(),
        getCRMCompaniesForFilter(),
        getCRMLeads(),
    ]);

    const leads = rawLeads.map((lead) => ({
        ...lead,
        value: lead.value !== null ? Number(lead.value) : null,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
    }));

    if (!task) {
        return (
            <div className="space-y-6">
                <WorkspaceBreadcrumbs
                    items={[
                        {
                            label: "Tasks",
                            href: "/workspace/tasks",
                        },
                        {
                            label: "Task not found",
                        },
                    ]}
                />

                <WorkspaceCard>
                    <div className="py-12 text-center">
                        <h2 className="text-base font-semibold text-[var(--workspace-text)]">
                            Task not found
                        </h2>

                        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[var(--workspace-text-muted)]">
                            The task you are trying to
                            edit does not exist or may
                            have been removed.
                        </p>

                        <div className="mt-5">
                            <Link href="/workspace/tasks">
                                <WorkspaceButton variant="secondary">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Tasks
                                </WorkspaceButton>
                            </Link>
                        </div>
                    </div>
                </WorkspaceCard>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    {
                        label: "Tasks",
                        href: "/workspace/tasks",
                    },
                    {
                        label: task.title,
                        href: `/workspace/tasks/${task.id}`,
                    },
                    {
                        label: "Edit",
                    },
                ]}
            />

            <WorkspacePageHeader
                title="Edit Task"
                description={`Update the details and CRM relationships for "${task.title}".`}
            >
                <Link
                    href={`/workspace/tasks/${task.id}`}
                >
                    <WorkspaceButton variant="secondary">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Task
                    </WorkspaceButton>
                </Link>
            </WorkspacePageHeader>

            <WorkspaceCard>
                <TaskForm
                    task={task}
                    contacts={contacts}
                    companies={companies}
                    leads={leads}
                    deals={[]}
                />
            </WorkspaceCard>
        </div>
    );

}
