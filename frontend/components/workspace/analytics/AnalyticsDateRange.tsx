"use client";

import { Calendar } from "lucide-react";
import WorkspaceSelect from "@/components/workspace/ui/WorkspaceSelect";
import WorkspaceInput from "@/components/workspace/ui/WorkspaceInput";

export interface DateRangeValue {
    period: string;
    startDate?: string;
    endDate?: string;
}

interface AnalyticsDateRangeProps {
    value: DateRangeValue;
    onChange: (val: DateRangeValue) => void;
    disabled?: boolean;
}

export const DATE_PERIOD_OPTIONS = [
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "this_quarter", label: "This Quarter" },
    { value: "last_quarter", label: "Last Quarter" },
    { value: "this_year", label: "This Year" },
    { value: "last_year", label: "Last Year" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this_week", label: "This Week" },
    { value: "last_week", label: "Last Week" },
    { value: "custom", label: "Custom Range" },
];

export default function AnalyticsDateRange({
    value,
    onChange,
    disabled = false,
}: AnalyticsDateRangeProps) {
    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const period = e.target.value;
        onChange({
            ...value,
            period,
        });
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...value,
            startDate: e.target.value,
        });
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...value,
            endDate: e.target.value,
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[140px] sm:min-w-[160px]">
                <div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[var(--workspace-text-muted)]">
                    <Calendar className="h-3.5 w-3.5" />
                </div>
                <WorkspaceSelect
                    value={value.period}
                    onChange={handlePeriodChange}
                    disabled={disabled}
                    className="pl-8"
                    aria-label="Select Date Range"
                >
                    {DATE_PERIOD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </WorkspaceSelect>
            </div>

            {value.period === "custom" && (
                <div className="flex items-center gap-2">
                    <WorkspaceInput
                        type="date"
                        value={value.startDate || ""}
                        onChange={handleStartDateChange}
                        disabled={disabled}
                        className="h-9 min-w-[130px]"
                        aria-label="Start Date"
                    />
                    <span className="text-xs text-[var(--workspace-text-muted)]">to</span>
                    <WorkspaceInput
                        type="date"
                        value={value.endDate || ""}
                        onChange={handleEndDateChange}
                        disabled={disabled}
                        className="h-9 min-w-[130px]"
                        aria-label="End Date"
                    />
                </div>
            )}
        </div>
    );
}
