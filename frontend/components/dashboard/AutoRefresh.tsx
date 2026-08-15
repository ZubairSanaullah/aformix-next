"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRefreshProps {
    interval?: number;
}

export default function AutoRefresh({ interval = 30000 }: AutoRefreshProps) {
    const router = useRouter();

    useEffect(() => {
        const intervalId = setInterval(() => {
            router.refresh();
        }, interval);

        return () => clearInterval(intervalId);
    }, [router, interval]);

    return null; // This component doesn't render anything
}
