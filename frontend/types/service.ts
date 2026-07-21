import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

export type AnyIcon = IconType | LucideIcon;

export interface ServiceProblem {
  id: string;
  title: string;
  description: string;
  icon?: AnyIcon;
}

export interface ServiceSolution {
  title: string;
  description: string;
  benefits: string[];
}

export interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: AnyIcon;
}

export interface ServiceBenefit {
  id: string;
  title: string;
  description: string;
  metric?: string; // e.g., "300%", "2.5x", "10x"
  metricLabel?: string; // e.g., "ROI Increase", "Faster Time to Market"
}

export interface ServiceProcessStep {
  id: string;
  title: string;
  description: string;
  icon: AnyIcon;
}

export interface ServiceTechStack {
  category: string;
  technologies: {
    name: string;
    icon?: AnyIcon; // Or URL string if using an image
  }[];
}

export interface ServiceCaseStudy {
  id: string;
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  image?: string;
}

export interface ServiceFAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export interface ServicePricingPlan {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  link?: string;
  featured?: boolean;
}

export interface ServiceSEO {
  title: string;
  description: string;
  keywords: string;
}

export type HeroVariant =
  | "code"
  | "mern"
  | "fullstack"
  | "saas"
  | "mobile"
  | "webapp"
  | "seo"
  | "design"
  | "portfolio"
  | "healthcare"
  | "crm"
  | "erp"
  | "ecommerce"
  | "wordpress";

export interface ServiceData {
  id: string;
  title: string;
  badge: string;
  heroHeadline: string;
  heroDescription: string;
  valueProposition?: string;
  heroVariant?: HeroVariant;
  heroImage?: string; // URL or local path
  seo: ServiceSEO;
  problems: ServiceProblem[];
  solution: ServiceSolution;
  features: ServiceFeature[];
  benefits: ServiceBenefit[];
  process: ServiceProcessStep[];
  techStack: ServiceTechStack[];
  caseStudies: ServiceCaseStudy[];
  faqs: ServiceFAQItem[];
  testimonials?: ServiceTestimonial[];
  pricingPlans?: ServicePricingPlan[];
  ctaHeadline?: string;
  ctaDescription?: string;
}
