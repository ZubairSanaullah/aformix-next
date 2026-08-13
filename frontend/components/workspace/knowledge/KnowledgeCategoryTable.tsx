import {
    WorkspaceEmptyState,
    WorkspaceTable,
    WorkspaceTableBody,
    WorkspaceTableCell,
    WorkspaceTableHead,
    WorkspaceTableHeader,
    WorkspaceTableRow,
} from "@/components/workspace/ui";

import KnowledgeCategoryFormDialog from "./KnowledgeCategoryFormDialog";
import KnowledgeCategoryActions from "./KnowledgeCategoryActions";
import type { KnowledgeCategoryListItem } from "./types";

interface KnowledgeCategoryTableProps {
    categories: KnowledgeCategoryListItem[];
}

function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function KnowledgeCategoryTable({
    categories,
}: KnowledgeCategoryTableProps) {
    if (!categories.length) {
        return (
            <WorkspaceEmptyState
                title="No categories found"
                description="No categories match your current search. Create a category to start organizing articles."
            />
        );
    }

    return (
        <WorkspaceTable>
            <WorkspaceTableHeader>
                <WorkspaceTableRow>
                    <WorkspaceTableHead>Category</WorkspaceTableHead>
                    <WorkspaceTableHead>Slug</WorkspaceTableHead>
                    <WorkspaceTableHead>Description</WorkspaceTableHead>
                    <WorkspaceTableHead>Sort order</WorkspaceTableHead>
                    <WorkspaceTableHead>Updated</WorkspaceTableHead>
                    <WorkspaceTableHead>Actions</WorkspaceTableHead>
                </WorkspaceTableRow>
            </WorkspaceTableHeader>

            <WorkspaceTableBody>
                {categories.map((category) => {
                    const isDeleted = Boolean(category.deletedAt);

                    return (
                        <WorkspaceTableRow key={category.id}>
                            {/* Category */}
                            <WorkspaceTableCell>
                                <div className="flex min-w-[180px] items-center gap-2.5">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--workspace-primary-soft)] text-[10px] font-semibold uppercase text-[var(--workspace-primary)]">
                                        {category.name.slice(0, 2)}
                                    </span>

                                    <span className="min-w-0">
                                        <span className="block truncate text-xs font-semibold text-[var(--workspace-text)]">
                                            {category.name}
                                        </span>

                                        {isDeleted && (
                                            <span className="mt-0.5 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">
                                                Archived
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </WorkspaceTableCell>

                            {/* Slug */}
                            <WorkspaceTableCell>
                                <code className="rounded bg-[var(--workspace-background)] px-1.5 py-0.5 text-[10px] text-[var(--workspace-text-muted)]">
                                    {category.slug}
                                </code>
                            </WorkspaceTableCell>

                            {/* Description */}
                            <WorkspaceTableCell>
                                <span className="block max-w-[280px] truncate text-xs text-[var(--workspace-text-muted)]">
                                    {category.description || "—"}
                                </span>
                            </WorkspaceTableCell>

                            {/* Sort order */}
                            <WorkspaceTableCell>
                                <span className="text-xs text-[var(--workspace-text-muted)]">
                                    {category.sortOrder}
                                </span>
                            </WorkspaceTableCell>

                            {/* Updated */}
                            <WorkspaceTableCell>
                                <span className="text-xs text-[var(--workspace-text-muted)]">
                                    {formatDate(category.updatedAt)}
                                </span>
                            </WorkspaceTableCell>

                            {/* Actions */}
                            <WorkspaceTableCell>
                                <div className="flex items-center gap-1">
                                    <KnowledgeCategoryFormDialog
                                        mode="edit"
                                        category={category}
                                    />

                                    <KnowledgeCategoryActions
                                        categoryId={category.id}
                                        categoryName={category.name}
                                        isDeleted={isDeleted}
                                    />
                                </div>
                            </WorkspaceTableCell>
                        </WorkspaceTableRow>
                    );
                })}
            </WorkspaceTableBody>
        </WorkspaceTable>
    );
}
