import { WorkspaceBadge } from "@/components/workspace/ui";

type ContactStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

interface ContactStatusBadgeProps {
    status: ContactStatus;
}

export default function ContactStatusBadge({
    status,
}: ContactStatusBadgeProps) {
    const config = {
        ACTIVE: {
            label: "Active",
            variant: "success" as const,
        },
        INACTIVE: {
            label: "Inactive",
            variant: "warning" as const,
        },
        ARCHIVED: {
            label: "Archived",
            variant: "neutral" as const,
        },
    };

    const current = config[status];

    return (
        <WorkspaceBadge variant={current.variant}>
            {current.label}
        </WorkspaceBadge>
    );
}