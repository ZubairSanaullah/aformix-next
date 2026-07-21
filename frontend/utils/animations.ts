import type { Variants, Transition } from "framer-motion";

/** Shared viewport config for scroll-triggered animations */
export const scrollViewport = { once: true, margin: "-80px" as const };

/** Default easing used across service pages */
export const premiumEase = [0.22, 0.61, 0.36, 1] as const;

export const defaultTransition: Transition = {
  duration: 0.6,
  ease: premiumEase,
};

/** Fade up on scroll */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/** Slide in from left */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: premiumEase },
  },
};

/** Slide in from right */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: premiumEase },
  },
};

/** Scale reveal */
export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: premiumEase },
  },
};

/** Stagger children container */
export const staggerContainer = (stagger = 0.1, delayChildren = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Stagger child item */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: premiumEase },
  },
};

/** Hero entrance stagger */
export const heroStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: premiumEase },
  },
};

/** Subtle hover lift for cards */
export const cardHover = {
  y: -6,
  transition: { duration: 0.3, ease: premiumEase },
};

/** Floating animation for hero decorations */
export const floatAnimation = {
  y: [0, -12, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
};
