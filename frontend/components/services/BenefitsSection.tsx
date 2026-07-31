'use client';

import React from "react";
import { motion } from "framer-motion";
import type { ServiceBenefit } from "@/types/service";
import { TrendingUp } from "lucide-react";

interface BenefitsSectionProps {
  benefits: ServiceBenefit[];
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background decorative gradient */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(49,185,143,0.08), transparent 70%)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(49,185,143,0.12)", color: "var(--color-primary)", border: "1px solid rgba(49,185,143,0.25)" }}
          >
            <TrendingUp size={16} />
            Business Impact
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-2"
          >
            Measurable ROI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg mt-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            Real results from businesses that have made the investment.
          </motion.p>
        </div>

        <div className={`grid gap-8 ${benefits.length <= 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "md:grid-cols-3"}`}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="relative rounded-3xl p-8 text-center overflow-hidden group"
              style={{
                background: "var(--color-glass)",
                backdropFilter: "blur(24px)",
                border: "1px solid var(--color-glass-border)",
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-6 right-6 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))" }}
              />

              {/* Metric */}
              {benefit.metric && (
                <div className="mb-4">
                  <span
                    className="text-5xl md:text-6xl font-black tracking-tight"
                    style={{
                      background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {benefit.metric}
                  </span>
                  {benefit.metricLabel && (
                    <div
                      className="text-xs font-bold tracking-widest uppercase mt-2"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {benefit.metricLabel}
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--color-text)" }}>
                {benefit.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
