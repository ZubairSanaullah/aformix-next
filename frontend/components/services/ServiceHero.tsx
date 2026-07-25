'use client';

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Zap, CheckCircle2, Cpu } from "lucide-react";
import Link from "next/link";
import type { HeroVariant } from "@/constants/serviceNav";
import { heroStagger, heroItem } from "@/utils/animations";
import dynamic from "next/dynamic";

const ServiceHeroIllustration = dynamic(
  () => import("@/components/services/ServiceHeroIllustration"),
  {
    ssr: false,
  }
);
import gsap from "gsap";

interface ServiceHeroProps {
  badge: string;
  headline: string;
  valueProposition?: string;
  description: string;
  heroVariant?: HeroVariant;
}

/* ── Mini Particle Field ── */
const ParticleField: React.FC = () => {
  const particles = [
    { id: 1, x: 10, y: 20, size: 2, duration: 20, delay: 1, opacity: 0.2 },
    { id: 2, x: 25, y: 70, size: 3, duration: 24, delay: 3, opacity: 0.15 },
    { id: 3, x: 40, y: 35, size: 1.5, duration: 18, delay: 2, opacity: 0.25 },
    { id: 4, x: 60, y: 80, size: 2.5, duration: 22, delay: 5, opacity: 0.18 },
    { id: 5, x: 75, y: 25, size: 2, duration: 26, delay: 4, opacity: 0.22 },
  ];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const ServiceHero: React.FC<ServiceHeroProps> = ({
  badge,
  headline,
  valueProposition,
  description,
  heroVariant = "code",
}) => {
  const heroRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty("--mouse-x", x.toFixed(4));
    hero.style.setProperty("--mouse-y", y.toFixed(4));
  };

  const handleMouseLeave = () => {
    const hero = heroRef.current;
    if (!hero) return;
    gsap.to(hero, {
      "--mouse-x": 0,
      "--mouse-y": 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden min-h-[90vh] flex items-center"
      style={{ background: "var(--color-bg)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated glow blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(49,185,143,0.16) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(104,75,158,0.16) 0%, transparent 70%)" }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,191,222,0.09) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        aria-hidden="true"
      />

      <ParticleField />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — copy */}
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Premium badge — mirrors home page hero badge */}
            <motion.div variants={heroItem} className="inline-flex items-center gap-2 mb-6">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(49,185,143,0.10)",
                  border: "1px solid rgba(49,185,143,0.3)",
                  color: "var(--color-primary)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-primary"
                  style={{ animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
                />
                <span>{badge}</span>
              </div>
            </motion.div>

            {/* Headline — home-page heading-1 style */}
            <motion.h1 variants={heroItem} className="heading-1 mb-4 text-center lg:text-left">
              {headline}
            </motion.h1>

            {valueProposition && (
              <motion.p
                variants={heroItem}
                className="text-xl md:text-2xl font-semibold mb-6 gradient-text text-center lg:text-left"
              >
                {valueProposition}
              </motion.p>
            )}

            <motion.p
              variants={heroItem}
              className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
              style={{ color: "var(--color-text-muted)" }}
            >
              {description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={heroItem}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12"
            >
              <Link
                href="/contact"
                className="btn-primary flex items-center gap-2 group text-base px-8 py-4"
              >
                Get a Free Proposal
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <button
                className="btn-outline text-base px-8 py-4"
                onClick={() =>
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Features
              </button>
            </motion.div>

            {/* Trust badges — mirrors home page trust pills */}
            <motion.div
              variants={heroItem}
              className="flex flex-wrap gap-2 justify-center lg:justify-start"
            >
              {[
                { icon: <Zap size={13} />, label: "Fast Delivery" },
                { icon: <CheckCircle2 size={13} />, label: "Quality Guaranteed" },
                { icon: <Cpu size={13} />, label: "Modern Stack" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--color-glass)",
                    border: "1px solid var(--color-glass-border)",
                    color: "var(--color-text-muted)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <span style={{ color: "var(--color-primary)" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              variants={heroItem}
              className="hidden lg:flex flex-col items-start gap-2 mt-12"
              style={{ color: "var(--color-text-muted)" }}
            >
              <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown size={20} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT — illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="hidden md:block"
          >
            {/* Mascot and UI Cards Centerpiece */}
            <ServiceHeroIllustration variant={heroVariant} />
          </motion.div>

        </div>

        {/* Mobile scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex lg:hidden flex-col items-center gap-2 mt-8"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceHero;
