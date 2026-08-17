/**
 * lib/analytics/events.ts
 *
 * Centralized event taxonomy for Aformix analytics.
 *
 * Architecture:
 *   GA4    → acquisition, marketing, conversions          (via lib/analytics.ts → window.gtag)
 *   PostHog → behavioral, product, funnels, session replay (via this file)
 *   Aformix DB → business metrics                         (via lib/services/analytics/)
 *
 * Rules:
 * - All event names use snake_case.
 * - No magic strings — import from POSTHOG_EVENTS.
 * - Each event has a typed property interface.
 * - This file is the single source of truth for PostHog event names.
 * - Analytics must NEVER crash the application — all calls are wrapped in try/catch.
 *
 * To add a new event:
 *   1. Add the event name to POSTHOG_EVENTS below.
 *   2. Add the property interface to PostHogEventProperties.
 *   3. Call trackPostHogEvent(POSTHOG_EVENTS.YOUR_EVENT, { ...props }) in your component.
 *
 * PRIVACY:
 * - Do NOT send passwords, tokens, private keys, session secrets, or payment data.
 * - Do NOT send full message contents from contact/support forms.
 * - Use stable, internal IDs for user identification — NOT email addresses.
 */

import { getPostHogClient } from "./posthog-client";

// ─────────────────────────────────────────────────────────────────────────────
// Event Name Registry
// ─────────────────────────────────────────────────────────────────────────────

export const POSTHOG_EVENTS = {
    // ── Public Website ────────────────────────────────────────────────────────
    PAGE_VIEW: "page_view",
    SERVICE_VIEWED: "service_viewed",
    PORTFOLIO_PROJECT_VIEWED: "portfolio_project_viewed",
    CTA_CLICKED: "cta_clicked",
    CONTACT_FORM_STARTED: "contact_form_started",
    CONTACT_FORM_SUBMITTED: "contact_form_submitted",
    CALENDLY_CLICKED: "calendly_clicked",
    EMAIL_CLICKED: "email_clicked",
    SOCIAL_LINK_CLICKED: "social_link_clicked",
    NEWSLETTER_SUBSCRIBED: "newsletter_subscribed",

    // ── Authentication ────────────────────────────────────────────────────────
    USER_SIGNED_UP: "user_signed_up",
    USER_LOGGED_IN: "user_logged_in",
    USER_LOGGED_OUT: "user_logged_out",

    // ── Workspace (general) ───────────────────────────────────────────────────
    WORKSPACE_VIEWED: "workspace_viewed",
    ANALYTICS_VIEWED: "analytics_viewed",

    // ── CRM ───────────────────────────────────────────────────────────────────
    CONTACT_CREATED: "contact_created",
    COMPANY_CREATED: "company_created",
    LEAD_CREATED: "lead_created",
    DEAL_CREATED: "deal_created",
    DEAL_STAGE_CHANGED: "deal_stage_changed",

    // ── Projects ──────────────────────────────────────────────────────────────
    PROJECT_CREATED: "project_created",
    TASK_CREATED: "task_created",
    TASK_COMPLETED: "task_completed",

    // ── CMS / Blog ────────────────────────────────────────────────────────────
    BLOG_CREATED: "blog_created",
    BLOG_PUBLISHED: "blog_published",

    // ── Knowledge Base ────────────────────────────────────────────────────────
    KNOWLEDGE_ARTICLE_CREATED: "knowledge_article_created",
    KNOWLEDGE_ARTICLE_VIEWED: "knowledge_article_viewed",

    // ── Portfolio ─────────────────────────────────────────────────────────────
    PORTFOLIO_PROJECT_CREATED: "portfolio_project_created",
    PORTFOLIO_PROJECT_PUBLISHED: "portfolio_project_published",
} as const;

export type PostHogEventName = (typeof POSTHOG_EVENTS)[keyof typeof POSTHOG_EVENTS];

// ─────────────────────────────────────────────────────────────────────────────
// Event Property Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface PageViewProperties {
    path: string;
    referrer?: string;
}

export interface ServiceViewedProperties {
    service_slug: string;
    service_name: string;
    location?: string;
}

export interface PortfolioProjectViewedProperties {
    project_id?: string;
    project_slug?: string;
    project_title: string;
    category?: string;
    location?: string;
}

export interface CtaClickedProperties {
    cta_name: string;
    location: string;
    page?: string;
    destination?: string;
}

export interface ContactFormStartedProperties {
    form_name: string;
    source_page?: string;
}

export interface ContactFormSubmittedProperties {
    form_name: string;
    service_selected?: string;
    source_page?: string;
    // NOTE: Never include name, email, phone, or message content here
}

export interface CalendlyClickedProperties {
    location: string;
    page?: string;
}

export interface EmailClickedProperties {
    email_address?: string; // only include if not PII-sensitive in your context
    location: string;
}

export interface SocialLinkClickedProperties {
    platform: string;
    location: string;
}

export interface NewsletterSubscribedProperties {
    location: string;
}

export interface UserSignedUpProperties {
    // Use stable internal ID only, not email
    user_id: string;
}

export interface UserLoggedInProperties {
    user_id: string;
    role?: string;
}

export interface UserLoggedOutProperties {
    user_id?: string;
}

export interface WorkspaceViewedProperties {
    page: string;
    path: string;
}

export interface AnalyticsViewedProperties {
    date_range?: string;
    compare_enabled?: boolean;
}

export interface ContactCreatedProperties {
    contact_id: string;
}

export interface CompanyCreatedProperties {
    company_id: string;
}

export interface LeadCreatedProperties {
    lead_id: string;
    source?: string;
}

export interface DealCreatedProperties {
    deal_id: string;
    stage?: string;
    has_value?: boolean;
}

export interface DealStageChangedProperties {
    deal_id: string;
    from_stage: string;
    to_stage: string;
}

export interface ProjectCreatedProperties {
    project_id: string;
    status?: string;
}

export interface TaskCreatedProperties {
    task_id: string;
    project_id?: string;
    priority?: string;
}

export interface TaskCompletedProperties {
    task_id: string;
    project_id?: string;
}

export interface BlogCreatedProperties {
    post_id: string;
}

export interface BlogPublishedProperties {
    post_id: string;
    slug?: string;
}

export interface KnowledgeArticleCreatedProperties {
    article_id: string;
    category?: string;
}

export interface KnowledgeArticleViewedProperties {
    article_id: string;
    article_slug?: string;
    category?: string;
    visibility?: string;
}

export interface PortfolioProjectCreatedProperties {
    project_id: string;
    category?: string;
}

export interface PortfolioProjectPublishedProperties {
    project_id: string;
    slug?: string;
    category?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Typed event map (EventName → Properties)
// ─────────────────────────────────────────────────────────────────────────────

type PostHogEventProperties = {
    [POSTHOG_EVENTS.PAGE_VIEW]: PageViewProperties;
    [POSTHOG_EVENTS.SERVICE_VIEWED]: ServiceViewedProperties;
    [POSTHOG_EVENTS.PORTFOLIO_PROJECT_VIEWED]: PortfolioProjectViewedProperties;
    [POSTHOG_EVENTS.CTA_CLICKED]: CtaClickedProperties;
    [POSTHOG_EVENTS.CONTACT_FORM_STARTED]: ContactFormStartedProperties;
    [POSTHOG_EVENTS.CONTACT_FORM_SUBMITTED]: ContactFormSubmittedProperties;
    [POSTHOG_EVENTS.CALENDLY_CLICKED]: CalendlyClickedProperties;
    [POSTHOG_EVENTS.EMAIL_CLICKED]: EmailClickedProperties;
    [POSTHOG_EVENTS.SOCIAL_LINK_CLICKED]: SocialLinkClickedProperties;
    [POSTHOG_EVENTS.NEWSLETTER_SUBSCRIBED]: NewsletterSubscribedProperties;
    [POSTHOG_EVENTS.USER_SIGNED_UP]: UserSignedUpProperties;
    [POSTHOG_EVENTS.USER_LOGGED_IN]: UserLoggedInProperties;
    [POSTHOG_EVENTS.USER_LOGGED_OUT]: UserLoggedOutProperties;
    [POSTHOG_EVENTS.WORKSPACE_VIEWED]: WorkspaceViewedProperties;
    [POSTHOG_EVENTS.ANALYTICS_VIEWED]: AnalyticsViewedProperties;
    [POSTHOG_EVENTS.CONTACT_CREATED]: ContactCreatedProperties;
    [POSTHOG_EVENTS.COMPANY_CREATED]: CompanyCreatedProperties;
    [POSTHOG_EVENTS.LEAD_CREATED]: LeadCreatedProperties;
    [POSTHOG_EVENTS.DEAL_CREATED]: DealCreatedProperties;
    [POSTHOG_EVENTS.DEAL_STAGE_CHANGED]: DealStageChangedProperties;
    [POSTHOG_EVENTS.PROJECT_CREATED]: ProjectCreatedProperties;
    [POSTHOG_EVENTS.TASK_CREATED]: TaskCreatedProperties;
    [POSTHOG_EVENTS.TASK_COMPLETED]: TaskCompletedProperties;
    [POSTHOG_EVENTS.BLOG_CREATED]: BlogCreatedProperties;
    [POSTHOG_EVENTS.BLOG_PUBLISHED]: BlogPublishedProperties;
    [POSTHOG_EVENTS.KNOWLEDGE_ARTICLE_CREATED]: KnowledgeArticleCreatedProperties;
    [POSTHOG_EVENTS.KNOWLEDGE_ARTICLE_VIEWED]: KnowledgeArticleViewedProperties;
    [POSTHOG_EVENTS.PORTFOLIO_PROJECT_CREATED]: PortfolioProjectCreatedProperties;
    [POSTHOG_EVENTS.PORTFOLIO_PROJECT_PUBLISHED]: PortfolioProjectPublishedProperties;
};

// ─────────────────────────────────────────────────────────────────────────────
// Core Tracking Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tracks a PostHog event with strongly-typed properties.
 *
 * Safe to call anywhere — silently no-ops if:
 * - PostHog is not initialized (no key configured)
 * - Running on the server (SSR)
 * - PostHog fails for any reason (catches and logs error)
 *
 * @example
 * trackPostHogEvent(POSTHOG_EVENTS.CTA_CLICKED, {
 *   cta_name: "Get Started",
 *   location: "hero",
 *   page: "/",
 * });
 */
export function trackPostHogEvent<E extends PostHogEventName>(
    event: E,
    properties: PostHogEventProperties[E]
): void {
    try {
        const ph = getPostHogClient();
        if (!ph) return;
        ph.capture(event, properties);
    } catch (error) {
        // Analytics must NEVER break the application
        if (process.env.NODE_ENV === "development") {
            console.error("[PostHog] Failed to capture event:", event, error);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// User Identification
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Identifies an authenticated user in PostHog using their stable internal ID.
 *
 * Privacy rules:
 * - Use stable internal `user.id` (UUID) — NOT email
 * - Only include role as a property — do not include name/email unless
 *   you have explicit consent and a legitimate business need
 *
 * Called from PostHogProvider when a session is detected.
 */
export function identifyPostHogUser(
    userId: string,
    properties?: {
        role?: string;
    }
): void {
    try {
        const ph = getPostHogClient();
        if (!ph) return;
        ph.identify(userId, {
            ...(properties?.role && { role: properties.role }),
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("[PostHog] Failed to identify user:", error);
        }
    }
}

/**
 * Resets the PostHog session — call on logout.
 * This dissociates the current session from the identified user.
 */
export function resetPostHogUser(): void {
    try {
        const ph = getPostHogClient();
        if (!ph) return;
        ph.reset();
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("[PostHog] Failed to reset user:", error);
        }
    }
}
