import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";

import { WorkspaceCard, WorkspaceAlert, WorkspacePageHeader } from "@/components/workspace/ui";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { prisma } from "@/lib/prisma";

interface ImportDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

function getStatusIcon(status: string) {
    switch (status) {
        case "COMPLETED":
            return <CheckCircle className="h-5 w-5 text-emerald-600" />;
        case "FAILED":
            return <AlertCircle className="h-5 w-5 text-red-600" />;
        case "PARTIAL":
            return <AlertCircle className="h-5 w-5 text-amber-600" />;
        default:
            return <Clock className="h-5 w-5 text-blue-600" />;
    }
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

export default async function ImportDetailPage({
    params,
}: ImportDetailPageProps) {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/workspace/finance/imports"
                            className="inline-flex items-center text-sm font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </div>

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to view imports."
                            : "Only administrators can access the Finance module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    const { id } = await params;

    const importRecord = await prisma.financeImport.findUnique({
        where: { id },
        include: {
            createdBy: { select: { id: true, name: true, email: true } },
            transactions: { take: 10 },
        },
    });

    if (!importRecord) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/workspace/finance/imports"
                        className="inline-flex items-center text-sm font-medium text-[var(--workspace-primary)] transition-colors hover:opacity-80"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </div>

                <WorkspaceAlert variant="danger" title="Not found">
                    The import you're looking for doesn't exist or has been
                    deleted.
                </WorkspaceAlert>
            </div>
        );
    }

    const successRate =
        importRecord.totalRows > 0
            ? Math.round(
                  (importRecord.successfulRows / importRecord.totalRows) * 100
              )
            : 0;

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title={importRecord.originalFilename}
                description="Import details and results."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Finance", href: "/workspace/finance" },
                    { label: "Imports", href: "/workspace/finance/imports" },
                    { label: "Detail" },
                ]}
            />

            {/* Status Banner */}
            <WorkspaceCard
                padding="md"
                className="border-l-4"
                style={{
                    borderLeftColor:
                        importRecord.status === "COMPLETED"
                            ? "rgb(16 185 129)"
                            : importRecord.status === "FAILED"
                              ? "rgb(239 68 68)"
                              : importRecord.status === "PARTIAL"
                                ? "rgb(245 158 11)"
                                : "rgb(59 130 246)",
                }}
            >
                <div className="flex items-center gap-3">
                    {getStatusIcon(importRecord.status)}
                    <div>
                        <p className="font-semibold text-[var(--workspace-text)]">
                            {importRecord.status === "COMPLETED"
                                ? "Import Completed Successfully"
                                : importRecord.status === "FAILED"
                                  ? "Import Failed"
                                  : importRecord.status === "PARTIAL"
                                    ? "Import Partially Completed"
                                    : "Import In Progress"}
                        </p>
                        <p className="text-sm text-[var(--workspace-text-muted)]">
                            {importRecord.completedAt
                                ? `Completed on ${formatDate(importRecord.completedAt)}`
                                : "Processing..."}
                        </p>
                    </div>
                </div>
            </WorkspaceCard>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-5">
                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Total Rows
                        </p>
                        <p className="text-2xl font-bold text-[var(--workspace-text)]">
                            {importRecord.totalRows}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Successful
                        </p>
                        <p className="text-2xl font-bold text-emerald-600">
                            {importRecord.successfulRows}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Failed
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                            {importRecord.failedRows}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Skipped
                        </p>
                        <p className="text-2xl font-bold text-amber-600">
                            {importRecord.skippedRows}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Success Rate
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                            {successRate}%
                        </p>
                    </div>
                </WorkspaceCard>
            </div>

            {/* File Details */}
            <div className="grid gap-4 sm:grid-cols-3">
                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            File Size
                        </p>
                        <p className="text-sm font-medium text-[var(--workspace-text)]">
                            {formatBytes(importRecord.fileSize)}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Uploaded By
                        </p>
                        <p className="text-sm font-medium text-[var(--workspace-text)]">
                            {importRecord.createdBy.name}
                        </p>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="md">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-[var(--workspace-text-muted)]">
                            Uploaded At
                        </p>
                        <p className="text-sm font-medium text-[var(--workspace-text)]">
                            {formatDate(importRecord.createdAt)}
                        </p>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Error Summary */}
            {importRecord.errorSummary && (
                <WorkspaceCard padding="md" className="bg-red-50 dark:bg-red-950">
                    <div className="space-y-2">
                        <p className="font-semibold text-red-700 dark:text-red-300">
                            Error Summary
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
                            {importRecord.errorSummary}
                        </p>
                    </div>
                </WorkspaceCard>
            )}

            {/* Imported Transactions Preview */}
            {importRecord.transactions && importRecord.transactions.length > 0 && (
                <WorkspaceCard padding="md">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-[var(--workspace-text)]">
                            Sample Imported Transactions
                        </h3>

                        <div className="space-y-2">
                            {importRecord.transactions.slice(0, 5).map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-start justify-between p-2 rounded bg-[var(--workspace-card-background)]"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-[var(--workspace-text)]">
                                            {tx.reference || "Untitled"}
                                        </p>
                                        <p className="text-xs text-[var(--workspace-text-muted)]">
                                            {new Date(tx.transactionDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-sm font-semibold text-[var(--workspace-text)]">
                                            {tx.type === "INCOME"
                                                ? "+"
                                                : "−"}
                                            ${tx.amount.toString()}
                                        </p>
                                        <p className="text-xs text-[var(--workspace-text-muted)]">
                                            {tx.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/workspace/finance/transactions"
                            className="inline-block text-xs font-medium text-[var(--workspace-primary)] hover:opacity-80"
                        >
                            View all imported transactions →
                        </Link>
                    </div>
                </WorkspaceCard>
            )}
        </div>
    );
}
