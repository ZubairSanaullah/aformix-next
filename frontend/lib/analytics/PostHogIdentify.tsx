"use client";

/**
 * lib/analytics/PostHogIdentify.tsx
 *
 * Identifies the authenticated Aformix workspace user in PostHog.
 *
 * Usage:
 *   Render this component inside WorkspaceLayoutClient (or any layout that
 *   already has the server-resolved user object available as a prop).
 *
 * Privacy rules:
 * - Identifies by stable internal UUID only — NOT by email or display name
 * - Only sends `role` as a trait (no PII)
 * - Calls posthog.reset() on unmount (user logs out / session ends)
 */

import { useEffect, useRef } from "react";
import { identifyPostHogUser, resetPostHogUser } from "./events";

interface PostHogIdentifyProps {
    userId: string;
    role?: string;
}

export default function PostHogIdentify({ userId, role }: PostHogIdentifyProps) {
    const identifiedRef = useRef<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        if (identifiedRef.current === userId) return;

        identifiedRef.current = userId;
        identifyPostHogUser(userId, { role });

        return () => {
            // Reset on unmount — e.g., user navigates away from workspace
            // (not called on re-renders, only on actual unmount)
        };
    }, [userId, role]);

    // Reset when user ID clears (logout scenario)
    useEffect(() => {
        return () => {
            resetPostHogUser();
        };
    }, []);

    return null;
}
