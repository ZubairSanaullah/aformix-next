import {
    Phone,
    Mail,
    Users,
    Repeat,
    StickyNote,
    CircleDot,
} from "lucide-react";

export type ActivityType =
    | "CALL"
    | "EMAIL"
    | "MEETING"
    | "FOLLOW_UP"
    | "NOTE"
    | "OTHER";

const typeConfig: Record<
    ActivityType,
    { label: string; icon: typeof Phone }
> = {
    CALL: { label: "Call", icon: Phone },
    EMAIL: { label: "Email", icon: Mail },
    MEETING: { label: "Meeting", icon: Users },
    FOLLOW_UP: { label: "Follow-up", icon: Repeat },
    NOTE: { label: "Note", icon: StickyNote },
    OTHER: { label: "Other", icon: CircleDot },
};

interface ActivityTypeIconProps {
    type: ActivityType;
    className?: string;
}

export function ActivityTypeIcon({
    type,
    className,
}: ActivityTypeIconProps) {
    const Icon = typeConfig[type]?.icon ?? CircleDot;

    return <Icon className={className ?? "h-4 w-4"} />;
}

export function formatActivityType(type: ActivityType) {
    return typeConfig[type]?.label ?? type;
}

interface ActivityStatusBadgeProps {
    dueAt: string | Date | null;
    completedAt: string | Date | null;
}

export default function ActivityStatusBadge({
    dueAt,
    completedAt,
}: ActivityStatusBadgeProps) {
    if (completedAt) {
        return (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                Completed
            </span>
        );
    }

    if (dueAt && new Date(dueAt) < new Date()) {
        return (
            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-700">
                Overdue
            </span>
        );
    }

    if (dueAt) {
        return (
            <span className="inline-flex items-center rounded-full bg-[var(--workspace-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--workspace-primary)]">
                Upcoming
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full bg-[var(--workspace-background)] px-2 py-1 text-[10px] font-semibold text-[var(--workspace-text-muted)]">
            No due date
        </span>
    );
}