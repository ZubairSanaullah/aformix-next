import { cn } from "@/lib/utils";

interface WorkspaceSkeletonProps {
    className?: string;
}

export default function WorkspaceSkeleton({
    className,
}: WorkspaceSkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "animate-pulse rounded-lg bg-[var(--workspace-border)]/60",
                className
            )}
        />
    );
}