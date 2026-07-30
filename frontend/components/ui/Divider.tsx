import { cn } from "@/lib/utils";

interface DividerProps {
    className?: string;
}

export default function Divider({
    className,
}: DividerProps) {
    return (
        <div
            role="separator"
            className={cn(
                "h-px w-full bg-border",
                className
            )}
        />
    );
}