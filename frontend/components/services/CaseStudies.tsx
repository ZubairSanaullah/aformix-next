'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ServiceCaseStudy } from "@/types/service";
import Link from "next/link";


interface CaseStudiesProps {
  caseStudies: ServiceCaseStudy[];
}

const CaseStudies: React.FC<CaseStudiesProps> = ({ caseStudies }) => {
  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: "var(--color-surface)" }}>
      <div className="container mx-auto px-6">
        {/* Header row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ background: "rgba(49,185,143,0.12)", color: "var(--color-primary)", border: "1px solid rgba(49,185,143,0.25)" }}
            >
              Case Studies
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-2 text-left mb-3"
            >
              Proven Results
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg"
              style={{ color: "var(--color-text-muted)" }}
            >
              Real impact for real businesses.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-bold hover:gap-3 transition-all"
              style={{ color: "var(--color-primary)" }}
            >
              View Full Portfolio
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Cards */}
        <div className={`grid gap-8 ${caseStudies.length === 1 ? "max-w-2xl mx-auto" : "md:grid-cols-2"}`}>
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative rounded-3xl p-8 flex flex-col h-full overflow-hidden group"
              style={{
                background: "var(--color-glass)",
                backdropFilter: "blur(24px)",
                border: "1px solid var(--color-glass-border)",
              }}
            >
              {/* Hover gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                style={{ background: "linear-gradient(135deg, rgba(49,185,143,0.04), transparent)" }}
              />

              {/* Client tag */}
              <div
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "var(--color-primary)" }}
              >
                {study.client}
              </div>

              <h3 className="text-2xl font-bold mb-8" style={{ color: "var(--color-text)" }}>
                {study.title}
              </h3>

              <div className="space-y-5 mb-8 flex-grow">
                {/* Challenge */}
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#ef4444" }}>
                    Challenge
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {study.challenge}
                  </p>
                </div>
                {/* Solution */}
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: "rgba(49,185,143,0.07)", border: "1px solid rgba(49,185,143,0.15)" }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-primary)" }}>
                    Solution
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {study.solution}
                  </p>
                </div>
              </div>

              {/* Results */}
              <div
                className="grid gap-4 pt-6"
                style={{
                  gridTemplateColumns: `repeat(${study.results.length}, 1fr)`,
                  borderTop: "1px solid var(--color-glass-border)",
                }}
              >
                {study.results.map((result, rIdx) => (
                  <div key={rIdx}>
                    <div
                      className="text-2xl font-black"
                      style={{
                        background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {result.value}
                    </div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wider mt-1"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {result.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
