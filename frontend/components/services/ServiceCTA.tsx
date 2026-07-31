'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";

interface ServiceCTAProps {
  description?: string;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({
  description = "Get in touch today to discuss your project requirements and receive a custom proposal within 24 hours.",
}) => {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Background ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] opacity-15 blur-[120px] rounded-full pointer-events-none"
        style={{ background: "var(--color-primary)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-20 border border-white shadow-2xl bg-white/70"
          style={{
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Animated gradient mesh background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div
              className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] blur-[80px] rounded-full"
              style={{ background: "var(--color-primary)" }}
            />
            <div
              className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] blur-[80px] rounded-full"
              style={{ background: "var(--color-secondary)" }}
            />
          </div>

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230f172a\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-[var(--color-primary)]/20 bg-white/80 text-slate-800 shadow-lg backdrop-blur-md"
            >
              <span>Let's Build the Future Together</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Ready to Transform <br className="hidden md:block" />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
              >
                Your Business?
              </span>
            </h2>

            <p className="text-lg md:text-xl mb-12 text-slate-600 max-w-2xl font-light">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
              <Link href="https://calendly.com/aformixtech/30min" target="_blank" className="w-full sm:w-auto">
                <button
                  className="group relative flex items-center justify-center gap-3 px-8 py-4 w-full rounded-2xl font-bold text-base transition-all duration-300 overflow-hidden hover:scale-105 shadow-xl"
                  style={{
                    background: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                    color: "white",
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <Calendar size={20} className="relative z-10" />
                  <span className="relative z-10">Book a Free Consultation</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href="/contact" className="w-full sm:w-auto">
                <button
                  className="group relative flex items-center justify-center gap-3 px-8 py-4 w-full rounded-2xl font-bold text-base transition-all duration-300 border border-slate-300 hover:border-slate-400 bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md hover:scale-105 shadow-sm"
                >
                  <MessageSquare size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
                  <span>Request a Proposal</span>
                </button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 w-full border-t border-[var(--color-border)] pt-10">
              {[
                { label: "Free Consultation", icon: "🤝" },
                { label: "No Hidden Fees", icon: "🛡️" },
                { label: "Reply Within 24hrs", icon: "⚡" },
                { label: "100% Satisfaction", icon: "⭐" }
              ].map((trust) => (
                <div key={trust.label} className="flex flex-col items-center gap-3 text-[var(--color-text-muted)]">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl border border-[var(--color-border)]shadow-sm">
                    {trust.icon}
                  </div>
                  <span className="text-sm font-medium text-center">{trust.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceCTA;
