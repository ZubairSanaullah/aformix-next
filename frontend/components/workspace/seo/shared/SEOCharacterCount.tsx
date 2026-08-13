interface SEOCharacterCountProps {
    value: string;
    min?: number;
    max: number;
}

export default function SEOCharacterCount({
    value,
    min,
    max,
}: SEOCharacterCountProps) {
    const length = value?.length ?? 0;
    const isOver = length > max;
    const isUnder = min !== undefined && length > 0 && length < min;

    const colorClass = isOver
        ? "text-[var(--workspace-danger)]"
        : isUnder
            ? "text-[var(--workspace-warning)]"
            : "text-[var(--workspace-text-subtle)]";

    return (
        <span className={colorClass}>
            {length}/{max}
        </span>
    );
}
