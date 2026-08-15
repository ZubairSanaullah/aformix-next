import { Phone, Mail, Users, CheckCircle, FileText, Activity as ActivityIcon } from "lucide-react";
import ActivityItem from "./ActivityItem";
import { formatDistanceToNow } from "date-fns";

interface ActivitySectionProps {
    activities: any[];
}

export default function ActivitySection({ activities }: ActivitySectionProps) {
    const getIconForType = (type: string) => {
        switch (type) {
            case "CALL": return Phone;
            case "EMAIL": return Mail;
            case "MEETING": return Users;
            case "FOLLOW_UP": return CheckCircle;
            case "NOTE": return FileText;
            default: return ActivityIcon;
        }
    };

    return (
        <section>
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                        Recent Activity
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Latest activity across your workspace.
                    </p>
                </div>

                <button
                    type="button"
                    className="
                        text-[10px]
                        font-medium
                        text-[var(--workspace-text-muted)]
                        transition-colors
                        hover:text-[var(--workspace-primary)]
                    "
                >
                    View all
                </button>
            </div>

            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--workspace-border)]
                    bg-[var(--workspace-surface)]
                "
            >
                {activities.length > 0 ? (
                    <ul className="divide-y divide-[var(--workspace-border)]">
                        {activities.map((activity) => (
                            <li
                                key={activity.id}
                                className="px-4 py-4 transition-colors hover:bg-[var(--workspace-background)] sm:px-5"
                            >
                                <ActivityItem 
                                    title={activity.title}
                                    description={activity.description || "No description"}
                                    time={formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                    icon={getIconForType(activity.type)}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="px-4 py-8 text-center text-xs text-[var(--workspace-text-muted)]">
                        No recent activities.
                    </div>
                )}
            </div>
        </section>
    );
}