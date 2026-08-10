import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";

import {
    WorkspaceBreadcrumbs,
    WorkspaceCard,
    WorkspaceCardHeader,
    WorkspacePageActions,
} from "@/components/workspace/ui";

import EditCompanyForm from "@/components/workspace/crm/companies/EditCompanyForm";

interface CompanyEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getCompany(id: string) {
    const headersList = await headers();
    const cookie = headersList.get("cookie");

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/crm/companies/${id}`,
        {
            cache: "no-store",
            headers: cookie ? { cookie } : undefined,
        }
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    return data.company;
}

export default async function CompanyEditPage({
    params,
}: CompanyEditPageProps) {
    const { id } = await params;

    const company = await getCompany(id);

    if (!company) {
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
                        label: "Companies",
                        href: "/workspace/crm/companies",
                    },
                    {
                        label: company.name,
                        href: `/workspace/crm/companies/${company.id}`,
                    },
                    {
                        label: "Edit",
                    },
                ]}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-2xl">
                        Edit Company
                    </h1>

                    <p className="mt-1.5 text-sm text-[var(--workspace-text-muted)]">
                        Update information for {company.name}.
                    </p>
                </div>

                <WorkspacePageActions className="shrink-0">
                    <Link
                        href={`/workspace/crm/companies/${company.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Company
                    </Link>
                </WorkspacePageActions>
            </div>

            <WorkspaceCard>
                <WorkspaceCardHeader
                    title="Company Information"
                    description="Update the company's core CRM information."
                />

                <EditCompanyForm company={company} />
            </WorkspaceCard>
        </div>
    );
}