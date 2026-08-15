import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { getPortfolioCategories } from "@/lib/services/portfolio-categories";
import { portfolioCategoryListQuerySchema } from "@/lib/validations/portfolio";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspacePageActions from "@/components/workspace/ui/WorkspacePageActions";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import PortfolioCategoriesFilters from "@/components/workspace/portfolio/PortfolioCategoriesFilters";
import PortfolioCategoriesList from "@/components/workspace/portfolio/PortfolioCategoriesList";
import CreatePortfolioCategoryButton from "@/components/workspace/portfolio/CreatePortfolioCategoryButton";

interface PortfolioCategoriesPageProps {
    searchParams: Promise<Record<string, string | undefined>>;
}

export default async function PortfolioCategoriesPage({
    searchParams,
}: PortfolioCategoriesPageProps) {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }
        throw error;
    }

    const rawParams = await searchParams;

    const parsedQuery = portfolioCategoryListQuerySchema.safeParse({
        ...rawParams,
        // Ordering only makes sense unpaginated and fully in sortOrder —
        // categories are a small, human-curated list, not a paginated table.
        limit: "100",
        sortBy: rawParams.search ? "name" : "sortOrder",
        sortOrder: "asc",
    });

    const query = parsedQuery.success
        ? parsedQuery.data
        : portfolioCategoryListQuerySchema.parse({ limit: 100 });

    const { categories } = await getPortfolioCategories(query);

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Portfolio Categories"
                description="Organize portfolio projects into categories and control display order."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Portfolio", href: "/workspace/portfolio" },
                    { label: "Categories" },
                ]}
                actions={
                    <WorkspacePageActions>
                        <Link href="/workspace/portfolio">
                            <WorkspaceButton variant="secondary" size="md">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Portfolio
                            </WorkspaceButton>
                        </Link>

                        <CreatePortfolioCategoryButton />
                    </WorkspacePageActions>
                }
            />

            <PortfolioCategoriesFilters />

            <PortfolioCategoriesList initialCategories={categories} />
        </div>
    );
}