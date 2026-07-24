'use client';

import React from "react";
import { motion } from "framer-motion";
import type { ServiceProcessStep } from "@/types/service";
import { iconMap } from "@/lib/iconMap";
import { Zap } from "lucide-react";

interface ProcessTimelineProps {
  process: ServiceProcessStep[];
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ process }) => {
  if (!process || process.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: "var(--color-surface)" }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(104,75,158,0.12)", color: "var(--color-secondary)", border: "1px solid rgba(104,75,158,0.3)" }}
          >
            How We Work
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-2"
          >
            Our Proven Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg mt-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            A structured approach that delivers consistent, high-quality results every time.
          </motion.p>
        </div>

        {/* Desktop grid + Mobile vertical */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {process.map((step, index) => {
            const Icon = iconMap[step.icon] || Zap;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Connector line */}
                {index < process.length - 1 && (
                  <div
                    className="absolute top-10 left-1/2 w-full h-px opacity-30"
                    style={{ background: "linear-gradient(90deg, var(--color-primary), transparent)" }}
                  />
                )}

                {/* Step number badge */}
                <div
                  className="absolute -top-3 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black z-10"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", color: "white" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Icon circle */}
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, rgba(49,185,143,0.15), rgba(104,75,158,0.1))",
                    border: "1px solid rgba(49,185,143,0.25)",
                  }}
                >
                  {Icon && <Icon style={{ color: "var(--color-primary)" }} size={30} />}
                </div>

                <h3 className="text-lg font-bold mb-3" style={{ color: "var(--color-text)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden max-w-lg mx-auto space-y-6">
          {process.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-5"
              >
                {/* Left column: icon + line */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(49,185,143,0.12)", border: "1px solid rgba(49,185,143,0.25)" }}
                  >
                    {Icon && <Icon style={{ color: "var(--color-primary)" }} size={22} />}
                  </div>
                  {index < process.length - 1 && (
                    <div
                      className="w-px flex-1 mt-2"
                      style={{ minHeight: 32, background: "linear-gradient(to bottom, var(--color-primary), transparent)", opacity: 0.3 }}
                    />
                  )}
                </div>

                <div className="pt-2 pb-4">
                  <div className="text-xs font-bold mb-1" style={{ color: "var(--color-primary)" }}>
                    Step {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
