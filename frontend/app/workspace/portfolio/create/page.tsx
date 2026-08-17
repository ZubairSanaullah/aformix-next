import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import PortfolioProjectForm from "@/components/workspace/portfolio/PortfolioProjectForm";

export default async function CreatePortfolioProjectPage() {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }
        throw error;
    }

    const categories = await prisma.portfolioCategory.findMany({
        where: { deletedAt: null },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true },
    });

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="New Portfolio Project"
                description="Create a new case study or showcase project."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Portfolio", href: "/workspace/portfolio" },
                    { label: "New Project" },
                ]}
            />

            <PortfolioProjectForm mode="create" categories={categories} />
        </div>
    );
}
