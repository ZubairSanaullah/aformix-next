import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
    WorkspaceCard,
    WorkspaceAlert,
} from "@/components/workspace/ui";

import FinanceCategoryForm from "@/components/workspace/finance/FinanceCategoryForm";
import FinanceCategoryDetailActions from "@/components/workspace/finance/FinanceCategoryDetailActions";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { getFinanceCategoryById } from "@/lib/services/finance-categories";

interface CategoryDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CategoryDetailPage({
    params,
}: CategoryDetailPageProps) {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/workspace/finance/categories"
                            className="inline-flex items-center text-sm font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </div>

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to view categories."
                            : "Only administrators can access the Finance module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    const { id } = await params;

    const category = await getFinanceCategoryById(id);

    if (!category) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/workspace/finance/categories"
                        className="inline-flex items-center text-sm font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </div>

                <WorkspaceAlert variant="danger" title="Not found">
                    The category you're looking for doesn't exist or has been
                    deleted.
                </WorkspaceAlert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <Link
                        href="/workspace/finance/categories"
                        className="inline-flex items-center text-sm font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Categories
                    </Link>

                    <p className="mt-3 text-xs font-medium text-[var(--workspace-primary)]">
                        FINANCE
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                        {category.name}
                    </h1>

                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--workspace-text-muted)]">
                        View and edit category details.
                    </p>
                </div>

                <FinanceCategoryDetailActions categoryId={category.id} />
            </div>

            {/* Category Overview */}
            <div className="grid gap-4 sm:grid-cols-4">
                <WorkspaceCard padding="md">
                    <div className="space-y-2">
                        <div
                            className="h-8 w-8 rounded-lg border border-[var(--workspace-border)]"
                            style={{
                                backgroundColor: category.color ?? undefined,
                            }}
                        />
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Color
                        </p>
                        <p className="text-sm font-mono text-[var(--workspace-text)]">
                            {category.color}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Type
                        </p>
                        <p className="text-sm font-semibold text-[var(--workspace-text)]">
                            {category.type}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Slug
                        </p>
                        <p className="text-sm font-mono text-[var(--workspace-text)]">
                            {category.slug}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Sort Order
                        </p>
                        <p className="text-sm font-semibold text-[var(--workspace-text)]">
                            {category.sortOrder}
                        </p>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Edit Form */}
            <WorkspaceCard>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-base font-semibold text-[var(--workspace-text)]">
                            Category Details
                        </h2>
                        <p className="mt-1 text-sm text-[var(--workspace-text-muted)]">
                            Update the category information below.
                        </p>
                    </div>

                    <FinanceCategoryForm category={category} mode="edit" />
                </div>
            </WorkspaceCard>
        </div>
    );
}
