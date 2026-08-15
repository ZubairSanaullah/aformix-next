"use client";

import { RefreshCw } from "lucide-react";
import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import AnalyticsDateRange, { DateRangeValue } from "./AnalyticsDateRange";

interface AnalyticsHeaderProps {
    dateRange: DateRangeValue;
    onDateRangeChange: (val: DateRangeValue) => void;
    compare: boolean;
    onCompareChange: (compare: boolean) => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export default function AnalyticsHeader({
    dateRange,
    onDateRangeChange,
    compare,
    onCompareChange,
    onRefresh,
    isRefreshing = false,
}: AnalyticsHeaderProps) {
    return (
        <WorkspacePageHeader
            title="Analytics"
            description="Business performance, financial insights, CRM metrics, and operation trends across Aformix."
            breadcrumbs={[
                { label: "Workspace", href: "/workspace" },
                { label: "Analytics" },
            ]}
            actions={
                <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-xs font-medium text-[var(--workspace-text-muted)] cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={compare}
                            onChange={(e) => onCompareChange(e.target.checked)}
                            className="h-4 w-4 rounded border-[var(--workspace-border)] text-[var(--workspace-primary)] focus:ring-[var(--workspace-primary)]/20"
                        />
                        <span>Compare previous</span>
                    </label>

                    <AnalyticsDateRange
                        value={dateRange}
                        onChange={onDateRangeChange}
                        disabled={isRefreshing}
                    />

                    <WorkspaceButton
                        variant="secondary"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        title="Refresh analytics data"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${
                                isRefreshing ? "animate-spin text-[var(--workspace-primary)]" : ""
                            }`}
                        />
                        <span className="hidden sm:inline">Refresh</span>
                    </WorkspaceButton>
                </div>
            }
        />
    );
}
