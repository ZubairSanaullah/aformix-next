import WorkspaceBreadcrumbs from "./WorkspaceBreadcrumbs";

interface WorkspacePageHeaderProps {
    title?: string;
    description?: string;
    breadcrumbs?: {
        label: string;
        href?: string;
    }[];
    actions?: React.ReactNode;
    children?: React.ReactNode;
}

export default function WorkspacePageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    children,
}: WorkspacePageHeaderProps) {
    return (
        <header className="space-y-4">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <WorkspaceBreadcrumbs items={breadcrumbs} />
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    {title && (
                        <h1 className="text-xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-2xl">
                            {title}
                        </h1>
                    )}

                    {description && (
                        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[var(--workspace-text-muted)] sm:text-sm">
                            {description}
                        </p>
                    )}
                </div>

                {(actions || children) && (
                    <div className="flex shrink-0 items-center gap-2">
                        {actions}
                        {children}
                    </div>
                )}
            </div>
        </header>
    );
}