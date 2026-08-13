"use client";

import { FormEvent, useEffect, useState, useCallback } from "react";
import { Check, Loader2, User } from "lucide-react";

interface ProfileData {
    id: string;
    name: string;
    email: string;
    image: string;
    role: "USER" | "ADMIN";
}

const EMPTY_PROFILE: ProfileData = {
    id: "",
    name: "",
    email: "",
    image: "",
    role: "USER",
};

function getInitials(name: string, email: string): string {
    const source = name.trim() || email;
    const parts = source.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function roleLabel(role: ProfileData["role"]): string {
    return role === "ADMIN" ? "Administrator" : "Member";
}

export default function ProfileSettings() {
    const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState(false);

    const loadProfile = useCallback(async () => {
        setIsLoading(true);
        setLoadError(false);

        try {
            const response = await fetch("/api/settings/profile", {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to load profile.");
            }

            const data = await response.json();

            const nextProfile: ProfileData = {
                id: data.id ?? "",
                name: data.name ?? "",
                email: data.email ?? "",
                image: data.image ?? "",
                role: data.role === "ADMIN" ? "ADMIN" : "USER",
            };

            setProfile(nextProfile);
            setName(nextProfile.name);
            setImageUrl(nextProfile.image);
        } catch (err) {
            console.error(err);
            setLoadError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    function markDirty() {
        setSaved(false);
        setError(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedImage = imageUrl.trim();

        if (trimmedName.length > 100) {
            setError("Name must be 100 characters or less.");
            return;
        }

        if (trimmedImage && !/^https?:\/\//i.test(trimmedImage)) {
            setError("Avatar URL must start with http:// or https://");
            return;
        }

        setIsSaving(true);
        setSaved(false);
        setError(null);

        try {
            const response = await fetch("/api/settings/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: trimmedName,
                    image: trimmedImage,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to update profile.",
                );
            }

            setProfile((current) => ({
                ...current,
                name: data.name ?? "",
                email: data.email ?? current.email,
                image: data.image ?? "",
                role: data.role === "ADMIN" ? "ADMIN" : "USER",
            }));

            setName(data.name ?? "");
            setImageUrl(data.image ?? "");
            setSaved(true);
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update your profile.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    const previewSrc = imageUrl.trim();
    const initials = getInitials(name, profile.email);

    if (isLoading) {
        return (
            <section className="rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                <div className="border-b border-slate-200 px-6 py-6 sm:px-7">
                    <div className="flex items-start gap-4">
                        <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-slate-100" />
                        <div className="space-y-2">
                            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                            <div className="h-3 w-56 animate-pulse rounded bg-slate-100" />
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-7">
                    <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
                        <div className="h-16 w-16 shrink-0 animate-pulse rounded-2xl bg-slate-100" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                                <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
                        <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-100" />
                    </div>
                </div>
            </section>
        );
    }

    if (loadError) {
        return (
            <section className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                <p className="text-sm font-medium text-slate-900">
                    Something went wrong.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    We couldn&apos;t load your profile.
                </p>
                <button
                    type="button"
                    onClick={loadProfile}
                    className="mt-4 inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-[#31B98F] hover:text-[#238968]"
                >
                    Try again
                </button>
            </section>
        );
    }

    return (
        <section className="rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="border-b border-slate-200 px-6 py-6 sm:px-7">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#31B98F]/10 text-[#31B98F]">
                        <User size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Profile
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Manage your personal workspace identity.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-7">
                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {saved && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#31B98F]/20 bg-[#31B98F]/5 px-4 py-3 text-sm text-[#238968]">
                        <Check size={16} />
                        Profile updated successfully.
                    </div>
                )}

                <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
                    {previewSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewSrc}
                            alt="Avatar preview"
                            className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200"
                            onError={(event) => {
                                (event.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#31B98F]/10 text-lg font-semibold text-[#238968]">
                            {initials}
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <label
                            htmlFor="settings-avatar-url"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Avatar URL
                        </label>

                        <input
                            id="settings-avatar-url"
                            type="url"
                            value={imageUrl}
                            disabled={isLoading || isSaving}
                            onChange={(event) => {
                                setImageUrl(event.target.value);
                                markDirty();
                            }}
                            placeholder="https://example.com/avatar.jpg"
                            maxLength={2048}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />

                        <p className="mt-1.5 text-xs text-slate-400">
                            JPG/PNG link, square images recommended.
                        </p>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="settings-name"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Full name
                        </label>

                        <input
                            id="settings-name"
                            type="text"
                            value={name}
                            disabled={isLoading || isSaving}
                            maxLength={100}
                            onChange={(event) => {
                                setName(event.target.value);
                                markDirty();
                            }}
                            placeholder="Your name"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="settings-email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Email address
                        </label>

                        <input
                            id="settings-email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-500 outline-none disabled:cursor-not-allowed"
                        />

                        <p className="mt-2 text-xs text-slate-400">
                            Email changes are not available here.
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Role
                        </label>

                        <div className="flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-600">
                            {roleLabel(profile.role)}
                        </div>
                    </div>
                </div>

                <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
                    <button
                        type="submit"
                        disabled={isLoading || isSaving}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#31B98F] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#289f7a] focus:outline-none focus:ring-2 focus:ring-[#31B98F]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save changes"
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}