interface SectionHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export default function SectionHeader({
    title,
    description,
    action,
}: SectionHeaderProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
}