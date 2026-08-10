import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import {
    CompaniesPageClient,
} from "@/components/workspace/crm/companies";

import {
    getCRMCompanies,
} from "@/lib/services/companies";

interface CompaniesPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
    }>;
}

export default async function CompaniesPage({
    searchParams,
}: CompaniesPageProps) {
    const params = await searchParams;

    const search = params.search ?? "";

    const status =
        params.status as
        | "ACTIVE"
        | "INACTIVE"
        | "ARCHIVED"
        | "";

    const filters = {
        search,
        status: status || undefined,
    };

    const companies = await getCRMCompanies(filters);

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
                    },
                ]}
            />

            <WorkspacePageHeader
                title="Companies"
                description="Manage companies and organizations in your CRM."
            />

            <CompaniesPageClient
                companies={companies}
                search={search}
                status={status}
            />
        </div>
    );
}