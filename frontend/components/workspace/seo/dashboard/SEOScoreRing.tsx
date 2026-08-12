interface SEOScoreRingProps {
    score: number;
    size?: number;
    strokeWidth?: number;
}

function getScoreColorVar(score: number): string {
    if (score >= 80) return "--workspace-success";
    if (score >= 50) return "--workspace-warning";
    return "--workspace-danger";
}

export default function SEOScoreRing({
    score,
    size = 96,
    strokeWidth = 8,
}: SEOScoreRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedScore = Math.max(0, Math.min(100, score));
    const offset = circumference - (clampedScore / 100) * circumference;
    const colorVar = getScoreColorVar(clampedScore);

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="-rotate-90"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--workspace-border)"
                    strokeWidth={strokeWidth}
                />

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={`var(${colorVar})`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[var(--workspace-text)]">
                    {clampedScore}
                </span>
                <span className="text-[10px] font-medium text-[var(--workspace-text-subtle)]">
                    / 100
                </span>
            </div>
        </div>
    );
}
