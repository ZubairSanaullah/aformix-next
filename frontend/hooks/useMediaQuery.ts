"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Returns false on the server and on
 * first client render, then syncs to the real value after mount
 * to avoid a hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        setMatches(mediaQueryList.matches);

        function handleChange(event: MediaQueryListEvent) {
            setMatches(event.matches);
        }

        mediaQueryList.addEventListener("change", handleChange);
        return () =>
            mediaQueryList.removeEventListener("change", handleChange);
    }, [query]);

    return matches;
}
