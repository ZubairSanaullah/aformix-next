"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    Moon,
    Monitor,
    ShieldCheck,
    Sun,
    User,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useTheme } from "@/contexts/ThemeContext";

/* ── Constants ───────────────────────────────────────── */

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

function getStrengthClass(strength: number): string {
    if (strength <= 1) return "register-strength--weak";
    if (strength === 2) return "register-strength--fair";
    if (strength === 3) return "register-strength--good";
    return "register-strength--strong";
}

/* ── Framer Motion Variants ──────────────────────────── */

const staggerContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.08,
        },
    },
};

const fadeSlideUp = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
        },
    },
};

const ringDrift = (delay: number, yRange: number) => ({
    y: [0, -yRange, 0],
    transition: {
        duration: 9 + delay * 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay,
    },
});

/* ── Ring Decorations ────────────────────────────────── */

function RingDecorations({ reduced }: { reduced: boolean }) {
    if (reduced) return null;

    return (
        <>
            <motion.div
                className="register-ring register-ring--1"
                animate={ringDrift(0, 12)}
            />
            <motion.div
                className="register-ring register-ring--2"
                animate={ringDrift(1.2, 10)}
            />
            <motion.div
                className="register-ring register-ring--3"
                animate={ringDrift(0.6, 8)}
            />
            <motion.div
                className="register-ring register-ring--4"
                animate={ringDrift(1.8, 14)}
            />
            <motion.div
                className="register-ring register-ring--5"
                animate={ringDrift(0.4, 10)}
            />
            <motion.div
                className="register-ring register-ring--6"
                animate={ringDrift(1, 12)}
            />
        </>
    );
}

/* ── Visual Panel (Desktop Right) ────────────────────── */

function VisualPanel({ reduced }: { reduced: boolean }) {
    return (
        <div className="register-visual-panel">
            {/* Diagonal grid */}
            <div className="register-visual-grid" />

            {/* Ring decorations */}
            <RingDecorations reduced={reduced} />

            {/* Orbit mascot + tagline */}
            <motion.div
                className="register-orbit-wrapper"
                initial={reduced ? false : { opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.9,
                    ease: [0.22, 0.61, 0.36, 1],
                    delay: 0.15,
                }}
            >
                <Image
                    src="/images/register.png"
                    alt="Orbit — Aformix AI Mascot"
                    width={300}
                    height={400}
                    className="register-orbit-img"
                    priority
                    draggable={false}
                />
                <div className="register-visual-tagline">
                    Your{" "}
                    <span className="register-visual-tagline-accent">
                        workspace
                    </span>{" "}
                    awaits
                    <span className="register-visual-tagline-muted">
                        Projects, content, and clients — all in one place.
                    </span>
                </div>
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
            className="register-theme-toggle"
        >
            <ThemeIcon />
        </button>
    );
}

/* ── Password Strength Bar ───────────────────────────── */

function PasswordStrength({ strength }: { strength: number }) {
    const strengthClass = getStrengthClass(strength);

    return (
        <div className="register-strength">
            <div className="register-strength-track">
                {[0, 1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className={`register-strength-bar${
                            index < strength
                                ? ` register-strength-bar--active ${strengthClass}`
                                : ""
                        }`}
                    />
                ))}
            </div>
            <p className="register-strength-label">
                Password strength:{" "}
                <strong>
                    {STRENGTH_LABELS[Math.max(strength - 1, 0)]}
                </strong>
            </p>
        </div>
    );
}

/* ── Register Form ───────────────────────────────────── */

function RegisterForm() {
    const router = useRouter();
    const prefersReduced = useReducedMotion();
    const reduced = !!prefersReduced;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);

    const strength = useMemo(() => getPasswordStrength(password), [password]);

    // Auto-focus name field on mount
    useEffect(() => {
        const timer = setTimeout(() => nameRef.current?.focus(), 600);
        return () => clearTimeout(timer);
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const normalizedEmail = email.trim().toLowerCase();

            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: normalizedEmail,
                    password,
                    confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Registration failed.");
                setIsSubmitting(false);
                return;
            }

            toast.success("Account created! Please check your email for the verification code.");

            // Redirect user directly to the OTP verification page
            router.push(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);
        } catch (error) {
            console.error("Registration error:", error);

            toast.error(
                "Something went wrong. Please try again."
            );
            setIsSubmitting(false);
        }
    }

    return (
        <div className="register-page">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Left — Form panel */}
            <div className="register-form-panel">
                {/* Mobile mascot */}
                <motion.div
                    className="register-orbit-mobile"
                    initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                >
                    <Image
                        src="/images/register.png"
                        alt="Orbit — Aformix AI Mascot"
                        width={160}
                        height={216}
                        className="register-orbit-img"
                        priority
                        draggable={false}
                    />
                </motion.div>

                {/* Form card */}
                <motion.div
                    className="register-card"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >
                    {/* Logo */}
                    <motion.div className="register-logo" variants={fadeSlideUp}>
                        <Image
                            src="/images/logo.png"
                            alt="Aformix"
                            width={36}
                            height={36}
                            className="register-logo-icon"
                            draggable={false}
                        />
                        <span className="register-logo-text">Aformix</span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        className="register-heading"
                        variants={fadeSlideUp}
                    >
                        Create your{" "}
                        <span className="register-heading-accent">
                            workspace
                        </span>
                    </motion.h1>

                    <motion.p
                        className="register-subtitle"
                        variants={fadeSlideUp}
                    >
                        Set up your account and start managing projects, content,
                        and clients.
                    </motion.p>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="register-form"
                        noValidate
                    >
                        {/* Full Name */}
                        <motion.div
                            className="register-field"
                            variants={fadeSlideUp}
                        >
                            <label
                                htmlFor="register-name"
                                className="register-label"
                            >
                                Full Name
                            </label>
                            <div className="register-input-wrapper">
                                <User className="register-input-icon" />
                                <input
                                    ref={nameRef}
                                    id="register-name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    className="register-input"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </motion.div>

                        {/* Email */}
                        <motion.div
                            className="register-field"
                            variants={fadeSlideUp}
                        >
                            <label
                                htmlFor="register-email"
                                className="register-label"
                            >
                                Email Address
                            </label>
                            <div className="register-input-wrapper">
                                <Mail className="register-input-icon" />
                                <input
                                    id="register-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="register-input"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div
                            className="register-field"
                            variants={fadeSlideUp}
                        >
                            <label
                                htmlFor="register-password"
                                className="register-label"
                            >
                                Password
                            </label>
                            <div className="register-input-wrapper">
                                <Lock className="register-input-icon" />
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="new-password"
                                    className="register-input"
                                    style={{ paddingRight: "2.75rem" }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((v) => !v)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="register-password-toggle"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>

                            {password && (
                                <PasswordStrength strength={strength} />
                            )}
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div
                            className="register-field"
                            variants={fadeSlideUp}
                        >
                            <label
                                htmlFor="register-confirm-password"
                                className="register-label"
                            >
                                Confirm Password
                            </label>
                            <div className="register-input-wrapper">
                                <ShieldCheck className="register-input-icon" />
                                <input
                                    id="register-confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    required
                                    autoComplete="new-password"
                                    className="register-input"
                                    style={{ paddingRight: "2.75rem" }}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword((v) => !v)
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="register-password-toggle"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff />
                                    ) : (
                                        <Eye />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Terms */}
                        <motion.p
                            className="register-terms"
                            variants={fadeSlideUp}
                        >
                            By creating an account, you agree to our{" "}
                            <a href="#">Terms of Service</a> and{" "}
                            <a href="#">Privacy Policy</a>.
                        </motion.p>

                        {/* Submit */}
                        <motion.div variants={fadeSlideUp}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="register-submit-btn"
                            >
                                {isSubmitting && (
                                    <Loader2 className="register-submit-spinner" />
                                )}
                                {isSubmitting
                                    ? "Creating workspace…"
                                    : "Create Account"}
                            </button>
                        </motion.div>
                    </form>

                    {/* Login CTA */}
                    <motion.p
                        className="register-cta"
                        variants={fadeSlideUp}
                    >
                        Already have an account?{" "}
                        <Link href="/login" className="register-cta-link">
                            Sign in
                        </Link>
                    </motion.p>

                    {/* Progress dots */}
                    <motion.div
                        className="register-progress-dots"
                        variants={fadeSlideUp}
                    >
                        <span className="register-progress-dot register-progress-dot--active" />
                        <span className="register-progress-dot" />
                        <span className="register-progress-dot" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Right — Visual panel (desktop) */}
            <VisualPanel reduced={reduced} />
        </div>
    );
}

/* ── Page Export ──────────────────────────────────────── */

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div className="register-page">
                    <div className="register-form-panel">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: "100vh",
                            }}
                        >
                            <Loader2
                                className="register-submit-spinner"
                                style={{ width: 32, height: 32 }}
                            />
                        </div>
                    </div>
                </div>
            }
        >
            <RegisterForm />
        </Suspense>
    );
}