import { cn } from "@/lib/utils";

interface WorkspaceTableProps {
    children: React.ReactNode;
    className?: string;
}

interface WorkspaceTableHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface WorkspaceTableRowProps {
    children: React.ReactNode;
    className?: string;
}

export function WorkspaceTable({
    children,
    className,
}: WorkspaceTableProps) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]",
                className
            )}
        >
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    {children}
                </table>
            </div>
        </div>
    );
}

export function WorkspaceTableHeader({
    children,
    className,
}: WorkspaceTableHeaderProps) {
    return (
        <thead
            className={cn(
                "border-b border-[var(--workspace-border)] bg-[var(--workspace-background)]",
                className
            )}
        >
            {children}
        </thead>
    );
}

export function WorkspaceTableRow({
    children,
    className,
}: WorkspaceTableRowProps) {
    return (
        <tr
            className={cn(
                "border-b border-[var(--workspace-border)] last:border-b-0 transition-colors hover:bg-[var(--workspace-background)]/70",
                className
            )}
        >
            {children}
        </tr>
    );
}

export function WorkspaceTableHead({
    children,
    className,
}: WorkspaceTableHeaderProps) {
    return (
        <th
            className={cn(
                "whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--workspace-text-muted)]",
                className
            )}
        >
            {children}
        </th>
    );
}

export function WorkspaceTableCell({
    children,
    className,
}: WorkspaceTableHeaderProps) {
    return (
        <td
            className={cn(
                "px-4 py-3 text-xs text-[var(--workspace-text)]",
                className
            )}
        >
            {children}
        </td>
    );
}