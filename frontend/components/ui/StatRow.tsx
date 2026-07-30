import { cn } from "@/lib/utils";

interface StatRowProps {
    label: string;
    value: React.ReactNode;
    className?: string;
}

export default function StatRow({
    label,
    value,
    className,
}: StatRowProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between text-sm",
                className
            )}
        >
            <span className="text-[var(--color-text-muted)]">
                {label}
            </span>

            <span className="font-semibold text-[var(--color-text)]">
                {value}
            </span>
        </div>
    );
}