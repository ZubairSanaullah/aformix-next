import { cn } from "@/lib/utils";

interface WorkspaceCardProps {
    children: React.ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
}

export default function WorkspaceCard({
    children,
    className,
    padding = "md",
}: WorkspaceCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]",
                {
                    "p-0": padding === "none",
                    "p-3": padding === "sm",
                    "p-4": padding === "md",
                    "p-5": padding === "lg",
                },
                className
            )}
        >
            {children}
        </div>
    );
}