import { Sparkles } from "lucide-react";

interface AIInsightCardProps {
    title: string;
    description: string;
    insights: string[];
}

export default function AIInsightCard({
    title,
    description,
    insights,
}: AIInsightCardProps) {
    return (
        <div
            className="
        rounded-2xl
        border
        border-border
        bg-card
        p-6
      "
        >
            <div className="flex items-start gap-4">
                <div
                    className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-muted
          "
                >
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>

                <div>
                    <h3 className="font-semibold">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            <ul className="mt-5 space-y-3">
                {insights.map((insight) => (
                    <li
                        key={insight}
                        className="flex items-start gap-2 text-sm"
                    >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />

                        <span>
                            {insight}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}