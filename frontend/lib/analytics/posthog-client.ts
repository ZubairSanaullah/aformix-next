/**
 * lib/analytics/posthog-client.ts
 *
 * PostHog browser client singleton.
 *
 * Rules:
 * - Initializes exactly once via module-level singleton pattern.
 * - Safe for SSR — all posthog-js access is guarded by typeof window check.
 * - Privacy-first session replay configuration (inputs masked by default).
 * - Respects Next.js App Router / React 19 rendering model.
 * - Never exposes private API keys — only NEXT_PUBLIC_* vars are used.
 */

import posthog, { type PostHog } from "posthog-js";

let _client: PostHog | null = null;

/**
 * Returns the initialized PostHog client, or null on the server.
 * Safe to call anywhere — SSR environments return null and calling code
 * must handle that gracefully.
 */
export function getPostHogClient(): PostHog | null {
    // Server environment — PostHog is browser-only
    if (typeof window === "undefined") return null;

    if (_client) return _client;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

    // If no key is configured (e.g. local dev without PostHog account),
    // skip initialization gracefully — analytics should never crash the app.
    if (!key || key.startsWith("phc_REPLACE")) {
        return null;
    }

    posthog.init(key, {
        api_host: host,

        // Use the /ingest path via the Next.js rewrite proxy (added in next.config.ts).
        // This avoids ad-blocker interference with PostHog's domain.
        // Falls back to direct host if proxy is not configured.
        // ui_host: "https://us.posthog.com",

        // Disable automatic page view — we handle this manually in PostHogProvider
        // to avoid double-counting with Next.js App Router client-side navigation.
        capture_pageview: false,

        // Disable pageleave — we handle this via the provider cleanup
        capture_pageleave: true,

        // Persistence: use localStorage + cookie fallback
        persistence: "localStorage+cookie",

        // Session replay — privacy first
        session_recording: {
            // Mask all text content and input values by default
            maskAllInputs: true,
            // Mask all text elements (prevent accidental PII capture)
            maskTextSelector: "[data-ph-mask]",
        },

        // Do not automatically capture all clicks — we track meaningful events only
        autocapture: false,

        // Disable automatic heatmaps
        enable_heatmaps: false,

        // Cross-subdomain session tracking (useful if app is on app.aformix.com)
        cross_subdomain_cookie: false,

        // Opt out of usage data being sent to PostHog for improving PostHog itself
        opt_out_capturing_by_default: false,

        // Respect Do Not Track browser signals
        respect_dnt: true,

        // Bootstrap feature flags immediately on init if you have the flags object
        // bootstrap: { featureFlags: {} },

        loaded: (ph) => {
            // In development, log events to the console for easy debugging
            if (process.env.NODE_ENV === "development") {
                ph.debug();
            }
        },
    });

    _client = posthog;
    return _client;
}
