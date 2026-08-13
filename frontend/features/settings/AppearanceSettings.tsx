"use client";

import { useCallback, useEffect, useState } from "react";
import { Monitor, Moon, Sun, Check, Loader2 } from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";

type ThemeOption = {
    value: "light" | "dark" | "system";
    title: string;
    description: string;
    icon: typeof Sun;
};

const themeOptions: ThemeOption[] = [
    {
        value: "light",
        title: "Light",
        description: "Use the light workspace appearance.",
        icon: Sun,
    },
    {
        value: "dark",
        title: "Dark",
        description: "Use the dark workspace appearance.",
        icon: Moon,
    },
    {
        value: "system",
        title: "System",
        description: "Follow your device appearance preference.",
        icon: Monitor,
    },
];

const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] as const;

const FALLBACK_TIMEZONES = [
    "Asia/Karachi",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Europe/London",
    "Europe/Berlin",
    "America/New_York",
    "America/Los_Angeles",
    "America/Chicago",
    "Australia/Sydney",
    "UTC",
];

function getTimezoneOptions(): string[] {
    try {
        if (typeof Intl.supportedValuesOf === "function") {
            return Intl.supportedValuesOf("timeZone");
        }
    } catch {
        // fall through
    }
    return FALLBACK_TIMEZONES;
}

interface Preferences {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: "12H" | "24H";
    sidebarCollapsed: boolean;
}

const DEFAULT_PREFERENCES: Preferences = {
    language: "en",
    timezone: "Asia/Karachi",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12H",
    sidebarCollapsed: false,
};

export default function AppearanceSettings() {
    const { theme, setTheme } = useTheme();

    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timezones = useState(() => getTimezoneOptions())[0];
    const [loadError, setLoadError] = useState(false);

    const loadPreferences = useCallback(async () => {
        setIsLoading(true);
        setLoadError(false);
        setError(null);

        try {
            const response = await fetch("/api/settings", { cache: "no-store" });

            if (!response.ok) {
                throw new Error("Failed to load preferences.");
            }

            const data = await response.json();
            const settings = data?.settings;

            if (settings) {
                setPreferences({
                    language: settings.language ?? DEFAULT_PREFERENCES.language,
                    timezone:
                        settings.timezone ??
                        Intl.DateTimeFormat().resolvedOptions().timeZone ??
                        DEFAULT_PREFERENCES.timezone,
                    dateFormat: settings.dateFormat ?? DEFAULT_PREFERENCES.dateFormat,
                    timeFormat: settings.timeFormat === "24H" ? "24H" : "12H",
                    sidebarCollapsed: Boolean(settings.sidebarCollapsed),
                });
            }
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

    async function persistPreferences(patch: Partial<Preferences>) {
        const previous = preferences;
        const next = { ...preferences, ...patch };

        setPreferences(next);
        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });

            if (!response.ok) {
                throw new Error("Failed to save preference.");
            }
        } catch (err) {
            console.error(err);
            setPreferences(previous);
            setError("Could not save this preference. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleThemeChange = async (nextTheme: "light" | "dark" | "system") => {
        setTheme(nextTheme);

        try {
            const response = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme: nextTheme.toUpperCase() }),
            });

            if (!response.ok) {
                console.error("Failed to persist theme preference");
            }
        } catch (err) {
            console.error("Failed to persist theme preference:", err);
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Appearance</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Choose how Aformix looks.
                    </p>
                </div>

                <div
                    role="radiogroup"
                    aria-label="Theme"
                    className="mt-6 grid gap-4 md:grid-cols-3"
                >
                    {themeOptions.map((option) => {
                        const Icon = option.icon;
                        const selected = theme === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => handleThemeChange(option.value)}
                                className={`relative rounded-2xl border p-5 text-left transition-all ${selected
                                    ? "border-[#31B98F] bg-[#31B98F]/5 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected
                                            ? "bg-[#31B98F]/10 text-[#31B98F]"
                                            : "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        <Icon size={20} />
                                    </div>

                                    {selected && (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#31B98F] text-white">
                                            <Check size={14} />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {option.title}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        {option.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Preferences
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Language, time, and workspace layout defaults.
                        </p>
                    </div>

                    {isSaving && (
                        <Loader2 size={16} className="animate-spin text-[#31B98F]" />
                    )}
                </div>

                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                                <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : loadError ? (
                    <div className="mt-6 py-6 text-center">
                        <p className="text-sm font-medium text-slate-900">
                            Something went wrong.
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            We couldn&apos;t load your preferences.
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
                    <>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="pref-language"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Language
                                </label>
                                <select
                                    id="pref-language"
                                    value={preferences.language}
                                    disabled={isLoading || isSaving}
                                    onChange={(event) =>
                                        persistPreferences({ language: event.target.value })
                                    }
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    <option value="en">English</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="pref-timezone"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Timezone
                                </label>
                                <select
                                    id="pref-timezone"
                                    value={preferences.timezone}
                                    disabled={isLoading || isSaving}
                                    onChange={(event) =>
                                        persistPreferences({ timezone: event.target.value })
                                    }
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    {timezones.map((tz) => (
                                        <option key={tz} value={tz}>
                                            {tz}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="pref-date-format"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Date format
                                </label>
                                <select
                                    id="pref-date-format"
                                    value={preferences.dateFormat}
                                    disabled={isLoading || isSaving}
                                    onChange={(event) =>
                                        persistPreferences({ dateFormat: event.target.value })
                                    }
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    {DATE_FORMATS.map((format) => (
                                        <option key={format} value={format}>
                                            {format}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <span className="mb-2 block text-sm font-medium text-slate-700">
                                    Time format
                                </span>
                                <div
                                    role="radiogroup"
                                    aria-label="Time format"
                                    className="flex h-11 rounded-xl border border-slate-200 p-1"
                                >
                                    {(["12H", "24H"] as const).map((format) => {
                                        const selected = preferences.timeFormat === format;

                                        return (
                                            <button
                                                key={format}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                disabled={isLoading || isSaving}
                                                onClick={() => persistPreferences({ timeFormat: format })}
                                                className={`flex-1 rounded-lg text-sm font-medium transition disabled:cursor-not-allowed ${selected
                                                    ? "bg-[#31B98F] text-white"
                                                    : "text-slate-500 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {format === "12H" ? "12-hour" : "24-hour"}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Timezone
                                </label>
                                <select
                                    value={preferences.timezone}
                                    disabled={isLoading || isSaving}
                                    onChange={(event) =>
                                        persistPreferences({ timezone: event.target.value })
                                    }
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    {timezones.map((tz) => (
                                        <option key={tz} value={tz}>
                                            {tz}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Date format
                                </label>
                                <select
                                    value={preferences.dateFormat}
                                    disabled={isLoading || isSaving}
                                    onChange={(event) =>
                                        persistPreferences({ dateFormat: event.target.value })
                                    }
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    {DATE_FORMATS.map((format) => (
                                        <option key={format} value={format}>
                                            {format}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Time format
                                </label>
                                <div className="flex h-11 rounded-xl border border-slate-200 p-1">
                                    {(["12H", "24H"] as const).map((format) => {
                                        const selected = preferences.timeFormat === format;

                                        return (
                                            <button
                                                key={format}
                                                type="button"
                                                disabled={isLoading || isSaving}
                                                onClick={() => persistPreferences({ timeFormat: format })}
                                                className={`flex-1 rounded-lg text-sm font-medium transition disabled:cursor-not-allowed ${selected
                                                    ? "bg-[#31B98F] text-white"
                                                    : "text-slate-500 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {format === "12H" ? "12-hour" : "24-hour"}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-6 border-t border-slate-100 pt-5">
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    Keep sidebar collapsed
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Start every session with the workspace sidebar collapsed.
                                </p>
                            </div>

                            <button
                                type="button"
                                role="switch"
                                aria-checked={preferences.sidebarCollapsed}
                                aria-label="Toggle keep sidebar collapsed"
                                disabled={isLoading || isSaving}
                                onClick={() =>
                                    persistPreferences({
                                        sidebarCollapsed: !preferences.sidebarCollapsed,
                                    })
                                }
                                className={`relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#31B98F]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${preferences.sidebarCollapsed ? "bg-[#31B98F]" : "bg-slate-300"
                                    }`}
                            >
                                <span
                                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${preferences.sidebarCollapsed ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}