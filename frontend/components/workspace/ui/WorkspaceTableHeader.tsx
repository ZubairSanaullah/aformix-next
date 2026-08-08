import { ReactNode } from "react";

interface WorkspaceTableHeaderProps {
    children: ReactNode;
}

export default function WorkspaceTableHeader({
    children,
}: WorkspaceTableHeaderProps) {
    return (
        <thead className="bg-[var(--workspace-background)]">
            {children}
        </thead>
    );
}