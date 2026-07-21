'use client';

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Globe, ChartNoAxesCombined } from "lucide-react";
import { CiMobile1 } from "react-icons/ci";
import { BsRobot } from "react-icons/bs";
import Divider from "./Divider";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-animate", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power3.out",
      });

      const statsTargets = [12, 99.99, 45, 8.7];
      const formatStat = (value: number, index: number) => {
        if (index === 0) return `${Math.round(value)}x`;
        if (index === 1) return `${value.toFixed(2)}%`;
        if (index === 3) return `${value.toFixed(1)}/10`;
        return `${Math.round(value)}`;
      };

      gsap.utils.toArray<HTMLParagraphElement>(".stat-number").forEach((el, index) => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: statsTargets[index],
          duration: 1.6,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = formatStat(counter.value, index);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    {
      icon: ChartNoAxesCombined,
      title: "SEO Optimized",
      description: "Search-Engine Optimized (SEO) websites that rank higher in search results and drive more traffic.",
    },
    {
      icon: ShieldCheck,
      title: "Security Guarded",
      description: "High-end security features to protect your website from hackers and malware.",
    },
    {
      icon: CiMobile1,
      title: "Mobile Responsive",
      description: "Perfectly optimized for all devices, ensuring a seamless experience on desktops, tablets, and smartphones.",
    },
    {
      icon: Globe,
      title: "Worldwide Clients",
      description: "We have delivered digital solutions to clients across the globe.",
    },
  ];

  const stats = [
    { label: "Faster Turnaround" },
    { label: "Platform Uptime" },
    { label: "Trusted Partners" },
    { label: "Client Satisfaction" },
  ];

  return (
    <section id="about" ref={sectionRef} className="reveal section-padding relative overflow-hidden w-full">
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[var(--color-bg)] to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative">
        <div className="mb-16 text-center about-animate">
          <span className="text-primary font-black tracking-[0.35em] uppercase">Why Aformix</span>
          <h2 className="heading-2 mt-6">A smarter agency for ambitious digital teams.</h2>
          <p className="mx-auto mt-6 max-w-3xl text-slate-400 text-xl leading-relaxed">
            We build premium web products that combine beautiful design, technical precision, and measurable business impact. Our process is collaborative, transparent, and engineered to accelerate your next major digital move.
          </p>
        </div>

        <div className="grid gap-14 xl:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="space-y-8 about-animate">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-[var(--color-glass-border)] glass-effect">
              <div className="relative overflow-hidden bg-gradient-to-br from-[#04040d] via-[#080c1a] to-[#04040d]">
                {/* Glow orbs behind mascot */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/15 rounded-full blur-[60px] pointer-events-none" />
                <Image
                  src="/img/banner.png"
                  alt="Orbit — Aformix AI Mascot"
                  width={800}
                  height={1000}
                  className="w-full aspect-[4/5] object-cover object-center scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/95 via-[var(--color-bg)]/20 to-transparent"></div>
              </div>

              <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 md:left-8 md:right-8 md:bottom-8 rounded-[2rem] md:rounded-[2.5rem] border border-[var(--color-glass-border)] glass-effect p-5 sm:p-6 md:p-8 shadow-2xl">
                <div className="inline-flex items-center gap-2 md:gap-3 rounded-full bg-primary/10 border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-primary font-semibold mb-3 md:mb-4">
                  <span className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-primary animate-pulse" />
                  Meet Orbit — Your AI Assistant
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--color-text)] mb-2 md:mb-4 leading-tight">Crafting distinctive digital products that scale.</h3>
                <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-4 md:mb-6">
                  Orbit is our AI mascot that represents our commitment to modern digital craftsmanship and exceptional user experiences.
                </p>
                <button
                  onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-orbit-ai')); }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-semibold transition hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <BsRobot size={18} />
                  Open Orbit AI
                </button>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {highlights.map((item, index) => (
                <div key={index} className="glass-effect rounded-3xl border border-white/10 p-6 shadow-xl">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                    <item.icon size={24} />
                  </div>
                  <h4 className="text-xl font-semibold text-[var(--color-text)] mb-2">{item.title}</h4>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 about-animate">
            <div className="rounded-[3rem] border border-white/10 bg-slate-950/80 p-10 shadow-2xl glass-effect">
              <span className="text-primary uppercase tracking-[0.35em] font-black text-sm">Our mission</span>
              <h3 className="mt-6 text-4xl font-black text-[var(--color-text)] leading-tight">
                Launch premium experiences that feel effortless and perform flawlessly.
              </h3>
              <p className="mt-6 text-[var(--color-text-muted)] text-lg leading-relaxed">
                We partner with ambitious founders and product teams to design, build, and evolve web platforms that give your business a decisive advantage.
              </p>
            </div>

            <div className="grid gap-6 rounded-[3rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl glass-effect">
              <div className="flex items-start gap-4">
                <div className="min-w-[3rem] h-12 rounded-2xl bg-primary/10 text-primary grid place-items-center font-bold">1</div>
                <div>
                  <h4 className="text-xl font-semibold text-[var(--color-text)]">Design with clarity</h4>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">Research-led interfaces that make complex products feel intuitive.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="min-w-[3rem] h-12 rounded-2xl bg-primary/10 text-primary grid place-items-center font-bold">2</div>
                <div>
                  <h4 className="text-xl font-semibold text-[var(--color-text)]">Develop with precision</h4>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">Robust, scalable architecture built for performance and stability.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="min-w-[3rem] h-12 rounded-2xl bg-primary/10 text-primary grid place-items-center font-bold">3</div>
                <div>
                  <h4 className="text-xl font-semibold text-[var(--color-text)]">Grow with confidence</h4>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">Continuous improvement and strategic support beyond launch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 about-animate">
          {stats.map((item, index) => (
            <div key={index} className="glass-effect rounded-[2rem] border border-white/10 p-8 text-center shadow-2xl">
              <p className="stat-number text-4xl font-black text-primary mb-3">0</p>
              <p className="text-[var(--color-text)] leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider />
    </section>
  );
};

export default About;
