// Small, dependency-free date-math helpers for the calendar grid.
// Weeks start on Sunday. All functions operate on local time.

export function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

export function addDays(date: Date, amount: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + amount);
    return d;
}

export function addMonths(date: Date, amount: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + amount);
    return d;
}

export function startOfWeek(date: Date): Date {
    const d = startOfDay(date);
    d.setDate(d.getDate() - d.getDay());
    return d;
}

export function endOfWeek(date: Date): Date {
    return endOfDay(addDays(startOfWeek(date), 6));
}

export function startOfMonth(date: Date): Date {
    return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function endOfMonth(date: Date): Date {
    return endOfDay(
        new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );
}

/**
 * The visible grid range for a month view — always full weeks,
 * so the grid includes the leading/trailing days from adjacent months.
 */
export function monthGridRange(date: Date): {
    start: Date;
    end: Date;
} {
    return {
        start: startOfWeek(startOfMonth(date)),
        end: endOfWeek(endOfMonth(date)),
    };
}

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function isSameMonth(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth()
    );
}

export function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
}

/** Array of Date objects between start and end (inclusive), one per day. */
export function eachDayOfRange(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    let cursor = startOfDay(start);
    const last = startOfDay(end);

    while (cursor.getTime() <= last.getTime()) {
        days.push(new Date(cursor));
        cursor = addDays(cursor, 1);
    }

    return days;
}

/** Split an array of days into week-sized (7-day) chunks. */
export function chunkIntoWeeks(days: Date[]): Date[][] {
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    return weeks;
}

export function formatMonthYear(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(date);
}

export function formatWeekRange(date: Date): string {
    const start = startOfWeek(date);
    const end = endOfWeek(date);

    const sameMonth = isSameMonth(start, end);

    const startLabel = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(start);

    const endLabel = new Intl.DateTimeFormat("en-US", {
        month: sameMonth ? undefined : "short",
        day: "numeric",
        year: "numeric",
    }).format(end);

    return `${startLabel} – ${endLabel}`;
}

export function formatDayHeading(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export function formatTime(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

/** Convert a Date to the value expected by <input type="datetime-local">. */
export function toDateTimeLocalValue(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");

    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
}

/** Hour labels for the day/week time-grid views (e.g. "12 AM", "1 AM", ...). */
export function hourLabels(): string[] {
    return Array.from({ length: 24 }, (_, hour) => {
        const d = new Date();
        d.setHours(hour, 0, 0, 0);
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
        }).format(d);
    });
}
