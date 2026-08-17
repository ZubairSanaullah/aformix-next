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
            <WorkspacePageHeader
                title="New Category"
                description="Create a new transaction category to organize your finances."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Finance", href: "/workspace/finance" },
                    { label: "Categories", href: "/workspace/finance/categories" },
                    { label: "New" },
                ]}
            />

            <WorkspaceCard>
                <FinanceCategoryForm mode="create" />
            </WorkspaceCard>
        </div>
    );
}
