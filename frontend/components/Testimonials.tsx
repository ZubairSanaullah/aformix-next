'use client';

import React from "react";
import { testimonials } from "../constants";
import { Quote, Star, ArrowRight, Bot } from "lucide-react";
import Divider from "./Divider";
import Image from "next/image";

const Testimonials: React.FC = () => {
  return (
    <section className="reveal section-padding relative w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-primary font-black tracking-[0.35em] uppercase mb-4 inline-block">Testimonials</span>
          <h2 className="heading-2 mb-6">Trusted by Global <br /> <span className="gradient-text">Innovators</span></h2>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
            Discover what our clients have to say about partnering with Aformix.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.id} className="card-premium border border-[var(--color-glass-border)] shadow-2xl p-8 rounded-[2rem] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
              <div>
                <div className="flex gap-1 text-secondary mb-6">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <Quote className="text-primary opacity-15 mb-6" size={52} />
                <p className="text-xl md:text-2xl font-semibold text-[var(--color-text)] leading-relaxed mb-10 italic">
                  "{t.content}"
                </p>
              </div>
              <div className="mt-4">
                <p className="text-base text-[var(--color-text)] mb-2">— {t.name}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Orbit Mascot CTA Strip ── */}
        <div className="orbit-testimonial-strip mt-16 p-8 md:p-12">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">

            {/* Mascot visual */}
            <div className="">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden">
                <Image
                  width={56}
                  height={56}
                  src="/img/avatar.png"
                  alt="Orbit AI Mascot"
                  className="orbit-faq-avatar w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                <Bot size={12} />
                Orbit AI — Ready to help
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-[var(--color-text)] leading-tight mb-3">
                Let's build something <span className="gradient-text">extraordinary</span> together.
              </h3>
              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-xl">
                Join 45+ businesses already growing with Aformix's intelligent digital solutions. Your next big idea is one conversation away.
              </p>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <a
                href="#contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-primary/40 group"
                style={{ background: "linear-gradient(135deg, #27b990, #684b9e)" }}
              >
                <span>Start a Project</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

      </div>
      <Divider />
    </section>
  );
};

export default Testimonials;
