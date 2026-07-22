'use client';

import React, { useEffect, useRef, useState } from "react";
import { faqs } from "../constants";
import { ChevronDown } from "lucide-react";

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(faqs.length).fill(false));
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

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
  }, []);

  return (
    <section id="faq" className="reveal section-padding w-full" aria-labelledby="faq-heading">
      <div className="relative max-w-4xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center mb-20 text-center relative z-10">
          <span className="text-primary font-black tracking-[0.35em] uppercase mb-4 inline-block">FAQ</span>
          <h2 className="heading-2 mb-6" id="faq-heading">Got Questions?</h2>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
            Transparent answers to help you navigate our process, timelines, and post-launch capabilities.
          </p>
        </div>

        <div className="space-y-4 md:space-y-6 relative z-10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const isVisible = visibleItems[index];
            return (
              <div
                key={index}
                ref={(el) => { itemRefs.current[index] = el; }}
                data-index={index}
                className={`group relative overflow-hidden rounded-xl md:rounded-[2rem] border border-[var(--color-glass-border)] glass-effect shadow-xl transition-all duration-700 ease-out transform-gpu ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  } hover:-translate-y-1`}
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <div className="absolute inset-x-8 top-0 h-1 rounded-full" />
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-button-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="relative w-full px-5 md:px-10 py-6 md:py-8 flex items-center justify-between text-left gap-4"
                >
                  <span className={`text-base md:text-2xl font-semibold transition-colors flex-1 ${isOpen ? "text-[var(--color-text)]" : "text-[var(--color-text)] group-hover:text-[var(--color-text)]"
                    }`}>
                    {faq.question}
                  </span>
                  <div className={`w-10 h-10 md:w-11 md:h-11 min-w-[2.5rem] min-h-[2.5rem] md:min-w-[2.75rem] md:min-h-[2.75rem] rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${isOpen ? "bg-primary text-white rotate-180 shadow-lg shadow-primary/30" : "glass-effect text-[var(--color-text-muted)]"
                    }`}>
                    <ChevronDown size={18} className="md:w-5 md:h-5" aria-hidden="true" focusable={false}/>
                  </div>
                </button>
                <div id={`faq-panel-${index}`} className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
                  }`} role="region" aria-labelledby={`faq-button-${index}`}>
                  <div className="px-5 md:px-10 pb-8 md:pb-10 pt-4 md:pt-6 text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed border-t border-[var(--color-glass-border)]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <Divider /> */}
    </section>
  );
};

export default FAQ;
