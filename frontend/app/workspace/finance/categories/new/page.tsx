import { WorkspacePageHeader, WorkspaceCard, WorkspaceAlert } from "@/components/workspace/ui";

import FinanceCategoryForm from "@/components/workspace/finance/FinanceCategoryForm";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

export default async function NewCategoryPage() {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <WorkspacePageHeader
                        title="New Category"
                        description="Create a new financial category."
                    />

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to create categories."
                            : "Only administrators can access the Finance module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-medium text-[var(--workspace-primary)]">
                    FINANCE
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                    New Category
                </h1>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--workspace-text-muted)]">
                    Create a new transaction category to organize your finances.
                </p>
            </div>

            <WorkspaceCard>
                <FinanceCategoryForm mode="create" />
            </WorkspaceCard>
        </div>
    );
}
