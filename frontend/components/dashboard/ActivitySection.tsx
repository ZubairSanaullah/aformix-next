import SectionHeader from "@/components/ui/SectionHeader";

import { recentActivities } from "@/constants/dashboard";

import ActivityItem from "./ActivityItem";

export default function ActivitySection() {
    return (
        <section className="space-y-6">
            <SectionHeader
                title="Recent Activity"
                description="Latest updates from your workspace."
            />

            <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
                {recentActivities.map((activity) => (
                    <ActivityItem
                        key={activity.title}
                        {...activity}
                    />
                ))}
            </div>
        </section>
    );
}