"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to process request.");
                setIsSubmitting(false);
                return;
            }

            setIsSubmitted(true);
            toast.success("Password reset instructions sent.");
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
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
                        Account recovery made simple and secure.
                    </h2>

                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                        Enter your email address and we&apos;ll send you instructions to safely reset your password.
                    </p>

                    <div className="mt-8 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <span className="h-1.5 w-6 rounded-full bg-[#00BFDE]" />
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

                    {isSubmitted ? (
                        <div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#31B98F]/10 text-[#31B98F] mb-5">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A0F43]">
                                Check your email
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                If an account exists for <strong className="text-slate-700 font-medium">{email}</strong>, you will receive password reset instructions shortly.
                            </p>

                            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs text-slate-500 leading-relaxed">
                                <strong>Tip:</strong> Don&apos;t see the email? Be sure to check your spam or junk folder. The reset link is valid for 1 hour.
                            </div>

                            <div className="mt-8 space-y-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setEmail("");
                                    }}
                                    className="w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                                >
                                    Send to a different email
                                </button>

                                <Link
                                    href="/login"
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A0F43] py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1A0F43]/90"
                                >
                                    Return to Sign in
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00BFDE]/10 text-[#007D8C] mb-4">
                                <KeyRound className="h-5 w-5" />
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A0F43]">
                                Forgot password?
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">
                                Enter your email and we&apos;ll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1.5 block text-xs font-medium text-slate-700"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pl-10 text-sm text-[#1A0F43] outline-none transition-all placeholder:text-slate-400 focus:border-[#00BFDE] focus:ring-2 focus:ring-[#00BFDE]/15"
                                            placeholder="john@example.com"
                                        />
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !email}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A0F43] py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1A0F43]/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                    {isSubmitting ? "Sending instructions..." : "Send Reset Link"}
                                </button>
                            </form>

                            <div className="mt-8 border-t border-slate-100 pt-5 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#1A0F43]"
                                >
                                    <ArrowLeft className="h-4 w-4" />
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
