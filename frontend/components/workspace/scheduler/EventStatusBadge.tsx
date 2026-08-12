import WorkspaceBadge from "@/components/workspace/ui/WorkspaceBadge";
import {
    EVENT_STATUS_LABELS,
    type EventStatus,
} from "@/lib/types/scheduler";

const STATUS_VARIANT: Record<
    EventStatus,
    "info" | "success" | "danger"
> = {
    SCHEDULED: "info",
    COMPLETED: "success",
    CANCELLED: "danger",
};

interface EventStatusBadgeProps {
    status: EventStatus;
    className?: string;
}

export default function EventStatusBadge({
    status,
    className,
}: EventStatusBadgeProps) {
    return (
        <WorkspaceBadge
            variant={STATUS_VARIANT[status]}
            className={className}
        >
            {EVENT_STATUS_LABELS[status]}
        </WorkspaceBadge>
    );
}
