'use client';

import React from "react";
import { Zap, Shield, Crown, Smile, Bot } from "lucide-react";
import Divider from "./Divider";
import Image from "next/image";

const WhyChooseUs: React.FC = () => {
  const perks = [
    { icon: Crown, title: "Premium Quality", desc: "Top-tier code quality following industry best practices." },
    { icon: Zap, title: "Rapid Performance", desc: "Zero-latency experiences for your end users." },
    { icon: Shield, title: "Ironclad Security", desc: "Built with a security-first mindset from the ground up." },
    { icon: Smile, title: "Client Focused", desc: "Transparent communication and dedicated support." }
  ];

  return (
    <section className="reveal section-padding w-full" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-primary font-black tracking-[0.35em] uppercase mb-4 inline-block">Why Choose Us</span>
          <h2 className="heading-2 mb-6">Simple, trusted solutions for your next project</h2>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
            We keep the process clear and focused so you can move faster. Our team delivers reliable products with strong support and modern craftsmanship.
          </p>
        </div>

        {/* Main split layout */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">
          {/* Left: Perks Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {perks.map((perk, i) => (
              <div key={i} className="card-premium p-8 transition hover:-translate-y-1 hover:border-primary">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <perk.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">{perk.title}</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>

          {/* Right: Orbit Mascot Showcase */}
          <div className="orbit-why-card-wrapper">
            <div className="orbit-why-card relative rounded-[3rem] overflow-hidden border border-[var(--color-glass-border)] glass-effect shadow-2xl">
            {/* Glow blobs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-1/4 left-1/3 w-56 h-56 bg-primary/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary/15 rounded-full blur-[60px]" />
            </div>

            {/* Orbit image */}
            <div className="relative bg-gradient-to-br from-[#04040d] via-[#080c1a] to-[#04040d]">
              <Image
                width={800}
                height={1000}
                src="/img/banner.png"
                alt="Orbit AI Mascot — Aformix"
                className="w-full object-cover object-center"
                style={{ aspectRatio: "1/1" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
            </div>

            {/* Bottom info card */}
            <div className="relative p-6 -mt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-[var(--color-text)] font-bold text-sm">Orbit AI</p>
                  <p className="text-[var(--color-text-muted)] text-xs">Your intelligent digital partner</p>
                </div>
                {/* <div className="ml-auto flex items-center gap-1.5 text-primary">
                  <Sparkles size={14} />
                  <span className="text-xs font-semibold">Active</span>
                </div> */}
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["Custom Development", "Smart Workflows", "24/7 Support", "Data Insights"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/8 border border-primary/15 text-primary/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-orbit-ai')); }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text)] px-4 py-3 font-semibold transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] shadow-sm hover:shadow-[0_16px_40px_rgba(49,185,143,0.4)] transform hover:-translate-y-1 cursor-pointer"
              >
                <Bot size={18} />
                Open Orbit AI
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
      <Divider />
    </section>
  );
};

export default WhyChooseUs;
