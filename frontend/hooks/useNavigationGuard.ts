"use client";

import { useEffect } from "react";

export function useNavigationGuard(
    enabled: boolean
) {
    useEffect(() => {
        if (!enabled) return;

        const handleClick = (
            event: MouseEvent
        ) => {
            const target =
                event.target as HTMLElement;

            const link =
                target.closest("a");

            if (!link) return;

            const href =
                link.getAttribute("href");

            if (!href) return;

            if (
                !window.confirm(
                    "You have unsaved changes. Leave this page?"
                )
            ) {
                event.preventDefault();
            }
        };

        document.addEventListener(
            "click",
            handleClick
        );

        return () => {
            document.removeEventListener(
                "click",
                handleClick
            );
        };
    }, [enabled]);
}