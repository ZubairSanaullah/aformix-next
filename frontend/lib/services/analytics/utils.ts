export function calculatePercentageChange(current: number, previous: number): { change: number, changePercent: number, trend: "UP" | "DOWN" | "NEUTRAL" } {
    const change = current - previous;
    
    let changePercent = 0;
    if (previous === 0) {
        changePercent = current > 0 ? 100 : 0;
    } else {
        changePercent = Number(((change / Math.abs(previous)) * 100).toFixed(2));
    }

    let trend: "UP" | "DOWN" | "NEUTRAL" = "NEUTRAL";
    if (change > 0) trend = "UP";
    else if (change < 0) trend = "DOWN";

    return { change, changePercent, trend };
}

export function getDateRange(
    period: string, 
    customStartDate?: string, 
    customEndDate?: string
): { startDate: Date; endDate: Date } {
    const now = new Date();
    
    // Default to start/end of current day
    let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    switch (period) {
        case "today":
            break;
        case "yesterday":
            startDate.setDate(startDate.getDate() - 1);
            endDate.setDate(endDate.getDate() - 1);
            break;
        case "this_week": {
            // Assuming Monday is the first day of the week
            const day = startDate.getDay();
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
            startDate.setDate(diff);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6, 23, 59, 59, 999);
            break;
        }
        case "last_week": {
            const day = startDate.getDay();
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1) - 7;
            startDate.setDate(diff);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6, 23, 59, 59, 999);
            break;
        }
        case "this_month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        case "last_month":
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            break;
        case "this_quarter": {
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
            break;
        }
        case "last_quarter": {
            const quarter = Math.floor(now.getMonth() / 3) - 1;
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
            break;
        }
        case "this_year":
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
        case "last_year":
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            break;
        case "custom":
            if (customStartDate && customEndDate) {
                startDate = new Date(customStartDate);
                startDate.setHours(0, 0, 0, 0);
                
                endDate = new Date(customEndDate);
                endDate.setHours(23, 59, 59, 999);
            }
            break;
    }

    return { startDate, endDate };
}

export function getPreviousPeriod(startDate: Date, endDate: Date): { prevStartDate: Date; prevEndDate: Date } {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    
    // For months/years we could be more precise but this covers basic shift
    const prevStartDate = new Date(startDate.getTime() - diffTime - 1);
    const prevEndDate = new Date(startDate.getTime() - 1);
    
    return { prevStartDate, prevEndDate };
}

export function getMonthsInRange(startDate: Date, endDate: Date): string[] {
    const months: string[] = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
        // Format: YYYY-MM
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        months.push(`${year}-${month}`);
        current.setMonth(current.getMonth() + 1);
    }

    return months;
}
