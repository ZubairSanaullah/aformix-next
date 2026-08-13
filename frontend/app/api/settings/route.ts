import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
    getUserSettings,
    updateUserSettings,
} from "@/lib/services/settings";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const settings = await getUserSettings(session.user.id);

        return NextResponse.json({
            settings,
        });
    } catch (error) {
        console.error("GET /api/settings error:", error);

        return NextResponse.json(
            { error: "Failed to load settings" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const allowedThemes = ["LIGHT", "DARK", "SYSTEM"];
        const allowedTimeFormats = ["12H", "24H"];

        if (
            body.theme !== undefined &&
            !allowedThemes.includes(body.theme)
        ) {
            return NextResponse.json(
                { error: "Invalid theme preference" },
                { status: 400 }
            );
        }

        if (
            body.timeFormat !== undefined &&
            !allowedTimeFormats.includes(body.timeFormat)
        ) {
            return NextResponse.json(
                { error: "Invalid time format" },
                { status: 400 }
            );
        }

        const data = {
            ...(body.theme !== undefined && {
                theme: body.theme,
            }),
            ...(typeof body.language === "string" && {
                language: body.language.trim(),
            }),
            ...(typeof body.timezone === "string" && {
                timezone: body.timezone.trim(),
            }),
            ...(typeof body.dateFormat === "string" && {
                dateFormat: body.dateFormat.trim(),
            }),
            ...(body.timeFormat !== undefined && {
                timeFormat: body.timeFormat,
            }),
            ...(typeof body.sidebarCollapsed === "boolean" && {
                sidebarCollapsed: body.sidebarCollapsed,
            }),
            ...(typeof body.emailNotifications === "boolean" && {
                emailNotifications: body.emailNotifications,
            }),
            ...(typeof body.taskNotifications === "boolean" && {
                taskNotifications: body.taskNotifications,
            }),
            ...(typeof body.crmNotifications === "boolean" && {
                crmNotifications: body.crmNotifications,
            }),
            ...(typeof body.calendarNotifications === "boolean" && {
                calendarNotifications: body.calendarNotifications,
            }),
        };

        if (Object.keys(data).length === 0) {
            return NextResponse.json(
                { error: "No settings changes provided" },
                { status: 400 }
            );
        }

        const settings = await updateUserSettings(
            session.user.id,
            data
        );

        return NextResponse.json({
            message: "Settings updated successfully",
            settings,
        });
    } catch (error) {
        console.error("PATCH /api/settings error:", error);

        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}