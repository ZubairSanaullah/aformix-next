import { WorkspacePageHeader, WorkspaceCard, WorkspaceAlert } from "@/components/workspace/ui";

import FinanceTransactionForm from "@/components/workspace/finance/FinanceTransactionForm";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { getFinanceCategories } from "@/lib/services/finance-categories";
import { getCRMCompaniesForFilter } from "@/lib/services/crm";

export default async function NewTransactionPage() {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <WorkspacePageHeader
                        title="New Transaction"
                        description="Create a new financial transaction."
                    />

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to create transactions."
                            : "Only administrators can access the Finance module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    const [categories, companies] = await Promise.all([
        getFinanceCategories({
            page: 1,
            limit: 100,
            includeDeleted: false,
            sortBy: "sortOrder",
            sortOrder: "asc",
        }),
        getCRMCompaniesForFilter(),
    ]);

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="New Transaction"
                description="Add a new financial transaction to your records."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Finance", href: "/workspace/finance" },
                    { label: "Transactions", href: "/workspace/finance/transactions" },
                    { label: "New" },
                ]}
            />

            <WorkspaceCard>
                <FinanceTransactionForm
                    categories={categories.categories}
                    companies={companies}
                    mode="create"
                />
            </WorkspaceCard>
        </div>
    );
}
