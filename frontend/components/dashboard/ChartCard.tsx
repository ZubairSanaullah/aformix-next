interface ChartCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export default function ChartCard({
    title,
    description,
    children,
}: ChartCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold">
                    {title}
                </h3>

                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div>
                {children}
            </div>
        </div>
    );
}