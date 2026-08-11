interface DealStageBadgeProps {
    name: string;
    color?: string | null;
}

export default function DealStageBadge({
    name,
    color,
}: DealStageBadgeProps) {
    if (color) {
        return (
            <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold"
                style={{
                    backgroundColor: `${color}1a`,
                    color,
                }}
            >
                {name}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full bg-[var(--workspace-primary-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--workspace-primary)]">
            {name}
        </span>
    );
}