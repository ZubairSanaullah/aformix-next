import {
    AlertCircle,
    CheckCircle2,
    Info,
    TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";

type WorkspaceAlertVariant =
    | "info"
    | "success"
    | "warning"
    | "danger";

interface WorkspaceAlertProps {
    title?: string;
    children: React.ReactNode;
    variant?: WorkspaceAlertVariant;
    className?: string;
}

const icons = {
    info: Info,
    success: CheckCircle2,
    warning: TriangleAlert,
    danger: AlertCircle,
};

export default function WorkspaceAlert({
    title,
    children,
    variant = "info",
    className,
}: WorkspaceAlertProps) {
    const Icon = icons[variant];

    return (
        <div
            role="alert"
            className={cn(
                "flex gap-3 rounded-xl border p-3.5",
                {
                    "border-sky-200 bg-sky-50 text-sky-800":
                        variant === "info",

                    "border-green-200 bg-green-50 text-green-800":
                        variant === "success",

                    "border-amber-200 bg-amber-50 text-amber-800":
                        variant === "warning",

                    "border-red-200 bg-red-50 text-red-800":
                        variant === "danger",
                },
                className
            )}
        >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />

            <div className="min-w-0">
                {title && (
                    <p className="text-xs font-semibold">
                        {title}
                    </p>
                )}

                <div className="mt-0.5 text-xs leading-5 opacity-80">
                    {children}
                </div>
            </div>
        </div>
    );
}