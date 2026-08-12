"use client";

import WorkspaceFilterBar from "@/components/workspace/ui/WorkspaceFilterBar";
import WorkspaceSearch from "@/components/workspace/ui/WorkspaceSearch";
import WorkspaceSelect from "@/components/workspace/ui/WorkspaceSelect";

import {
    EVENT_STATUSES,
    EVENT_STATUS_LABELS,
    EVENT_TYPES,
    EVENT_TYPE_LABELS,
    type SchedulerEventFilters,
} from "@/lib/types/scheduler";

interface CalendarFiltersProps {
    filters: SchedulerEventFilters;
    onChange: (filters: SchedulerEventFilters) => void;
}

export default function CalendarFilters({
    filters,
    onChange,
}: CalendarFiltersProps) {
    const hasFilters = Boolean(
        filters.search || filters.type || filters.status || filters.relationship
    );

    function reset() {
        onChange({
            ...filters,
            search: "",
            type: "",
            status: "",
            relationship: "",
        });
    }

    return (
        <WorkspaceFilterBar showReset={hasFilters} onReset={reset}>
            <WorkspaceSearch
                value={filters.search ?? ""}
                onChange={(value) => onChange({ ...filters, search: value })}
                placeholder="Search events..."
                className="sm:w-64"
            />

            <WorkspaceSelect
                value={filters.type ?? ""}
                onChange={(e) =>
                    onChange({
                        ...filters,
                        type: e.target.value as SchedulerEventFilters["type"],
                    })
                }
                aria-label="Filter by type"
                className="w-auto min-w-[130px]"
            >
                <option value="">All Types</option>
                {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                        {EVENT_TYPE_LABELS[type]}
                    </option>
                ))}
            </WorkspaceSelect>

            <WorkspaceSelect
                value={filters.status ?? ""}
                onChange={(e) =>
                    onChange({
                        ...filters,
                        status: e.target
                            .value as SchedulerEventFilters["status"],
                    })
                }
                aria-label="Filter by status"
                className="w-auto min-w-[130px]"
            >
                <option value="">All Statuses</option>
                {EVENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                        {EVENT_STATUS_LABELS[status]}
                    </option>
                ))}
            </WorkspaceSelect>

            <WorkspaceSelect
                value={filters.relationship ?? ""}
                onChange={(e) =>
                    onChange({
                        ...filters,
                        relationship: e.target
                            .value as SchedulerEventFilters["relationship"],
                    })
                }
                aria-label="Filter by CRM relationship"
                className="w-auto min-w-[150px]"
            >
                <option value="">Any Relationship</option>
                <option value="contact">Has Contact</option>
                <option value="company">Has Company</option>
                <option value="lead">Has Lead</option>
                <option value="deal">Has Deal</option>
                <option value="task">Has Task</option>
            </WorkspaceSelect>
        </WorkspaceFilterBar>
    );
}
