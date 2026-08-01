import Skeleton from "@/components/ui/Skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="space-y-10 py-8">
            {/* Hero */}
            <section className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </section>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-border bg-card p-6"
                    >
                        <div className="flex items-start justify-between">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <Skeleton className="h-5 w-14" />
                        </div>

                        <div className="mt-6 space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-28" />
                        </div>
                    </div>
                ))}
            </section>

            {/* Analytics */}
            <section className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6 space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>

                <Skeleton className="h-80 w-full rounded-xl" />
            </section>

            {/* Bottom Grid */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Quick Actions */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-6 space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </div>

                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 rounded-xl border border-border p-4"
                            >
                                <Skeleton className="h-10 w-10 rounded-lg" />

                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-6 space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </div>

                    <div className="space-y-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />

                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-28" />
                                </div>

                                <Skeleton className="h-3 w-12" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insights */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-6 space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>

                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-border p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <Skeleton className="h-10 w-10 rounded-lg" />

                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-3/4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}