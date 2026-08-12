"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceTabs from "@/components/workspace/ui/WorkspaceTabs";

import {
    formatDayHeading,
    formatMonthYear,
    formatWeekRange,
} from "@/lib/scheduler/date-utils";
import type { CalendarViewMode } from "@/lib/types/scheduler";

interface CalendarToolbarProps {
    currentDate: Date;
    view: CalendarViewMode;
    onViewChange: (view: CalendarViewMode) => void;
    onNavigate: (direction: "prev" | "next" | "today") => void;
    isMobile?: boolean;
}

const VIEW_TABS: { id: CalendarViewMode; label: string }[] = [
    { id: "month", label: "Month" },
    { id: "week", label: "Week" },
    { id: "day", label: "Day" },
    { id: "agenda", label: "Agenda" },
];

// On small screens the 7-column month/week grids become unusable
// rather than just cramped, so those views aren't offered at all —
// per the roadmap: don't shrink the desktop calendar until it breaks.
const MOBILE_VIEW_TABS: { id: CalendarViewMode; label: string }[] = [
    { id: "day", label: "Day" },
    { id: "agenda", label: "Agenda" },
];

export default function CalendarToolbar({
    currentDate,
    view,
    onViewChange,
    onNavigate,
    isMobile = false,
}: CalendarToolbarProps) {
    const heading =
        view === "month"
            ? formatMonthYear(currentDate)
            : view === "week"
              ? formatWeekRange(currentDate)
              : view === "day"
                ? formatDayHeading(currentDate)
                : "Agenda";

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <WorkspaceButton
                        variant="ghost"
                        size="icon"
                        onClick={() => onNavigate("prev")}
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </WorkspaceButton>

                    <WorkspaceButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate("today")}
                    >
                        Today
                    </WorkspaceButton>

                    <WorkspaceButton
                        variant="ghost"
                        size="icon"
                        onClick={() => onNavigate("next")}
                        aria-label="Next"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </WorkspaceButton>
                </div>

                <h2 className="text-sm font-semibold text-[var(--workspace-text)] sm:text-base">
                    {heading}
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <WorkspaceTabs
                    tabs={isMobile ? MOBILE_VIEW_TABS : VIEW_TABS}
                    activeTab={view}
                    onChange={(id) => onViewChange(id as CalendarViewMode)}
                />

                <Link href="/workspace/scheduler/create">
                    <WorkspaceButton size="sm">
                        <Plus className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">New Event</span>
                        <span className="sm:hidden">New</span>
                    </WorkspaceButton>
                </Link>
            </div>
        </div>
    );
}
