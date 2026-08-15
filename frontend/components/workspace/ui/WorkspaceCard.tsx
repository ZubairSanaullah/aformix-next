import { cn } from "@/lib/utils";

interface WorkspaceCardProps {
    children: React.ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
    style?: React.CSSProperties;
}

export default function WorkspaceCard({
    children,
    className,
    padding = "md",
    style,
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
            style={style}
        >
            {children}
        </div>
    );
}