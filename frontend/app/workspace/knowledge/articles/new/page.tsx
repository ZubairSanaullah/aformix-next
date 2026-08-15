import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import { getCategories } from "@/lib/services/knowledge-categories";

import KnowledgeArticleForm from "@/components/workspace/knowledge/KnowledgeArticleForm";

export const metadata = {
    title: "New Article — Knowledge Base — Aformix Workspace",
};

export default async function NewKnowledgeArticlePage() {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }

        throw error;
    }

    const { categories } = await getCategories({
        page: 1,
        limit: 100,
        includeDeleted: false,
        sortBy: "sortOrder",
        sortOrder: "asc",
    });

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/workspace/knowledge"
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--workspace-text-muted)] transition-colors hover:text-[var(--workspace-primary)]"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Knowledge Base
                </Link>

                <h1 className="mt-2 text-xl font-semibold text-[var(--workspace-text)]">
                    New Article
                </h1>

                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    Write a new documentation article.
                </p>
            </div>

            <KnowledgeArticleForm categories={categories} />
        </div>
    );
}
