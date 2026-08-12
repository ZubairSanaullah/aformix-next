import { cn } from "@/lib/utils";

interface SEORobotsBadgesProps {
    noIndex: boolean;
    noFollow: boolean;
    className?: string;
}

function RobotsPill({
    active,
    activeLabel,
    inactiveLabel,
}: {
    active: boolean;
    activeLabel: string;
    inactiveLabel: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                active
                    ? "border-[var(--workspace-border)] bg-[var(--workspace-background)] text-[var(--workspace-text-muted)]"
                    : "border-[var(--workspace-success)]/30 bg-[var(--workspace-success)]/10 text-[var(--workspace-success)]"
            )}
        >
            {active ? activeLabel : inactiveLabel}
        </span>
    );
}

export default function SEORobotsBadges({
    noIndex,
    noFollow,
    className,
}: SEORobotsBadgesProps) {
    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <RobotsPill
                active={noIndex}
                activeLabel="No Index"
                inactiveLabel="Index"
            />
            <RobotsPill
                active={noFollow}
                activeLabel="No Follow"
                inactiveLabel="Follow"
            />
        </div>
    );
}
