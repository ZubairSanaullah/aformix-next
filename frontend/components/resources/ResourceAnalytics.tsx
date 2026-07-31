"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface ResourceAnalyticsProps {
    title: string;
    slug: string;
    category: string;
}

export default function ResourceAnalytics({
    title,
    slug,
    category,
}: ResourceAnalyticsProps) {
    useEffect(() => {
        trackEvent("resource_view", {
            resource_title: title,
            resource_slug: slug,
            category,
        });
    }, [title, slug, category]);

    return null;
}