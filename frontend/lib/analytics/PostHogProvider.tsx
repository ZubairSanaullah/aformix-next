"use client";

/**
 * lib/analytics/PostHogProvider.tsx
 *
 * PostHog initialization provider for Next.js App Router.
 *
 * Responsibilities:
 * - Initializes PostHog exactly once when the client mounts
 * - Tracks page views on client-side route changes (App Router navigation)
 * - Does NOT depend on next-auth/react SessionProvider
 * - User identification is handled separately via PostHogIdentify
 *   (called from WorkspaceLayoutClient which already has the user object)
 *
 * Architecture notes:
 * - capture_pageview: false in posthog-client.ts prevents automatic
 *   double-counting; this provider manually fires page_view events
 * - React Strict Mode in development causes effects to fire twice —
 *   PostHog's singleton pattern handles this gracefully (init is idempotent)
 * - Wrapped in Suspense because useSearchParams() requires it in App Router
 */

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getPostHogClient } from "./posthog-client";
import { POSTHOG_EVENTS } from "./events";

// ─────────────────────────────────────────────────────────────────────────────
// Inner component — needs Suspense boundary because of useSearchParams
// ─────────────────────────────────────────────────────────────────────────────

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initializedRef = useRef(false);

    // Initialize PostHog exactly once on mount
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        getPostHogClient();
    }, []);

    // Track page views on client-side route changes
    useEffect(() => {
        const ph = getPostHogClient();
        if (!ph) return;

        const url =
            pathname +
            (searchParams?.toString() ? `?${searchParams.toString()}` : "");

        ph.capture(POSTHOG_EVENTS.PAGE_VIEW, {
            path: pathname,
            $current_url: url,
            referrer:
                typeof document !== "undefined" ? document.referrer : "",
        });
    }, [pathname, searchParams]);

    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public provider — Suspense wrapper required for useSearchParams in App Router
// ─────────────────────────────────────────────────────────────────────────────

interface PostHogProviderProps {
    children: React.ReactNode;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
    return (
        <>
            <Suspense fallback={null}>
                <PostHogPageView />
            </Suspense>
            {children}
        </>
    );
}
