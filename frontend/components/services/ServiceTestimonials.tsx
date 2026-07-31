import React from "react";
import type { ServiceTestimonial } from "@/types/service";
import { Quote, Star } from "lucide-react";
import Divider from "@/components/Divider";

interface ServiceTestimonialsProps {
  testimonials?: ServiceTestimonial[];
}

const ServiceTestimonials: React.FC<ServiceTestimonialsProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="reveal section-padding relative w-full overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl opacity-50 -z-10 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="section-badge inline-block mb-4">Client Success</span>
          <h2 className="heading-2">What our <span className="gradient-text">clients say</span></h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="card-premium border border-[var(--color-glass-border)] shadow-xl p-8 rounded-[2rem] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
              <div>
                <div className="flex gap-1 text-secondary mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <Quote className="text-primary opacity-15 mb-6" size={52} />
                <p className="text-xl font-semibold text-[var(--color-text)] leading-relaxed mb-8 italic">
                  "{t.content}"
                </p>
              </div>
              <div className="mt-4 pt-6 border-t border-[var(--color-border)]">
                <p className="text-base text-[var(--color-text)] font-bold mb-1">{t.name}</p>
                <p className="text-sm text-primary font-medium tracking-wide">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Divider />
    </section>
  );
};

export default ServiceTestimonials;
