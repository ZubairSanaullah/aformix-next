import { quickActions } from "@/constants/dashboard";

import QuickActionCard from "./QuickActionCard";

export default function QuickActionsSection() {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                    Quick Actions
                </h2>

                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    Common workspace tasks and shortcuts.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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