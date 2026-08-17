"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";

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

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResetComplete, setIsResetComplete] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const strength = useMemo(() => getPasswordStrength(password), [password]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMessage(null);

        if (!token) {
            setErrorMessage("Invalid or missing password reset token. Please request a new link.");
            return;
        }

        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password,
                    confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || "Failed to reset password.");
                setIsSubmitting(false);
                return;
            }

            setIsResetComplete(true);
            toast.success("Password has been reset successfully.");
        } catch (error) {
            console.error("Reset password error:", error);
            setErrorMessage("Something went wrong. Please check your connection and try again.");
            setIsSubmitting(false);
        }
    }

    if (!token) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white px-6">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
                        <KeyRound className="h-7 w-7" />
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Invalid Reset Link
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        This password reset link is invalid or incomplete. Please request a new one.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center justify-center rounded-lg bg-[#1A0F43] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1A0F43]/90 transition"
                        >
                            Request New Reset Link
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen bg-white">
            {/* Brand panel */}
            <div className="relative hidden w-full max-w-[480px] shrink-0 overflow-hidden bg-[#1A0F43] lg:flex lg:flex-col lg:justify-between">
                <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#00BFDE]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[#684B9E]/30 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#31B98F]/10 blur-3xl" />

                <div className="relative z-10 px-10 pt-10">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00BFDE] to-[#31B98F] text-sm font-bold text-[#1A0F43]">
                            A
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-white">
                            Aformix
                        </span>
                    </div>
                </div>

                <div className="relative z-10 px-10 pb-14">
                    <h2 className="max-w-xs text-2xl font-semibold leading-snug tracking-tight text-white">
                        Create a strong, unique new password.
                    </h2>

                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                        Once saved, you can immediately sign in with your new password to continue working.
                    </p>

                    <div className="mt-8 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <span className="h-1.5 w-6 rounded-full bg-[#31B98F]" />
                    </div>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#007D8C] to-[#31B98F] text-sm font-bold text-white">
                            A
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-[#1A0F43]">
                            Aformix
                        </span>
                    </div>

                    {isResetComplete ? (
                        <div className="text-center py-6">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#31B98F]/10 text-[#31B98F] mb-4">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A0F43]">
                                Password reset complete!
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Your new password is now active. You can sign in to your workspace.
                            </p>

                            <div className="mt-8">
                                <Link
                                    href="/login"
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A0F43] py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1A0F43]/90"
                                >
                                    Sign In Now
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00BFDE]/10 text-[#007D8C] mb-4">
                                <Lock className="h-5 w-5" />
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A0F43]">
                                Set new password
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">
                                Please choose a strong password with at least 8 characters.
                            </p>

                            {errorMessage && (
                                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">
                                    {errorMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-1.5 block text-xs font-medium text-slate-700"
                                    >
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-[#1A0F43] outline-none transition-all placeholder:text-slate-400 focus:border-[#00BFDE] focus:ring-2 focus:ring-[#00BFDE]/15"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>

                                    {password && (
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
                                                                : "bg-slate-200"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="mt-1 text-[11px] text-slate-400">
                                                Strength:{" "}
                                                <span className="font-medium text-slate-600">
                                                    {STRENGTH_LABELS[Math.max(strength - 1, 0)]}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-1.5 block text-xs font-medium text-slate-700"
                                    >
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-[#1A0F43] outline-none transition-all placeholder:text-slate-400 focus:border-[#00BFDE] focus:ring-2 focus:ring-[#00BFDE]/15"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((v) => !v)}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !password || !confirmPassword}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A0F43] py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1A0F43]/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                    {isSubmitting ? "Updating password..." : "Reset Password"}
                                </button>
                            </form>

                            <div className="mt-8 border-t border-slate-100 pt-5 text-center">
                                <Link
                                    href="/login"
                                    className="text-xs text-slate-500 hover:text-[#1A0F43] underline transition"
                                >
                                    Back to Sign in
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-white">
                    <Loader2 className="h-8 w-8 animate-spin text-[#1A0F43]" />
                </main>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
