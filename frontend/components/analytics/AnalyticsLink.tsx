"use client";

import Link, { LinkProps } from "next/link";
import { trackEvent } from "@/lib/analytics";
import { MouseEvent, ReactNode } from "react";

interface AnalyticsLinkProps extends LinkProps {
    children: ReactNode;
    eventName: string;
    eventParams?: Record<string, unknown>;
    className?: string;
    target?: string;
    rel?: string;
}

export default function AnalyticsLink({
    children,
    eventName,
    eventParams,
    onClick,
    ...props
}: AnalyticsLinkProps) {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        trackEvent(eventName, eventParams);

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