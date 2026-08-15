import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { WorkspacePageHeader, WorkspaceAlert } from "@/components/workspace/ui";
import AnalyticsDashboardClient from "./AnalyticsDashboardClient";

export const metadata = {
    title: "Analytics | Aformix Workspace",
    description: "Business performance and insights across Aformix.",
};

export default async function AnalyticsPage() {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <WorkspacePageHeader
                        title="Analytics"
                        description="Business performance and insights across Aformix."
                    />
                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to view Analytics."
                            : "Only administrators can access the Analytics module."}
                    </WorkspaceAlert>
                </div>
            );
        }
        throw error;
    }

    return <AnalyticsDashboardClient />;
}
