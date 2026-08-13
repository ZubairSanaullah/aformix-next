import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import { getCategories } from "@/lib/services/knowledge-categories";
import { categoryListQuerySchema } from "@/lib/validations/knowledge-base";

import KnowledgeCategorySearch from "@/components/workspace/knowledge/KnowledgeCategorySearch";
import KnowledgeCategoryFormDialog from "@/components/workspace/knowledge/KnowledgeCategoryFormDialog";
import KnowledgeCategoryTable from "@/components/workspace/knowledge/KnowledgeCategoryTable";

export const metadata = {
    title: "Categories — Knowledge Base — Aformix Workspace",
};

interface KnowledgeCategoriesPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function KnowledgeCategoriesPage({
    searchParams,
}: KnowledgeCategoriesPageProps) {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }

        throw error;
    }

    const rawParams = await searchParams;

    const normalizedParams: Record<string, string> = {};

    for (const [key, value] of Object.entries(rawParams)) {
        if (typeof value === "string") {
            normalizedParams[key] = value;
        } else if (Array.isArray(value) && value.length > 0) {
            normalizedParams[key] = value[0];
        }
    }

    const parsedQuery = categoryListQuerySchema.safeParse(normalizedParams);

    const query = parsedQuery.success
        ? parsedQuery.data
        : categoryListQuerySchema.parse({});

    const { categories } = await getCategories(query);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href="/workspace/knowledge"
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Knowledge Base
                    </Link>

                    <h1 className="mt-2 text-xl font-semibold text-[var(--workspace-text)]">
                        Categories
                    </h1>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Organize your knowledge base articles into
                        categories.
                    </p>
                </div>

                <KnowledgeCategoryFormDialog mode="create" />
            </div>

            {/* Search */}
            <KnowledgeCategorySearch />

            {/* Table */}
            <KnowledgeCategoryTable categories={categories} />
        </div>
    );
}
