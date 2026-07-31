'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { ServiceFeature } from "@/types/service";
import SectionBadge from "@/components/services/SectionBadge";
import {
  staggerContainer,
  staggerItem,
  scrollViewport,
} from "@/utils/animations";
import { iconMap } from "@/lib/iconMap";
import { Zap } from "lucide-react";

interface FeatureGridProps {
  features: ServiceFeature[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!features || features.length === 0) return null;

  const gridCols =
    features.length <= 2
      ? "md:grid-cols-2 max-w-2xl mx-auto"
      : features.length === 3
      ? "md:grid-cols-3"
      : features.length <= 6
      ? "md:grid-cols-2 lg:grid-cols-3"
      : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <section id="features" className="section-padding relative" style={{ background: "var(--color-surface)" }}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionBadge>Core Capabilities</SectionBadge>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-2"
          >
            Everything You Need
          </motion.h2>
        </div>

        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className={`grid gap-6 ${gridCols}`}
        >
          {features.map((feature) => {

            const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? Zap;

            const isHovered = hoveredId === feature.id;
            return (
              <motion.div
                key={feature.id}
                variants={staggerItem}
                onMouseEnter={() => setHoveredId(feature.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group rounded-3xl p-8 cursor-default overflow-hidden transition-all duration-500"
                style={{
                  background: isHovered
                    ? "linear-gradient(135deg, rgba(49,185,143,0.08), rgba(104,75,158,0.06))"
                    : "var(--color-glass)",
                  backdropFilter: "blur(24px)",
                  border: isHovered
                    ? "1px solid rgba(49,185,143,0.35)"
                    : "1px solid var(--color-glass-border)",
                  transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? "0 20px 60px rgba(49,185,143,0.12)"
                    : "none",
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"
                  style={{
                    background: isHovered
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                      : "rgba(49,185,143,0.12)",
                  }}
                >
                  {Icon && (
                    <Icon
                      size={26}
                      style={{ color: isHovered ? "white" : "var(--color-primary)" }}
                    />
                  )}
                </div>

                <h3
                  className="text-xl font-bold mb-3 transition-colors duration-300"
                  style={{ color: isHovered ? "var(--color-primary)" : "var(--color-text)" }}
                >
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-[0.95rem]" style={{ color: "var(--color-text-muted)" }}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureGrid;
