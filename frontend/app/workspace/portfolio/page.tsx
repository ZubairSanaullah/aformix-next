import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { getPortfolioProjects } from "@/lib/services/portfolio-projects";
import { getPortfolioStats } from "@/lib/services/portfolio-stats";
import { portfolioProjectListQuerySchema } from "@/lib/validations/portfolio";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspacePageActions from "@/components/workspace/ui/WorkspacePageActions";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import PortfolioStatsCards from "@/components/workspace/portfolio/PortfolioStatsCards";
import PortfolioProjectsFilters from "@/components/workspace/portfolio/PortfolioProjectsFilters";
import PortfolioProjectsTable from "@/components/workspace/portfolio/PortfolioProjectsTable";
import Pagination from "@/components/workspace/portfolio/Pagination";

interface PortfolioPageProps {
    searchParams: Promise<Record<string, string | undefined>>;
}

export default async function PortfolioPage({
    searchParams,
}: PortfolioPageProps) {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }
        throw error;
    }

    const rawParams = await searchParams;

    const parsedQuery = portfolioProjectListQuerySchema.safeParse(rawParams);

    // Falls back to schema defaults (page 1, limit 20, sort updatedAt desc)
    // on malformed query params rather than erroring the whole page —
    // a stale/bad URL shouldn't 500 an admin dashboard.
    const query = parsedQuery.success
        ? parsedQuery.data
        : portfolioProjectListQuerySchema.parse({});

    const [{ items, pagination }, stats, categories] = await Promise.all([
        getPortfolioProjects(query),
        getPortfolioStats(),
        prisma.portfolioCategory.findMany({
            where: { deletedAt: null },
            orderBy: { sortOrder: "asc" },
            select: { id: true, name: true },
        }),
    ]);

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Portfolio"
                description="Manage public case studies and showcase projects."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Portfolio" },
                ]}
                actions={
                    <WorkspacePageActions>
                        <Link href="/workspace/portfolio/categories">
                            <WorkspaceButton variant="secondary" size="md">
                                Categories
                            </WorkspaceButton>
                        </Link>

                        <Link href="/workspace/portfolio/create">
                            <WorkspaceButton variant="primary" size="md">
                                <Plus className="h-3.5 w-3.5" />
                                New Project
                            </WorkspaceButton>
                        </Link>
                    </WorkspacePageActions>
                }
            />

            <PortfolioStatsCards stats={stats} />

            <PortfolioProjectsFilters categories={categories} />

            <PortfolioProjectsTable projects={items} />

            <Pagination
                page={pagination.page}
                pageSize={pagination.limit}
                total={pagination.total}
            />
        </div>
    );
}