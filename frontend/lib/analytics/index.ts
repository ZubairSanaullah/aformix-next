/**
 * lib/analytics/index.ts
 *
 * Barrel export for the Aformix analytics module.
 *
 * Analytics architecture:
 *
 *   GA4 (acquisition/marketing)
 *     → lib/analytics.ts → trackEvent() → window.gtag
 *
 *   PostHog (behavioral/product)
 *     → lib/analytics/ (this module)
 *     → trackPostHogEvent() → posthog-js
 *
 *   Aformix Workspace (business metrics)
 *     → lib/services/analytics/ → Prisma
 */

// PostHog event tracking (behavioral / product analytics)
export { trackPostHogEvent, identifyPostHogUser, resetPostHogUser, POSTHOG_EVENTS } from "./events";

// PostHog client (for advanced use cases only — prefer trackPostHogEvent)
export { getPostHogClient } from "./posthog-client";

// React components
export { default as PostHogProvider } from "./PostHogProvider";
export { default as PostHogIdentify } from "./PostHogIdentify";
