export function getScoreColorVar(score: number): string {
    if (score >= 80) return "--workspace-success";
    if (score >= 50) return "--workspace-warning";
    return "--workspace-danger";
}

export function getScoreLabel(score: number): string {
    if (score >= 80) return "Healthy";
    if (score >= 50) return "Needs improvement";
    return "Critical";
}
