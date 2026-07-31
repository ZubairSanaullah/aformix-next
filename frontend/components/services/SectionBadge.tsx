'use client';

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, scrollViewport } from "@/utils/animations";
import type { LucideIcon } from "lucide-react";

export type BadgeVariant = "primary" | "secondary" | "accent" | "danger";

interface SectionBadgeProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  primary: {
    background: "rgba(49,185,143,0.12)",
    color: "var(--color-primary)",
    border: "1px solid rgba(49,185,143,0.25)",
  },
  secondary: {
    background: "rgba(104,75,158,0.12)",
    color: "var(--color-secondary)",
    border: "1px solid rgba(104,75,158,0.3)",
  },
  accent: {
    background: "rgba(0,191,222,0.1)",
    color: "var(--color-accent)",
    border: "1px solid rgba(0,191,222,0.25)",
  },
  danger: {
    background: "rgba(239,68,68,0.12)",
    color: "#ef4444",
    border: "1px solid rgba(239,68,68,0.25)",
  },
};

const SectionBadge: React.FC<SectionBadgeProps> = ({
  children,
  icon: Icon,
  variant = "primary",
  className = "",
}) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${className}`}
      style={variantStyles[variant]}
    >
      {Icon && <Icon size={16} />}
      {children}
    </motion.div>
  );
};

export default SectionBadge;
