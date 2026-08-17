"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail, RefreshCw, ShieldCheck } from "lucide-react";

function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get("email") || "";

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
        }
    }, [initialEmail]);

    // Resend countdown timer
    useEffect(() => {
        if (countdown > 0 && !canResend) {
            const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, canResend]);

    function handleOtpChange(index: number, value: string) {
        setErrorMessage(null);

        // Handle paste of full 6-digit code
        if (value.length > 1) {
            const digits = value.replace(/\D/g, "").slice(0, 6).split("");
            const newOtp = [...otp];
            digits.forEach((digit, i) => {
                if (i < 6) newOtp[i] = digit;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        const digit = value.replace(/\D/g, "");
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    async function handleVerify(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setErrorMessage(null);

        const fullOtp = otp.join("");
        if (fullOtp.length !== 6) {
            setErrorMessage("Please enter all 6 digits of the verification code.");
            return;
        }

        if (!email) {
            setErrorMessage("Please provide your email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp: fullOtp,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || "Verification failed.");
                setIsSubmitting(false);
                return;
            }

            setIsVerified(true);
            toast.success("Email verified successfully!");

            setTimeout(() => {
                router.push("/login?verified=true");
            }, 1800);
        } catch (error) {
            console.error("Verification error:", error);
            setErrorMessage("Failed to verify code. Please check your connection and try again.");
            setIsSubmitting(false);
        }
    }

    async function handleResend() {
        if (!email) {
            toast.error("Please provide your email address to resend the code.");
            return;
        }

        setIsResending(true);
        setErrorMessage(null);

        try {
            const response = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to resend code.");
                setIsResending(false);
                return;
            }

            toast.success(data.message || "A new verification code was sent.");
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
            setCountdown(60);
            setCanResend(false);
        } catch (error) {
            console.error("Resend error:", error);
            toast.error("An error occurred while resending the code.");
        } finally {
            setIsResending(false);
        }
    }

    return (
        <main className="flex min-h-screen bg-white">
            {/* Brand panel */}
            <div className="relative hidden w-full max-w-[480px] shrink-0 overflow-hidden bg-[#1A0F43] lg:flex lg:flex-col lg:justify-between">
                <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#00BFDE]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[#31B98F]/20 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#684B9E]/20 blur-3xl" />

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
                        Verify your email to secure your account.
                    </h2>

                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                        We send a single-use 6-digit code to protect your workspace from unauthorized access.
                    </p>

                    <div className="mt-8 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <span className="h-1.5 w-6 rounded-full bg-[#00BFDE]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    </div>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#007D8C] to-[#31B98F] text-sm font-bold text-white">
                            A
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-[#1A0F43]">
                            Aformix
                        </span>
                    </div>

                    {isVerified ? (
                        <div className="text-center py-8">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#31B98F]/10 text-[#31B98F] mb-4">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A0F43]">
                                Email verified!
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Your account is activated. Redirecting you to sign in...
                            </p>
                            <div className="mt-6 flex justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-[#007D8C]" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00BFDE]/10 text-[#007D8C]">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-[#1A0F43]">
                                        Enter verification code
                                    </h1>
                                </div>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                We sent a 6-digit code to{" "}
                                <strong className="text-slate-700 font-medium">
                                    {email || "your email address"}
                                </strong>
                                .
                            </p>

                            {errorMessage && (
                                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">
                                    {errorMessage}
                                </div>
                            )}

                            <form onSubmit={handleVerify} className="mt-6 space-y-5">
                                {!initialEmail && (
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
                                                placeholder="you@example.com"
                                            />
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-700">
                                        6-Digit Verification Code
                                    </label>
                                    <div className="flex justify-between gap-2 sm:gap-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    inputRefs.current[index] = el;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-slate-200 bg-slate-50/50 text-center text-xl font-bold text-[#1A0F43] outline-none transition-all focus:border-[#00BFDE] focus:bg-white focus:ring-2 focus:ring-[#00BFDE]/15"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || otp.join("").length !== 6}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A0F43] py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1A0F43]/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isSubmitting ? "Verifying..." : "Verify & Continue"}
                                </button>
                            </form>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-sm">
                                <span className="text-slate-500 text-xs sm:text-sm">
                                    Didn&apos;t receive the code?
                                </span>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={!canResend || isResending}
                                    className="inline-flex items-center gap-1.5 font-medium text-xs sm:text-sm text-[#007D8C] transition-colors hover:text-[#1A0F43] disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                    {isResending ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-3.5 w-3.5" />
                                    )}
                                    {canResend ? "Resend Code" : `Resend in ${countdown}s`}
                                </button>
                            </div>

                            <p className="mt-6 text-center text-xs text-slate-400">
                                Need help?{" "}
                                <a
                                    href="/login"
                                    className="text-slate-600 underline hover:text-[#1A0F43]"
                                >
                                    Back to Sign in
                                </a>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-white">
                    <Loader2 className="h-8 w-8 animate-spin text-[#1A0F43]" />
                </main>
            }
        >
            <VerifyEmailForm />
        </Suspense>
    );
}
