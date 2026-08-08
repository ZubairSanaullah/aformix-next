import { ReactNode } from "react";

interface WorkspaceTableCellProps {
    children: ReactNode;
    className?: string;
}

export default function WorkspaceTableCell({
    children,
    className = "",
}: WorkspaceTableCellProps) {
    return (
        <td
            className={`
        px-4
        py-3.5
        text-sm
        text-[var(--workspace-text)]
        ${className}
      `}
        >
            {children}
        </td>
    );
}