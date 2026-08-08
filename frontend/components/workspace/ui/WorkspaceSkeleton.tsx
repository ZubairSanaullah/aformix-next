interface WorkspaceSkeletonProps {
    className?: string;
}

export default function WorkspaceSkeleton({
    className = "",
}: WorkspaceSkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={`
        animate-pulse
        rounded-lg
        bg-[var(--workspace-skeleton)]
        ${className}
      `}
        />
    );
}