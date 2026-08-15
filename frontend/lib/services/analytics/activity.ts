import { prisma } from "@/lib/prisma";

export async function getActivityAnalytics(startDate: Date, endDate: Date) {
    const activities = await prisma.activity.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            type: true,
            completedAt: true,
        }
    });

    const totalActivities = activities.length;
    let completedActivities = 0;
    let pendingActivities = 0;

    let calls = 0;
    let emails = 0;
    let meetings = 0;
    let followUps = 0;
    let notes = 0;
    let otherActivities = 0;

    for (const activity of activities) {
        if (activity.completedAt) completedActivities++;
        else pendingActivities++;

        switch (activity.type) {
            case "CALL": calls++; break;
            case "EMAIL": emails++; break;
            case "MEETING": meetings++; break;
            case "FOLLOW_UP": followUps++; break;
            case "NOTE": notes++; break;
            case "OTHER": otherActivities++; break;
            default:
                // Catch any system-generated activities (e.g. PORTFOLIO_PROJECT_CREATED) 
                // in the 'other' bucket if we only want base metrics.
                otherActivities++;
                break;
        }
    }

    const events = await prisma.calendarEvent.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            type: true,
            status: true,
            startAt: true,
        }
    });

    const totalEvents = events.length;
    let completedEvents = 0;
    let cancelledEvents = 0;
    let upcomingEvents = 0;

    let eventMeetings = 0;
    let appointments = 0;
    let eventCalls = 0;
    let reminders = 0;

    const now = new Date();

    for (const event of events) {
        if (event.status === "COMPLETED") completedEvents++;
        else if (event.status === "CANCELLED") cancelledEvents++;
        else if (event.status === "SCHEDULED" && event.startAt > now) upcomingEvents++;

        switch (event.type) {
            case "MEETING": eventMeetings++; break;
            case "APPOINTMENT": appointments++; break;
            case "CALL": eventCalls++; break;
            case "REMINDER": reminders++; break;
        }
    }

    return {
        activity: {
            total: totalActivities,
            completed: completedActivities,
            pending: pendingActivities,
            breakdown: {
                calls,
                emails,
                meetings,
                followUps,
                notes,
                other: otherActivities
            }
        },
        calendar: {
            total: totalEvents,
            completed: completedEvents,
            cancelled: cancelledEvents,
            upcoming: upcomingEvents,
            breakdown: {
                meetings: eventMeetings,
                appointments,
                calls: eventCalls,
                reminders
            }
        }
    };
}
