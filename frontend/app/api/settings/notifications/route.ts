import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_PREFERENCES = {
    emailNotifications: true,
    taskReminders: true,
    calendarReminders: true,
    crmNotifications: true,
    systemNotifications: true,
};

const ALLOWED_FIELDS = [
    "emailNotifications",
    "taskReminders",
    "calendarReminders",
    "crmNotifications",
    "systemNotifications",
] as const;

type NotificationField = (typeof ALLOWED_FIELDS)[number];

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const preferences =
            await prisma.notificationPreference.upsert({
                where: {
                    userId: session.user.id,
                },
                create: {
                    userId: session.user.id,
                    ...DEFAULT_PREFERENCES,
                },
                update: {},
            });

        return NextResponse.json(preferences);
    } catch (error) {
        console.error(
            "GET /api/settings/notifications error:",
            error,
        );

        return NextResponse.json(
            { error: "Failed to load notification preferences." },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body: unknown = await request.json();

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json(
                { error: "Invalid notification preference data." },
                { status: 400 },
            );
        }

        const input = body as Record<string, unknown>;

        const data: Partial<Record<NotificationField, boolean>> = {};

        for (const field of ALLOWED_FIELDS) {
            if (typeof input[field] === "boolean") {
                data[field] = input[field];
            }
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json(
                { error: "No valid preference fields provided." },
                { status: 400 },
            );
        }

        const preferences =
            await prisma.notificationPreference.upsert({
                where: {
                    userId: session.user.id,
                },
                create: {
                    userId: session.user.id,
                    ...DEFAULT_PREFERENCES,
                    ...data,
                },
                update: data,
            });

        return NextResponse.json(preferences);
    } catch (error) {
        console.error(
            "PATCH /api/settings/notifications error:",
            error,
        );

        return NextResponse.json(
            { error: "Failed to update notification preferences." },
            { status: 500 },
        );
    }
}