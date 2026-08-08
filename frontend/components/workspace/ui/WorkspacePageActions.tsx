import { cn } from "@/lib/utils";

interface WorkspacePageActionsProps {
    children: React.ReactNode;
    className?: string;
}

export default function WorkspacePageActions({
    children,
    className,
}: WorkspacePageActionsProps) {
    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-2",
                className
            )}
        >
            {children}
        </div>
    );
}