"use client";

/**
 * components/analytics/AnalyticsLink.tsx
 *
 * A drop-in replacement for Next.js <Link> that fires analytics events
 * on click via both layers:
 *   - GA4 (existing `trackEvent` — acquisition/marketing)
 *   - PostHog (new `trackPostHogEvent` — behavioral)
 *
 * Used in Hero, Navbar, and any component that needs link-click analytics
 * without directly coupling to the analytics libraries.
 */

import Link, { LinkProps } from "next/link";
import { trackEvent } from "@/lib/analytics";
import { trackPostHogEvent, POSTHOG_EVENTS } from "@/lib/analytics/events";
import { MouseEvent, ReactNode } from "react";

interface AnalyticsLinkProps extends LinkProps {
    children: ReactNode;
    eventName: string;
    eventParams?: Record<string, unknown>;
    className?: string;
    target?: string;
    rel?: string;
    /** Optional: send a PostHog cta_clicked event in addition to the GA4 event */
    trackCta?: boolean;
    /** Name for PostHog CTA event (defaults to eventParams.button or eventName) */
    ctaName?: string;
    /** Location for PostHog CTA event */
    ctaLocation?: string;
}

export default function AnalyticsLink({
    children,
    eventName,
    eventParams,
    trackCta = false,
    ctaName,
    ctaLocation,
    onClick,
    ...props
}: AnalyticsLinkProps) {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        // GA4 layer — acquisition/marketing events (preserved exactly)
        trackEvent(eventName, eventParams);

        // PostHog layer — behavioral CTA tracking (only when opted in)
        if (trackCta) {
            trackPostHogEvent(POSTHOG_EVENTS.CTA_CLICKED, {
                cta_name: ctaName ?? (eventParams?.button as string) ?? eventName,
                location: ctaLocation ?? (eventParams?.location as string) ?? "unknown",
                page: typeof window !== "undefined" ? window.location.pathname : undefined,
                destination: typeof props.href === "string" ? props.href : undefined,
            });
        }

        onClick?.(event);
    };

    return (
        <Link
            {...props}
            onClick={handleClick}
        >
            {children}
        </Link>
    );
}