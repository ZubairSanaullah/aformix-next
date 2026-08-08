import { Loader2 } from "lucide-react";

interface WorkspaceLoadingProps {
    label?: string;
    fullPage?: boolean;
}

export default function WorkspaceLoading({
    label = "Loading...",
    fullPage = false,
}: WorkspaceLoadingProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--workspace-primary-soft)]">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--workspace-primary)]" />
            </div>

            <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                {label}
            </p>
        </div>
    );

    if (fullPage) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
}