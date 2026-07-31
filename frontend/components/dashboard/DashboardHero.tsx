function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "Good Morning ☀️";
    }

    if (hour >= 12 && hour < 17) {
        return "Good Afternoon 👋";
    }

    if (hour >= 17 && hour < 21) {
        return "Good Evening 🌆";
    }

    return "Working Late? 🌙";
}

export default function DashboardHero() {
    const greeting = getGreeting();

    const today = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(new Date());

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">
                    {greeting}, Zubair
                </h1>

                <p className="mt-2 text-lg text-muted-foreground">
                    Here's an overview of your workspace today.
                </p>
            </div>

            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    Today is {today}
                </p>
            </div>
        </div>
    );
}