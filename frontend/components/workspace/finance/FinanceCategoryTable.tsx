"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";

import type { FinanceCategory } from "@prisma/client";

interface FinanceCategoryTableProps {
    categories: FinanceCategory[];
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export default function FinanceCategoryTable({
    categories,
    hasActiveFilters,
    onClearFilters,
}: FinanceCategoryTableProps) {
    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <p className="text-sm font-medium text-[var(--workspace-text)]">
                    {hasActiveFilters
                        ? "No categories match your filters"
                        : "No categories yet"}
                </p>
                <p className="text-xs text-[var(--workspace-text-muted)]">
                    {hasActiveFilters ? (
                        <button
                            onClick={onClearFilters}
                            className="font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                        >
                            Clear filters
                        </button>
                    ) : (
                        "Create your first category to get started."
                    )}
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--workspace-border)]">
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Color
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Name
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Slug
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                            Type
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-[var(--workspace-text)]">
                            Sort Order
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-[var(--workspace-text)]">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr
                            key={category.id}
                            className="border-b border-[var(--workspace-border)] transition-colors hover:bg-[var(--workspace-card-background-hover)]"
                        >
                            <td className="py-3 px-4">
                                <div
                                    className="h-6 w-6 rounded border border-[var(--workspace-border)]"
                                    style={{
                                        backgroundColor: category.color || "#000000",
                                    }}
                                    title={category.color ?? undefined}
                                />
                            </td>
                            <td className="py-3 px-4">
                                <Link
                                    href={`/workspace/finance/categories/${category.id}`}
                                    className="font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                                >
                                    {category.name}
                                </Link>
                            </td>
                            <td className="py-3 px-4 text-[var(--workspace-text-muted)] font-mono text-xs">
                                {category.slug}
                            </td>
                            <td className="py-3 px-4">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ${
                                        category.type === "INCOME"
                                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                            : category.type === "EXPENSE"
                                              ? "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                                              : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                    }`}
                                >
                                    {category.type}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-center text-[var(--workspace-text-muted)]">
                                {category.sortOrder}
                            </td>
                            <td className="py-3 px-4 text-center">
                                <Link
                                    href={`/workspace/finance/categories/${category.id}`}
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-card-background)] hover:text-[var(--workspace-text)]"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
