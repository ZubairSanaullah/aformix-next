import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    icon: LucideIcon;
}

export default function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: StatCardProps) {
    return (
        <div
            className="
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-md
      "
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                    {title}
                </p>

                <div
                    className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-muted
          "
                >
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            </div>

            <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight">
                    {value}
                </h3>

                {description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}