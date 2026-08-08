import { cn } from "@/lib/utils";

interface WorkspaceDividerProps {
    className?: string;
}

export default function WorkspaceDivider({
    className,
}: WorkspaceDividerProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "h-px w-full bg-[var(--workspace-border)]",
                className
            )}
        />
    );
}