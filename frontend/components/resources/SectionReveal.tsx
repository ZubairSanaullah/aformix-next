"use client";

import { useEffect, useRef, useState } from "react";

interface SectionRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export default function SectionReveal({
    children,
    className = "",
    delay = 0,
}: SectionRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -80px 0px",
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                transitionDelay: `${delay}ms`,
            }}
            className={`
    transition-all duration-700 ease-out
    ${visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
    ${className}
  `}
        >
            {children}
        </div>
    );
}