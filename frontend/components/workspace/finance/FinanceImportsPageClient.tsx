"use client";

import Link from "next/link";
import { MoreVertical, CheckCircle, AlertCircle, Clock } from "lucide-react";

import { WorkspaceCard } from "@/components/workspace/ui";
import FinanceImportsPagination from "./FinanceImportsPagination";

interface FinanceImport {
    id: string;
    filename: string;
    originalFilename: string;
    fileSize: number | null;
    status: string;
    totalRows: number;
    successfulRows: number;
    failedRows: number;
    skippedRows: number;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    createdBy: {
        id: string;
        name: string | null;
        email: string;
    };
}

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface FinanceImportsPageClientProps {
    imports: FinanceImport[];
    pagination: PaginationData;
}

function getStatusIcon(status: string) {
    switch (status) {
        case "COMPLETED":
            return <CheckCircle className="h-4 w-4 text-emerald-600" />;
        case "FAILED":
            return <AlertCircle className="h-4 w-4 text-red-600" />;
        case "PARTIAL":
            return <AlertCircle className="h-4 w-4 text-amber-600" />;
        default:
            return <Clock className="h-4 w-4 text-blue-600" />;
    }
}

function getStatusColor(status: string) {
    const statusMap: Record<string, string> = {
        COMPLETED:
            "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
        FAILED: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
        PARTIAL: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
        UPLOADED:
            "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
        PROCESSING:
            "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    };

    return statusMap[status] || statusMap.UPLOADED;
}

function formatBytes(bytes: number | null | undefined): string {
    if (bytes === null || bytes === undefined || bytes <= 0) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(date: Date | null | undefined): string {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

export default function FinanceImportsPageClient({
    imports,
    pagination,
}: FinanceImportsPageClientProps) {
    if (imports.length === 0) {
        return (
            <WorkspaceCard padding="lg">
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <p className="text-sm font-medium text-[var(--workspace-text)]">
                        No imports yet
                    </p>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Upload your first file to get started.
                    </p>
                </div>
            </WorkspaceCard>
        );
    }

    return (
        <WorkspaceCard padding="none">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[var(--workspace-border)]">
                            <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                                File
                            </th>
                            <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                                Status
                            </th>
                            <th className="py-3 px-4 text-center font-semibold text-[var(--workspace-text)]">
                                Rows
                            </th>
                            <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                                Uploaded By
                            </th>
                            <th className="py-3 px-4 text-left font-semibold text-[var(--workspace-text)]">
                                Date
                            </th>
                            <th className="py-3 px-4 text-center font-semibold text-[var(--workspace-text)]">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {imports.map((importRecord) => (
                            <tr
                                key={importRecord.id}
                                className="border-b border-[var(--workspace-border)] transition-colors hover:bg-[var(--workspace-card-background-hover)]"
                            >
                                <td className="py-3 px-4">
                                    <div className="space-y-1">
                                        <p className="font-medium text-[var(--workspace-text)]">
                                            {importRecord.originalFilename}
                                        </p>
                                        <p className="text-xs text-[var(--workspace-text-muted)]">
                                            {formatBytes(importRecord.fileSize)}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium ${getStatusColor(
                                            importRecord.status
                                        )}`}
                                    >
                                        {getStatusIcon(importRecord.status)}
                                        {importRecord.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-[var(--workspace-text)]">
                                            {importRecord.successfulRows}/
                                            {importRecord.totalRows}
                                        </p>
                                        {importRecord.failedRows > 0 && (
                                            <p className="text-xs text-red-600 dark:text-red-400">
                                                {importRecord.failedRows} failed
                                            </p>
                                        )}
                                        {importRecord.skippedRows > 0 && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                                {importRecord.skippedRows} skipped
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-[var(--workspace-text-muted)]">
                                    {importRecord.createdBy.name ?? "Unknown user"}
                                </td>
                                <td className="py-3 px-4 text-[var(--workspace-text-muted)]">
                                    {formatDate(importRecord.createdAt)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <Link
                                        href={`/workspace/finance/imports/${importRecord.id}`}
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

            <FinanceImportsPagination pagination={pagination} />
        </WorkspaceCard>
    );
}
