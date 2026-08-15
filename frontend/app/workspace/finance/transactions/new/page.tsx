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
            <div>
                <p className="text-xs font-medium text-[var(--workspace-primary)]">
                    FINANCE
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                    New Transaction
                </h1>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--workspace-text-muted)]">
                    Add a new financial transaction to your records.
                </p>
            </div>

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
