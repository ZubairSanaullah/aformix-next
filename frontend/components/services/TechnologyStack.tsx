'use client';

import React from "react";
import { motion } from "framer-motion";
import type { ServiceTechStack } from "@/types/service";
import { iconMap } from "@/lib/iconMap";
import { Zap } from "lucide-react";

interface TechnologyStackProps {
  techStack: ServiceTechStack[];
}

const TechnologyStack: React.FC<TechnologyStackProps> = ({ techStack }) => {
  if (!techStack || techStack.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(104,75,158,0.08), transparent 60%)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(0,191,222,0.1)", color: "var(--color-accent)", border: "1px solid rgba(0,191,222,0.25)" }}
          >
            Technology Stack
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-2"
          >
            Tools We Master
          </motion.h2>
        </div>

        <div className="space-y-12 max-w-5xl mx-auto">
          {techStack.map((category, catIdx) => (
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIdx * 0.1 }}
            >
              <h3
                className="text-center text-sm font-bold tracking-widest uppercase mb-6"
                style={{ color: "var(--color-text-muted)" }}
              >
                {category.category}
              </h3>

              <div className="flex flex-wrap justify-center gap-3">
                {category.technologies.map((tech, tIdx) => {
                  const Icon = iconMap[tech.icon] || Zap;
                  return (
                    <motion.div
                      key={tIdx}
                      whileHover={{ y: -4, scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-default transition-all duration-300"
                      style={{
                        background: "var(--color-glass)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid var(--color-glass-border)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(49,185,143,0.45)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(49,185,143,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-glass-border)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      }}
                    >
                      {Icon && <Icon style={{ color: "var(--color-primary)" }} size={20} />}
                      <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                        {tech.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyStack;
