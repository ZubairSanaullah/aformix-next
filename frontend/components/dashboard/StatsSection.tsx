import { dashboardStats } from "@/constants/dashboard";

import StatCard from "./StatCard";

export default function StatsSection() {
    return (
        <section>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                        At a glance
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Key numbers across your workspace.
                    </p>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        {...stat}
                    />
                ))}
            </div>
        </section>
    );
}