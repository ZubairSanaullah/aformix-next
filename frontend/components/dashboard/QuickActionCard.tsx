import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export default function QuickActionCard({
    title,
    description,
    icon: Icon,
}: QuickActionCardProps) {
    return (
        <button
            className="
        group
        rounded-2xl
        border
        border-border
        bg-card
        p-5
        text-left
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-md
      "
        >
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

            <h3 className="mt-4 font-semibold">
                {title}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
                {description}
            </p>
        </button>
    );
}