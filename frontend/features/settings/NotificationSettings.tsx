"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Bell,
    CalendarDays,
    Check,
    Loader2,
    Mail,
    Users,
    Wrench,
} from "lucide-react";

interface NotificationPreferences {
    emailNotifications: boolean;
    taskReminders: boolean;
    calendarReminders: boolean;
    crmNotifications: boolean;
    systemNotifications: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
    emailNotifications: true,
    taskReminders: true,
    calendarReminders: true,
    crmNotifications: true,
    systemNotifications: true,
};

const SETTINGS = [
    {
        key: "emailNotifications" as const,
        title: "Email notifications",
        description: "Receive important workspace updates by email.",
        icon: Mail,
    },
    {
        key: "taskReminders" as const,
        title: "Task reminders",
        description: "Get reminders when your assigned tasks are due.",
        icon: Check,
    },
    {
        key: "calendarReminders" as const,
        title: "Calendar reminders",
        description: "Receive reminders for upcoming calendar events.",
        icon: CalendarDays,
    },
    {
        key: "crmNotifications" as const,
        title: "CRM notifications",
        description: "Stay informed about important CRM activity and updates.",
        icon: Users,
    },
    {
        key: "systemNotifications" as const,
        title: "System notifications",
        description: "Receive important workspace and system alerts.",
        icon: Wrench,
    },
];

export default function NotificationSettings() {
    const [preferences, setPreferences] =
        useState<NotificationPreferences>(DEFAULT_PREFERENCES);

    const [isLoading, setIsLoading] = useState(true);
    const [savingKey, setSavingKey] =
        useState<keyof NotificationPreferences | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState(false);

    const loadPreferences = useCallback(async () => {
        setIsLoading(true);
        setLoadError(false);
        setError(null);

        try {
            const response = await fetch("/api/settings/notifications", {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to load notification preferences.");
            }

            const data = await response.json();

            setPreferences({
                emailNotifications: data.emailNotifications ?? true,
                taskReminders: data.taskReminders ?? true,
                calendarReminders: data.calendarReminders ?? true,
                crmNotifications: data.crmNotifications ?? true,
                systemNotifications: data.systemNotifications ?? true,
            });
        } catch (err) {
            console.error(err);
            setLoadError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPreferences();
    }, [loadPreferences]);

    async function handleToggle(
        key: keyof NotificationPreferences,
    ) {
        const previousValue = preferences[key];
        const nextValue = !previousValue;

        setPreferences((current) => ({
            ...current,
            [key]: nextValue,
        }));

        setSavingKey(key);
        setError(null);

        try {
            const response = await fetch(
                "/api/settings/notifications",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        [key]: nextValue,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update notification preference.",
                );
            }

            const data = await response.json();

            setPreferences({
                emailNotifications:
                    data.emailNotifications ?? nextValue,
                taskReminders:
                    data.taskReminders ?? preferences.taskReminders,
                calendarReminders:
                    data.calendarReminders ??
                    preferences.calendarReminders,
                crmNotifications:
                    data.crmNotifications ??
                    preferences.crmNotifications,
                systemNotifications:
                    data.systemNotifications ??
                    preferences.systemNotifications,
            });
        } catch (err) {
            console.error(err);

            setPreferences((current) => ({
                ...current,
                [key]: previousValue,
            }));

            setError(
                "Could not save this preference. Please try again.",
            );
        } finally {
            setSavingKey(null);
        }
    }

    return (
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="border-b border-slate-200 px-6 py-6 sm:px-7">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#31B98F]/10 text-[#31B98F]">
                        <Bell size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Notifications
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Choose which notifications you want to
                            receive across your workspace.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mx-7">
                    {error}
                </div>
            )}

            <div className="divide-y divide-slate-100">
                {SETTINGS.map((setting) => {
                    const Icon = setting.icon;
                    const enabled = preferences[setting.key];
                    const isSaving = savingKey === setting.key;

                    return (
                        <div
                            key={setting.key}
                            className="flex items-center justify-between gap-5 px-6 py-5 transition-colors hover:bg-slate-50/70 sm:px-7"
                        >
                            <div className="flex min-w-0 items-start gap-4">
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <Icon size={17} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {setting.title}
                                    </p>

                                    <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
                                        {setting.description}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                role="switch"
                                aria-checked={enabled}
                                aria-label={`Toggle ${setting.title}`}
                                disabled={isLoading || isSaving}
                                onClick={() =>
                                    handleToggle(setting.key)
                                }
                                className={`relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#31B98F]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${enabled
                                    ? "bg-[#31B98F]"
                                    : "bg-slate-300"
                                    }`}
                            >
                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                        }`}
                                >
                                    {isSaving && (
                                        <Loader2
                                            size={11}
                                            className="animate-spin text-[#31B98F]"
                                        />
                                    )}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {isLoading ? (
                <div className="divide-y divide-slate-100">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between gap-5 px-6 py-5 sm:px-7">
                            <div className="flex min-w-0 items-start gap-4">
                                <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                                <div className="space-y-2">
                                    <div className="h-3.5 w-40 animate-pulse rounded bg-slate-100" />
                                    <div className="h-3 w-64 animate-pulse rounded bg-slate-100" />
                                </div>
                            </div>
                            <div className="h-6 w-11 shrink-0 animate-pulse rounded-full bg-slate-100" />
                        </div>
                    ))}
                </div>
            ) : loadError ? (
                <div className="px-6 py-10 text-center sm:px-7">
                    <p className="text-sm font-medium text-slate-900">
                        Something went wrong.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        We couldn&apos;t load your notification preferences.
                    </p>
                    <button
                        type="button"
                        onClick={loadPreferences}
                        className="mt-4 inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-[#31B98F] hover:text-[#238968]"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {SETTINGS.map((setting) => {
                        const Icon = setting.icon;
                        const enabled = preferences[setting.key];
                        const isSaving = savingKey === setting.key;

                        return (
                            <div
                                key={setting.key}
                                className="flex items-center justify-between gap-5 px-6 py-5 transition-colors hover:bg-slate-50/70 sm:px-7"
                            >
                                <div className="flex min-w-0 items-start gap-4">
                                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                        <Icon size={17} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {setting.title}
                                        </p>

                                        <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
                                            {setting.description}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={enabled}
                                    aria-label={`Toggle ${setting.title}`}
                                    disabled={isSaving}
                                    onClick={() => handleToggle(setting.key)}
                                    className={`relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#31B98F]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${enabled ? "bg-[#31B98F]" : "bg-slate-300"
                                        }`}
                                >
                                    <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"
                                            }`}
                                    >
                                        {isSaving && (
                                            <Loader2
                                                size={11}
                                                className="animate-spin text-[#31B98F]"
                                            />
                                        )}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}