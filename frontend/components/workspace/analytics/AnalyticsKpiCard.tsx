"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import { cn } from "@/lib/utils";

export interface KpiComparison {
    change: number;
    changePercent: number;
    trend: "UP" | "DOWN" | "NEUTRAL";
}

interface AnalyticsKpiCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    subtitle?: string;
    comparison?: KpiComparison | null;
    invertTrendColor?: boolean;
    iconColorClass?: string;
}

export default function AnalyticsKpiCard({
    title,
    value,
    icon: Icon,
    subtitle,
    comparison,
    invertTrendColor = false,
    iconColorClass = "text-[var(--workspace-primary)]",
}: AnalyticsKpiCardProps) {
    const renderTrend = () => {
        if (!comparison) return null;

        const { changePercent, trend } = comparison;
        const formattedPercent = `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}%`;

        let isPositive = trend === "UP";
        if (invertTrendColor) isPositive = trend === "DOWN";

        let badgeBg = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
        let TrendIcon = TrendingUp;

        if (trend === "DOWN") {
            TrendIcon = TrendingDown;
            badgeBg = isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
        } else if (trend === "NEUTRAL") {
            TrendIcon = Minus;
            badgeBg = "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
        } else if (!isPositive) {
            badgeBg = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
        }

        return (
            <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-medium",
                        badgeBg
                    )}
                >
                    <TrendIcon className="h-3 w-3" />
                    <span>{formattedPercent}</span>
                </span>
                <span className="text-[var(--workspace-text-subtle)] truncate">vs previous period</span>
            </div>
        );
    };

    return (
        <WorkspaceCard padding="md" className="flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-[var(--workspace-text-muted)] truncate">
                        {title}
                    </p>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] shrink-0">
                        <Icon className={cn("h-4 w-4", iconColorClass)} />
                    </div>
                </div>

                <div className="mt-2">
                    <h3 className="text-lg font-bold tracking-tight text-[var(--workspace-text)] sm:text-xl">
                        {value}
                    </h3>
                </div>
            </div>

            {renderTrend()}

            {subtitle && !comparison && (
                <p className="mt-2 text-[11px] text-[var(--workspace-text-muted)] truncate">
                    {subtitle}
                </p>
            )}
        </WorkspaceCard>
    );
}
