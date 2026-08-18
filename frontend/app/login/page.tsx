"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    Moon,
    Monitor,
    Sun,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useTheme } from "@/contexts/ThemeContext";
import { Checkbox } from "@/components/ui/checkbox";

/* ── Framer Motion Variants ──────────────────────────── */

const staggerContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.1,
        },
    },
};

const fadeSlideUp = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
        },
    },
};

const orbFloat = (delay: number, yRange: number) => ({
    y: [0, -yRange, 0],
    transition: {
        duration: 8 + delay * 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay,
    },
});

/* ── Ambient Orbs Component ──────────────────────────── */

function AmbientOrbs({ reduced }: { reduced: boolean }) {
    if (reduced) return null;

    return (
        <>
            <motion.div
                className="login-orb login-orb--1"
                animate={orbFloat(0, 18)}
            />
            <motion.div
                className="login-orb login-orb--2"
                animate={orbFloat(1.5, 14)}
            />
            <motion.div
                className="login-orb login-orb--3"
                animate={orbFloat(0.8, 20)}
            />
            <motion.div
                className="login-orb login-orb--4"
                animate={orbFloat(2, 12)}
            />
            <motion.div
                className="login-orb login-orb--5"
                animate={orbFloat(1.2, 16)}
            />
        </>
    );
}

/* ── Visual Panel (Desktop Left) ─────────────────────── */

function VisualPanel({ reduced }: { reduced: boolean }) {
    return (
        <div className="login-visual-panel">
            {/* Subtle grid */}
            <div className="login-visual-grid" />

            {/* Ambient orbs */}
            <AmbientOrbs reduced={reduced} />

            {/* Orbit mascot */}
            <motion.div
                className="login-orbit-wrapper"
                initial={reduced ? false : { opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    ease: [0.22, 0.61, 0.36, 1],
                }}
            >
                <Image
                    src="/images/login.png"
                    alt="Orbit — Aformix AI Mascot"
                    width={340}
                    height={460}
                    className="login-orbit-img"
                    priority
                    draggable={false}
                />
            </motion.div>
        </div>
    );
}

/* ── Theme Toggle ────────────────────────────────────── */

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("light");
        else {
            const isDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            setTheme(isDark ? "light" : "dark");
        }
    };

    const ThemeIcon =
        theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={
                theme === "light"
                    ? "Switch to dark mode"
                    : theme === "dark"
                      ? "Switch to light mode"
                      : "Toggle theme"
            }
            className="login-theme-toggle"
        >
            <ThemeIcon />
        </button>
    );
}

/* ── Login Form ──────────────────────────────────────── */

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefersReduced = useReducedMotion();
    const reduced = !!prefersReduced;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
    const [justVerified, setJustVerified] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (searchParams.get("verified") === "true") {
            setJustVerified(true);
        }
    }, [searchParams]);

    // Auto-focus email on mount
    useEffect(() => {
        const timer = setTimeout(() => emailRef.current?.focus(), 600);
        return () => clearTimeout(timer);
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setUnverifiedEmail(null);

        try {
            const normalizedEmail = email.trim().toLowerCase();

            const result = await signIn("credentials", {
                email: normalizedEmail,
                password,
                redirect: false,
            });

            if (result?.error) {
                // Check if the sign-in failed due to unverified email
                if (result.error === "email_not_verified" || result.code === "email_not_verified") {
                    setUnverifiedEmail(normalizedEmail);
                    toast.error("Please verify your email address to continue.");
                } else {
                    toast.error("Invalid email or password.");
                }
                setIsSubmitting(false);
                return;
            }

            toast.success("Login successful.");
            router.push("/workspace");
        } catch (error) {
            console.error("Login error:", error);

            toast.error(
                "Something went wrong. Please try again."
            );
            setIsSubmitting(false);
        }
    }

    return (
        <div className="login-page">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Left — Visual panel (desktop) */}
            <VisualPanel reduced={reduced} />

            {/* Right — Form panel */}
            <div className="login-form-panel">
                {/* Mobile mascot */}
                <motion.div
                    className="login-orbit-mobile"
                    initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                >
                    <Image
                        src="/images/login.png"
                        alt="Orbit — Aformix AI Mascot"
                        width={160}
                        height={216}
                        className="login-orbit-img"
                        priority
                        draggable={false}
                    />
                </motion.div>

                {/* Form card */}
                <motion.div
                    className="login-card"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >
                    {/* Logo */}
                    <motion.div className="login-logo" variants={fadeSlideUp}>
                        <Image
                            src="/images/logo.png"
                            alt="Aformix"
                            width={36}
                            height={36}
                            className="login-logo-icon"
                            draggable={false}
                        />
                        <span className="login-logo-text">Aformix</span>
                    </motion.div>

                    {/* Alerts */}
                    {justVerified && (
                        <div className="login-alert login-alert--success">
                            <CheckCircle2 className="login-alert-icon" />
                            <div className="login-alert-content">
                                <span>
                                    Your email has been verified! Sign in to
                                    access your workspace.
                                </span>
                            </div>
                        </div>
                    )}

                    {unverifiedEmail && (
                        <div className="login-alert login-alert--warning">
                            <AlertCircle className="login-alert-icon" />
                            <div className="login-alert-content">
                                <p className="login-alert-title">
                                    Email Verification Required
                                </p>
                                <p className="login-alert-text">
                                    Your account is registered but the email has
                                    not been verified yet.
                                </p>
                                <Link
                                    href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                                    className="login-alert-link"
                                >
                                    <Mail className="h-3.5 w-3.5" />
                                    Verify Email Now
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Heading */}
                    <motion.h1
                        className="login-heading"
                        variants={fadeSlideUp}
                    >
                        Welcome{" "}
                        <span className="login-heading-accent">back</span>
                    </motion.h1>

                    <motion.p
                        className="login-subtitle"
                        variants={fadeSlideUp}
                    >
                        Sign in to continue to your workspace.
                    </motion.p>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="login-form"
                        noValidate
                    >
                        {/* Email */}
                        <motion.div
                            className="login-field"
                            variants={fadeSlideUp}
                        >
                            <label htmlFor="login-email" className="login-label">
                                Email
                            </label>
                            <div className="login-input-wrapper">
                                <Mail className="login-input-icon" />
                                <input
                                    ref={emailRef}
                                    id="login-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="login-input"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div
                            className="login-field"
                            variants={fadeSlideUp}
                        >
                            <label
                                htmlFor="login-password"
                                className="login-label"
                            >
                                Password
                            </label>
                            <div className="login-input-wrapper">
                                <Lock className="login-input-icon" />
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    className="login-input"
                                    style={{ paddingRight: "2.75rem" }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="login-password-toggle"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Remember / Forgot row */}
                        <motion.div
                            className="login-options-row"
                            variants={fadeSlideUp}
                        >
                            <label
                                className="login-remember"
                                htmlFor="login-remember"
                            >
                                <Checkbox
                                    id="login-remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) =>
                                        setRememberMe(checked === true)
                                    }
                                />
                                <span className="login-remember-label">
                                    Remember me
                                </span>
                            </label>

                            <Link
                                href="/forgot-password"
                                className="login-forgot-link"
                            >
                                Forgot password?
                            </Link>
                        </motion.div>

                        {/* Submit */}
                        <motion.div variants={fadeSlideUp}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="login-submit-btn"
                            >
                                {isSubmitting && (
                                    <Loader2 className="login-submit-spinner" />
                                )}
                                {isSubmitting ? "Signing in…" : "Sign In"}
                            </button>
                        </motion.div>
                    </form>

                    {/* Registration CTA */}
                    <motion.p className="login-cta" variants={fadeSlideUp}>
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="login-cta-link">
                            Create one
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}

/* ── Page Export ──────────────────────────────────────── */

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="login-page">
                    <div className="login-form-panel">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: "100vh",
                            }}
                        >
                            <Loader2
                                className="login-submit-spinner"
                                style={{ width: 32, height: 32 }}
                            />
                        </div>
                    </div>
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}