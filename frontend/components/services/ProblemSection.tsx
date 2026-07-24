'use client';

import React from "react";
import { motion } from "framer-motion";
import type { ServiceProblem } from "@/types/service";
import SectionBadge from "@/components/services/SectionBadge";
import { fadeUp, scrollViewport } from "@/utils/animations";
import { iconMap } from "@/lib/iconMap";
import { AlertTriangle } from "lucide-react";

interface ProblemSectionProps {
  problems: ServiceProblem[];
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ problems }) => {
  if (!problems || problems.length === 0) return null;

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Background accent glows */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.2), transparent 70%)", filter: "blur(80px)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, rgba(104,75,158,0.2), transparent 70%)", filter: "blur(70px)" }}
        aria-hidden="true"
      />
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(239,68,68,0.5), transparent)" }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionBadge variant="danger">Common Challenges</SectionBadge>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            className="heading-2"
          >
            Sound Familiar?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            style={{ color: "var(--color-text-muted)" }}
            className="text-lg mt-4"
          >
            These are the most common obstacles we see businesses struggling with.{" "}
            <span style={{ color: "var(--color-primary)" }} className="font-semibold">
              We know exactly how to solve them.
            </span>
          </motion.p>
        </div>

        <div
          className={`grid gap-6 ${
            problems.length === 2
              ? "md:grid-cols-2 max-w-3xl mx-auto"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {problems.map((problem, index) => {
            const Icon = iconMap[problem.icon as keyof typeof iconMap] ?? AlertTriangle;

            return (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                whileHover={{ y: -8 }}
                className="card-premium group cursor-default relative"
              >
                {/* Step number */}
                <div
                  className="absolute top-6 right-6 text-6xl font-black opacity-[0.06] select-none pointer-events-none"
                  style={{ color: "#ef4444", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem]"
                  style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.06), transparent)" }}
                />

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shrink-0"
                  style={{ background: "rgba(239,68,68,0.12)" }}
                >
                  {Icon && <Icon style={{ color: "#ef4444" }} size={26} />}
                </div>

                {/* Top accent line */}
                <div
                  className="absolute top-0 left-8 right-8 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, #ef4444, transparent)" }}
                  aria-hidden="true"
                />

                <h3 className="text-xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
                  {problem.title}
                </h3>
                <p
                  className="leading-relaxed text-[0.95rem]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {problem.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
