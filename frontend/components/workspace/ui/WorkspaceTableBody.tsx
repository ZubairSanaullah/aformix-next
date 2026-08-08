import { ReactNode } from "react";

interface WorkspaceTableBodyProps {
    children: ReactNode;
}

export default function WorkspaceTableBody({
    children,
}: WorkspaceTableBodyProps) {
    return (
        <tbody className="divide-y divide-[var(--workspace-border)]">
            {children}
        </tbody>
    );
}