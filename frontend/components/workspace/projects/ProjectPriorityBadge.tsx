import type { ProjectPriority } from "@prisma/client";

import { WorkspaceBadge } from "@/components/workspace/ui";

import {
    formatProjectPriority,
    getProjectPriorityBadgeVariant,
} from "@/lib/utils/project-format";

interface ProjectPriorityBadgeProps {
    priority: ProjectPriority;
}

export default function ProjectPriorityBadge({
    priority,
}: ProjectPriorityBadgeProps) {
    return (
        <WorkspaceBadge variant={getProjectPriorityBadgeVariant(priority)}>
            {formatProjectPriority(priority)}
        </WorkspaceBadge>
    );
}
