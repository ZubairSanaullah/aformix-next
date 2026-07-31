"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const useReveal = (selector = ".reveal", rootMargin = "0px 0px -8% 0px", trigger?: any) => {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    // Fallback: if IntersectionObserver is unavailable, reveal everything
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin,
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Safety: reveal any elements already in viewport on mount
    requestAnimationFrame(() => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("reveal-visible");
          observer.unobserve(el);
        }
      });
    });

    // Fallback: if for any reason IntersectionObserver didn't run (hydration edge-cases),
    // ensure reveal elements are visible after a short delay to avoid blank pages.
    const fallbackTimer = window.setTimeout(() => {
      elements.forEach((el) => {
        if (!el.classList.contains("reveal-visible")) {
          el.classList.add("reveal-visible");
          try {
            observer.unobserve(el);
          } catch (e) {
            // ignore
          }
        }
      });
    }, 700);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [selector, rootMargin, pathname, trigger]);
};

export default useReveal;
