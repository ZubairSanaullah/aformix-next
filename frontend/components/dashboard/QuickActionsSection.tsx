import SectionHeader from "@/components/ui/SectionHeader";

import { quickActions } from "@/constants/dashboard";

import QuickActionCard from "./QuickActionCard";

export default function QuickActionsSection() {
    return (
        <section className="space-y-6">
            <SectionHeader
                title="Quick Actions"
                description="Create and manage your workspace faster."
            />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {quickActions.map((action) => (
                    <QuickActionCard
                        key={action.title}
                        {...action}
                    />
                ))}
            </div>
        </section>
    );
}