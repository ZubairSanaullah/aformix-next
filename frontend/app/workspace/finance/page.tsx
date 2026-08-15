import { Suspense } from "react";
import Link from "next/link";
import { Plus, Upload, FileText, Settings2 } from "lucide-react";

import {
    WorkspaceAlert,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import FinanceMetricCards from "@/components/workspace/finance/FinanceMetricCards";
import FinanceRecentTransactions from "@/components/workspace/finance/FinanceRecentTransactions";
import FinanceCharts from "@/components/workspace/finance/FinanceCharts";
import FinanceSkeleton from "@/components/workspace/finance/FinanceSkeleton";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { getFinanceDashboardStats } from "@/lib/services/finance-dashboard";

interface FinanceDashboardPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FinanceDashboardPage({
    searchParams,
}: FinanceDashboardPageProps) {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <WorkspacePageHeader
                        title="Finance"
                        description="Manage financial records, track income and expenses."
                    />

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to view Finance."
                            : "Only administrators can access the Finance module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    const stats = await getFinanceDashboardStats();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-medium text-[var(--workspace-primary)]">
                        FINANCE
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                        Financial dashboard
                    </h1>

                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--workspace-text-muted)]">
                        Track income, expenses, payments, and financial metrics in
                        one centralized dashboard.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/workspace/finance/transactions/new"
                        className="
              inline-flex
              h-9
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[var(--workspace-primary)]
              px-3.5
              text-xs
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-150
              hover:opacity-90
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--workspace-background)]
            "
                    >
                        <Plus className="h-4 w-4" />
                        Add Transaction
                    </Link>

                    <Link
                        href="/workspace/finance/import"
                        className="
              inline-flex
              h-9
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-card-background)]
              px-3.5
              text-xs
              font-semibold
              text-[var(--workspace-text)]
              shadow-sm
              transition-all
              duration-150
              hover:bg-[var(--workspace-card-background-hover)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--workspace-background)]
            "
                    >
                        <Upload className="h-4 w-4" />
                        Import
                    </Link>
                </div>
            </div>

            <Suspense fallback={<FinanceSkeleton />}>
                <FinanceMetricCards stats={stats} />

                <div className="grid gap-4 lg:grid-cols-[1fr]">
                    <FinanceCharts stats={stats} />
                </div>

                <FinanceRecentTransactions transactions={stats.recentTransactions} />
            </Suspense>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    href="/workspace/finance/transactions"
                    className="
          group
          relative
          flex
          flex-col
          gap-2
          rounded-lg
          border
          border-[var(--workspace-border)]
          bg-[var(--workspace-card-background)]
          p-4
          transition-all
          duration-150
          hover:border-[var(--workspace-border-hover)]
          hover:bg-[var(--workspace-card-background-hover)]
        "
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            View All Transactions
                        </h3>
                        <FileText className="h-5 w-5 text-[var(--workspace-text-muted)] transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Browse, search, and filter all financial transactions
                    </p>
                </Link>

                <Link
                    href="/workspace/finance/import"
                    className="
          group
          relative
          flex
          flex-col
          gap-2
          rounded-lg
          border
          border-[var(--workspace-border)]
          bg-[var(--workspace-card-background)]
          p-4
          transition-all
          duration-150
          hover:border-[var(--workspace-border-hover)]
          hover:bg-[var(--workspace-card-background-hover)]
        "
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Import History
                        </h3>
                        <Upload className="h-5 w-5 text-[var(--workspace-text-muted)] transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Check import history and processing status
                    </p>
                </Link>

                <Link
                    href="/workspace/finance/categories"
                    className="
          group
          relative
          flex
          flex-col
          gap-2
          rounded-lg
          border
          border-[var(--workspace-border)]
          bg-[var(--workspace-card-background)]
          p-4
          transition-all
          duration-150
          hover:border-[var(--workspace-border-hover)]
          hover:bg-[var(--workspace-card-background-hover)]
        "
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Manage Categories
                        </h3>
                        <Settings2 className="h-5 w-5 text-[var(--workspace-text-muted)] transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-xs text-[var(--workspace-text-muted)]">
                        Create and edit transaction categories
                    </p>
                </Link>
            </div>
        </div>
    );
}
