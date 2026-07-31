import { LucideIcon } from "lucide-react";

interface ActivityItemProps {
    title: string;
    description: string;
    time: string;
    icon: LucideIcon;
}

export default function ActivityItem({
    title,
    description,
    time,
    icon: Icon,
}: ActivityItemProps) {
    return (
        <div className="flex items-start gap-4">
            <div
                className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-muted
        "
            >
                <Icon className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1">
                <p className="font-medium">
                    {title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>

            <span className="text-xs text-muted-foreground">
                {time}
            </span>
        </div>
    );
}