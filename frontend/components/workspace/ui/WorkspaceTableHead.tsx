import { ReactNode } from "react";

interface WorkspaceTableHeadProps {
    children: ReactNode;
    className?: string;
}

export default function WorkspaceTableHead({
    children,
    className = "",
}: WorkspaceTableHeadProps) {
    return (
        <th
            className={`
        whitespace-nowrap
        border-b
        border-[var(--workspace-border)]
        px-4
        py-3
        text-left
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.08em]
        text-[var(--workspace-text-subtle)]
        ${className}
      `}
        >
            {children}
        </th>
    );
}