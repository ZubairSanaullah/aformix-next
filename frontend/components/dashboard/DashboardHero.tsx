function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    }

    if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    }

    if (hour >= 17 && hour < 21) {
        return "Good Evening";
    }

    return "Working Late?";
}

export default function DashboardHero() {
    const greeting = getGreeting();

    const today = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(new Date());

    return (
        <section className="relative overflow-hidden rounded-2xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-5 py-6 sm:px-7 sm:py-7">
            <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[var(--workspace-primary)]/5 blur-3xl" />

            <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--workspace-primary)]/15 bg-[var(--workspace-primary-soft)] px-2.5 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--workspace-primary)]" />

                        <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--workspace-primary)]">
                            Workspace Overview
                        </span>
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-3xl">
                        {greeting}, Zubair.
                    </h1>

                    <p className="mt-2 max-w-xl text-xs leading-5 text-[var(--workspace-text-muted)] sm:text-sm">
                        Here's an overview of your Aformix workspace and
                        business activity.
                    </p>
                </div>

                <div className="shrink-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--workspace-text-subtle)]">
                        Today
                    </p>

                    <p className="mt-1 text-xs font-medium text-[var(--workspace-text)]">
                        {today}
                    </p>
                </div>
            </div>
        </section>
    );
}