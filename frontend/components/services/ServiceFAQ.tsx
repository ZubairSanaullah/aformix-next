'use client';

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { ServiceFAQItem } from "@/types/service";

interface ServiceFAQProps {
  faqs: ServiceFAQItem[];
}

const ServiceFAQ: React.FC<ServiceFAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (faqs) {
      setVisibleItems(Array(faqs.length).fill(false));
    }
  }, [faqs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => {
              if (prev[index]) return prev;
              const next = [...prev];
              next[index] = true;
              return next;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [faqs]);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="section-padding w-full">
      <div className="relative max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20 relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(104,75,158,0.12)", color: "var(--color-secondary)", border: "1px solid rgba(104,75,158,0.3)" }}
          >
            <HelpCircle size={16} />
            FAQ
          </div>
          <h2 className="heading-2">Questions Answered</h2>
        </div>

        <div className="space-y-4 md:space-y-6 relative z-10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const isVisible = visibleItems[index];
            return (
              <div
                key={faq.id || index}
                ref={(el) => { itemRefs.current[index] = el; }}
                data-index={index}
                className={`group relative overflow-hidden rounded-xl md:rounded-[2rem] border border-[var(--color-glass-border)] glass-effect shadow-xl transition-all duration-700 ease-out transform-gpu ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  } hover:-translate-y-1`}
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <div className="absolute inset-x-8 top-0 h-1 rounded-full" />
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="relative w-full px-5 md:px-10 py-6 md:py-8 flex items-center justify-between text-left gap-4"
                >
                  <span className={`text-base md:text-2xl font-semibold transition-colors flex-1 ${isOpen ? "text-[var(--color-text)]" : "text-[var(--color-text)] group-hover:text-[var(--color-text)]"
                    }`}>
                    {faq.question}
                  </span>
                  <div className={`w-10 h-10 md:w-11 md:h-11 min-w-[2.5rem] min-h-[2.5rem] md:min-w-[2.75rem] md:min-h-[2.75rem] rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${isOpen ? "bg-primary text-white rotate-180 shadow-lg shadow-primary/30" : "glass-effect text-[var(--color-text-muted)]"
                    }`}>
                    <ChevronDown size={18} className="md:w-5 md:h-5" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
                  }`}>
                  <div className="px-5 md:px-10 pb-8 md:pb-10 pt-4 md:pt-6 text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed border-t border-[var(--color-glass-border)]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQ;
