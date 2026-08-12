import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SEORecommendationSeverity } from "@/lib/validations/seo";

interface SEOSeverityBadgeProps {
    severity: SEORecommendationSeverity;
    className?: string;
}

const SEVERITY_CONFIG: Record<
    SEORecommendationSeverity,
    { label: string; icon: typeof AlertCircle; colorVar: string }
> = {
    CRITICAL: {
        label: "Critical",
        icon: AlertCircle,
        colorVar: "--workspace-danger",
    },
    WARNING: {
        label: "Warning",
        icon: AlertTriangle,
        colorVar: "--workspace-warning",
    },
    SUCCESS: {
        label: "Good",
        icon: CheckCircle2,
        colorVar: "--workspace-success",
    },
};

export default function SEOSeverityBadge({
    severity,
    className,
}: SEOSeverityBadgeProps) {
    const config = SEVERITY_CONFIG[severity];
    const Icon = config.icon;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                className
            )}
            style={{
                backgroundColor: `color-mix(in srgb, var(${config.colorVar}) 12%, transparent)`,
                color: `var(${config.colorVar})`,
            }}
        >
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
}
