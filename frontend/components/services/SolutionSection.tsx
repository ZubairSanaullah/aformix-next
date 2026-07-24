'use client';

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, BarChart3, ShieldCheck } from "lucide-react";
import type { ServiceSolution } from "@/types/service";

interface SolutionSectionProps {
  solution: ServiceSolution;
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ solution }) => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
          {/* Left – text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: "rgba(49,185,143,0.12)", color: "var(--color-primary)", border: "1px solid rgba(49,185,143,0.25)" }}
            >
              Our Approach
            </div>

            <h2 className="heading-2 text-left mb-6">{solution.title}</h2>

            <p className="text-lg leading-relaxed mb-10" style={{ color: "var(--color-text-muted)" }}>
              {solution.description}
            </p>

            <ul className="space-y-4">
              {solution.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.15 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(49,185,143,0.15)" }}
                  >
                    <CheckCircle2 style={{ color: "var(--color-primary)" }} size={16} />
                  </div>
                  <span className="font-medium" style={{ color: "var(--color-text)" }}>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right – innovative abstract visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative h-[450px] lg:h-[550px] flex items-center justify-center"
            style={{ perspective: 1000 }}
          >
            {/* Background glowing orb */}
            <motion.div
              className="absolute w-64 h-64 rounded-full"
              style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)", filter: "blur(80px)", opacity: 0.2 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 3D Floating Isometric Cards Container */}
            <motion.div
              className="relative w-full max-w-[320px] aspect-[3/4]"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: [-12, 12, -12], rotateX: [10, 18, 10] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Base layer */}
              <div
                className="absolute inset-0 rounded-3xl glass-effect"
                style={{
                  transform: "translateZ(0px)",
                  background: "linear-gradient(135deg, rgba(49,185,143,0.08), var(--color-glass))",
                  border: "1px solid var(--color-glass-border)"
                }}
              >
                <div className="p-6 h-full flex flex-col justify-between opacity-80">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-glass-border)" }}>
                    <ShieldCheck size={24} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-3/4 rounded opacity-20" style={{ background: "var(--color-text)" }} />
                    <div className="h-3 w-1/2 rounded opacity-20" style={{ background: "var(--color-text)" }} />
                    <div className="h-3 w-5/6 rounded opacity-20" style={{ background: "var(--color-text)" }} />
                  </div>
                </div>
              </div>

              {/* Middle layer card */}
              <motion.div
                className="absolute top-12 -right-16 w-64 h-52 rounded-2xl glass-effect p-5 shadow-2xl"
                style={{
                  transform: "translateZ(60px)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-glass-border)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,191,222,0.15)" }}>
                    <BarChart3 size={20} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div>
                    <div className="h-3 w-20 rounded opacity-20 mb-2" style={{ background: "var(--color-text)" }} />
                    <div className="h-2 w-12 rounded opacity-10" style={{ background: "var(--color-text)" }} />
                  </div>
                </div>
                {/* Fake chart bars */}
                <div className="flex items-end justify-between gap-2 h-20 mt-4">
                  {[40, 70, 45, 90, 60, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-full rounded-t-sm"
                      style={{ background: "linear-gradient(to top, var(--color-accent), transparent)" }}
                      initial={{ height: "0%" }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Top floating elements */}
              <motion.div
                className="absolute -bottom-8 -left-8 w-56 h-auto rounded-2xl glass-effect p-4 shadow-2xl"
                style={{
                  transform: "translateZ(120px)",
                  border: "1px solid var(--color-glass-border)",
                  background: "var(--color-surface-elevated)"
                }}
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--color-secondary)" }}>
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold mb-1" style={{ color: "var(--color-text)" }}>System Optimal</div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>All services running smoothly</div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
