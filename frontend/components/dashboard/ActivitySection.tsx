import { recentActivities } from "@/constants/dashboard";

import ActivityItem from "./ActivityItem";

export default function ActivitySection() {
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
                <ul className="divide-y divide-[var(--workspace-border)]">
                    {recentActivities.map((activity) => (
                        <li
                            key={activity.title}
                            className="px-4 py-4 transition-colors hover:bg-[var(--workspace-background)] sm:px-5"
                        >
                            <ActivityItem {...activity} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}