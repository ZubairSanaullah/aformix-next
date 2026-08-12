import WorkspaceBadge from "@/components/workspace/ui/WorkspaceBadge";
import {
    EVENT_TYPE_LABELS,
    type EventType,
} from "@/lib/types/scheduler";

const TYPE_VARIANT: Record<
    EventType,
    "primary" | "info" | "default" | "warning" | "neutral"
> = {
    MEETING: "primary",
    APPOINTMENT: "info",
    CALL: "warning",
    REMINDER: "neutral",
    OTHER: "default",
};

interface EventTypeBadgeProps {
    type: EventType;
    className?: string;
}

export default function EventTypeBadge({
    type,
    className,
}: EventTypeBadgeProps) {
    return (
        <WorkspaceBadge variant={TYPE_VARIANT[type]} className={className}>
            {EVENT_TYPE_LABELS[type]}
        </WorkspaceBadge>
    );
}
