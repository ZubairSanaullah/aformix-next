import { dashboardStats } from "@/constants/dashboard";

import StatCard from "./StatCard";

export default function StatsSection() {
    return (
        <section>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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