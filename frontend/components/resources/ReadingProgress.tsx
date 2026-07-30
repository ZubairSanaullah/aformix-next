"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const scrollHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight <= 0) {
                setProgress(0);
                return;
            }

            const percentage = (scrollTop / scrollHeight) * 100;

            setProgress(Math.min(100, Math.max(0, percentage)));
            setVisible(scrollTop > 50);
        };

        updateProgress();

        window.addEventListener("scroll", updateProgress);

        return () => {
            window.removeEventListener("scroll", updateProgress);
        };
    }, []);

    return (
        <div
            className={`fixed left-0 top-0 z-[100] h-[3px] w-full bg-transparent transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"
                }`}
        >
            <div
                className="h-full rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)] transition-[width] duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}