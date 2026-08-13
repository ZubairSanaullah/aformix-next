"use client";

import { FormEvent, useMemo, useState } from "react";
import {
    Check,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    ShieldCheck,
} from "lucide-react";

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const INITIAL_FORM: PasswordForm = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"] as const;

function getPasswordStrength(password: string): number {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(score, 4);
}

export default function SecuritySettings() {
    const [form, setForm] = useState<PasswordForm>(INITIAL_FORM);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const strength = useMemo(
        () => getPasswordStrength(form.newPassword),
        [form.newPassword],
    );

    function handleChange(field: keyof PasswordForm, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setSaved(false);
        setError(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            !form.currentPassword ||
            !form.newPassword ||
            !form.confirmPassword
        ) {
            setError("Please complete all password fields.");
            return;
        }

        if (form.newPassword.length < 8) {
            setError("Your new password must be at least 8 characters.");
            return;
        }

        if (form.newPassword.length > 128) {
            setError("Your new password must be 128 characters or less.");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (form.currentPassword === form.newPassword) {
            setError(
                "Your new password must be different from your current password.",
            );
            return;
        }

        setIsSaving(true);
        setSaved(false);
        setError(null);

        try {
            const response = await fetch("/api/settings/password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update password.");
            }

            setForm(INITIAL_FORM);
            setSaved(true);
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update your password.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    const fields = [
        {
            id: "current-password",
            label: "Current password",
            value: form.currentPassword,
            type: showCurrent ? "text" : "password",
            setVisible: setShowCurrent,
            visible: showCurrent,
            field: "currentPassword" as const,
        },
        {
            id: "new-password",
            label: "New password",
            value: form.newPassword,
            type: showNew ? "text" : "password",
            setVisible: setShowNew,
            visible: showNew,
            field: "newPassword" as const,
        },
        {
            id: "confirm-password",
            label: "Confirm new password",
            value: form.confirmPassword,
            type: showConfirm ? "text" : "password",
            setVisible: setShowConfirm,
            visible: showConfirm,
            field: "confirmPassword" as const,
        },
    ];

    return (
        <section className="rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="border-b border-slate-200 px-6 py-6 sm:px-7">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#31B98F]/10 text-[#31B98F]">
                        <ShieldCheck size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Security
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Protect your account and manage your
                            authentication credentials.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-7">
                <div className="flex items-start gap-3">
                    <KeyRound size={17} className="mt-0.5 shrink-0 text-[#31B98F]" />

                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Change password
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Use at least 8 characters and avoid reusing your
                            current password.
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
                        Password updated successfully.
                    </div>
                )}

                <div className="grid gap-5 md:grid-cols-3">
                    {fields.map((field) => (
                        <div key={field.id}>
                            <label
                                htmlFor={field.id}
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                {field.label}
                            </label>

                            <div className="relative">
                                <input
                                    id={field.id}
                                    type={field.type}
                                    value={field.value}
                                    maxLength={128}
                                    autoComplete={
                                        field.field === "currentPassword"
                                            ? "current-password"
                                            : "new-password"
                                    }
                                    onChange={(event) =>
                                        handleChange(field.field, event.target.value)
                                    }
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => field.setVisible(!field.visible)}
                                    aria-label={
                                        field.visible ? "Hide password" : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#31B98F]"
                                >
                                    {field.visible ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>

                            {field.field === "newPassword" && field.value && (
                                <div className="mt-2">
                                    <div className="flex h-1.5 gap-1">
                                        {[0, 1, 2, 3].map((index) => (
                                            <span
                                                key={index}
                                                className={`h-full flex-1 rounded-full transition-colors ${
                                                    index < strength
                                                        ? strength <= 1
                                                            ? "bg-red-400"
                                                            : strength === 2
                                                              ? "bg-amber-400"
                                                              : "bg-[#31B98F]"
                                                        : "bg-slate-150 bg-slate-200"
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <p className="mt-1.5 text-xs text-slate-400">
                                        Password strength:{" "}
                                        <span className="font-medium text-slate-600">
                                            {STRENGTH_LABELS[Math.max(strength - 1, 0)]}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#31B98F] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#289f7a] focus:outline-none focus:ring-2 focus:ring-[#31B98F]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update password"
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}