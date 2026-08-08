import { ReactNode } from "react";

interface WorkspaceTableRowProps {
    children: ReactNode;
    className?: string;
}

export default function WorkspaceTableRow({
    children,
    className = "",
}: WorkspaceTableRowProps) {
    return (
        <tr
            className={`
        group
        transition-colors
        duration-150
        hover:bg-[var(--workspace-background)]
        ${className}
      `}
        >
            {children}
        </tr>
    );
}