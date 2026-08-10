"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Registration failed.");
                setIsSubmitting(false);
                return;
            }

            toast.success(data.message);

            setName("");
            setEmail("");
            setPassword("");

            router.push("/login");
        } catch (error) {
            console.error("Registration error:", error);

            toast.error(
                "Something went wrong. Please try again."
            );
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen bg-white">
            {/* Brand panel */}
            <div className="relative hidden w-full max-w-[480px] shrink-0 overflow-hidden bg-[#1A0F43] lg:flex lg:flex-col lg:justify-between">
                <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#31B98F]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[#00BFDE]/20 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#684B9E]/10 blur-3xl" />

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
                        Set up your workspace in minutes.
                    </h2>

                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                        Create an account to start managing your projects,
                        content, and clients.
                    </p>

                    <div className="mt-8 flex items-center gap-1.5">
                        <span className="h-1.5 w-6 rounded-full bg-[#31B98F]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
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

                    <h1 className="text-2xl font-semibold tracking-tight text-[#1A0F43]">
                        Create your account
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Get started with your Aformix workspace.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1.5 block text-xs font-medium text-slate-700"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-[#1A0F43] outline-none transition-all placeholder:text-slate-400 focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/15"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-xs font-medium text-slate-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-[#1A0F43] outline-none transition-all placeholder:text-slate-400 focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/15"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-xs font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-[#1A0F43] outline-none transition-all placeholder:text-slate-400 focus:border-[#31B98F] focus:ring-2 focus:ring-[#31B98F]/15"
                                    placeholder="••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A0F43] py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1A0F43]/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {isSubmitting ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-medium text-[#007D8C] transition-colors hover:text-[#1A0F43]"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </main >
    );
}