import { prisma } from "@/lib/prisma";

export type UserSettingsUpdate = {
    theme?: "LIGHT" | "DARK" | "SYSTEM";
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: "12H" | "24H";
    sidebarCollapsed?: boolean;
    emailNotifications?: boolean;
    taskNotifications?: boolean;
    crmNotifications?: boolean;
    calendarNotifications?: boolean;
};

export async function getUserSettings(userId: string) {
    return prisma.userSettings.upsert({
        where: {
            userId,
        },
        create: {
            userId,
        },
        update: {},
    });
}

export async function updateUserSettings(
    userId: string,
    data: UserSettingsUpdate,
) {
    return prisma.userSettings.upsert({
        where: {
            userId,
        },
        create: {
            userId,
            ...data,
        },
        update: data,
    });
}