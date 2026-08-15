"use client";

import {
    DollarSign,
    CreditCard,
    TrendingUp,
    Clock,
    Users,
    Briefcase,
    FolderKanban,
    CheckSquare,
} from "lucide-react";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceSkeleton from "@/components/workspace/ui/WorkspaceSkeleton";
import AnalyticsKpiCard, { KpiComparison } from "./AnalyticsKpiCard";

interface OverviewData {
    current: {
        finance: {
            totalRevenue: number;
            totalExpenses: number;
            totalPending: number;
            netIncome: number;
        };
        crm: {
            leads: { total: number };
            deals: { total: number };
        };
        projects: {
            projects: { total: number; active: number };
            tasks: { total: number; completed: number };
        };
    };
    comparisons?: {
        revenue?: KpiComparison;
        expenses?: KpiComparison;
        netIncome?: KpiComparison;
        leads?: KpiComparison;
        deals?: KpiComparison;
        projects?: KpiComparison;
        activeProjects?: KpiComparison;
        tasksCompleted?: KpiComparison;
    } | null;
}

interface AnalyticsOverviewProps {
    data?: OverviewData | null;
    isLoading?: boolean;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function AnalyticsOverview({
    data,
    isLoading = false,
}: AnalyticsOverviewProps) {
    if (isLoading || !data) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <WorkspaceCard key={i} padding="md" className="space-y-3">
                        <div className="flex items-center justify-between">
                            <WorkspaceSkeleton className="h-4 w-24" />
                            <WorkspaceSkeleton className="h-7 w-7 rounded-lg" />
                        </div>
                        <WorkspaceSkeleton className="h-7 w-32" />
                        <WorkspaceSkeleton className="h-4 w-28" />
                    </WorkspaceCard>
                ))}
            </div>
        );
    }

    const { current, comparisons } = data;

    return (
        <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--workspace-text-subtle)]">
                Performance Overview
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AnalyticsKpiCard
                    title="Revenue"
                    value={formatCurrency(current.finance.totalRevenue)}
                    icon={DollarSign}
                    comparison={comparisons?.revenue}
                    iconColorClass="text-emerald-500"
                />

                <AnalyticsKpiCard
                    title="Expenses"
                    value={formatCurrency(current.finance.totalExpenses)}
                    icon={CreditCard}
                    comparison={comparisons?.expenses}
                    invertTrendColor
                    iconColorClass="text-rose-500"
                />

                <AnalyticsKpiCard
                    title="Net Income"
                    value={formatCurrency(current.finance.netIncome)}
                    icon={TrendingUp}
                    comparison={comparisons?.netIncome}
                    iconColorClass="text-[var(--workspace-primary)]"
                />

                <AnalyticsKpiCard
                    title="Pending Payments"
                    value={formatCurrency(current.finance.totalPending)}
                    icon={Clock}
                    subtitle="Awaiting settlement"
                    iconColorClass="text-amber-500"
                />

                <AnalyticsKpiCard
                    title="Total Leads"
                    value={current.crm.leads.total.toLocaleString()}
                    icon={Users}
                    comparison={comparisons?.leads}
                    iconColorClass="text-blue-500"
                />

                <AnalyticsKpiCard
                    title="Total Deals"
                    value={current.crm.deals.total.toLocaleString()}
                    icon={Briefcase}
                    comparison={comparisons?.deals}
                    iconColorClass="text-purple-500"
                />

                <AnalyticsKpiCard
                    title="Total Projects"
                    value={current.projects.projects.total.toLocaleString()}
                    icon={FolderKanban}
                    comparison={comparisons?.projects}
                    subtitle={`${current.projects.projects.active} active`}
                    iconColorClass="text-cyan-500"
                />

                <AnalyticsKpiCard
                    title="Completed Tasks"
                    value={current.projects.tasks.completed.toLocaleString()}
                    icon={CheckSquare}
                    comparison={comparisons?.tasksCompleted}
                    subtitle={`Out of ${current.projects.tasks.total} tasks`}
                    iconColorClass="text-emerald-500"
                />
            </div>
        </div>
    );
}
