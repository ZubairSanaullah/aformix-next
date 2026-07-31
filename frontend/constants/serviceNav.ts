import type { LucideIcon } from "lucide-react";
import {
  Code,
  Layers,
  Rocket,
  Smartphone,
  Globe,
  Search,
  PenTool,
  Briefcase,
  HeartPulse,
  Users,
  Building2,
  ShoppingCart,
  Layout,
} from "lucide-react";

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

export interface ServiceNavItem {
  id: string;
  title: string;
  shortDescription: string;
  icon: LucideIcon;
  category: "Development" | "Enterprise" | "Growth & Design";
}

export const serviceNavItems: ServiceNavItem[] = [
  {
    id: "custom-development",
    title: "Custom Web Development",
    shortDescription: "Bespoke applications built for you",
    icon: Code,
    category: "Development",
  },
  {
    id: "mern-stack-development",
    title: "MERN Stack Development",
    shortDescription: "MongoDB, Express, React & Node.js",
    icon: Layers,
    category: "Development",
  },
  {
    id: "full-stack-solutions",
    title: "Full Stack Solutions",
    shortDescription: "End-to-end product engineering",
    icon: Rocket,
    category: "Development",
  },
  {
    id: "web-application-development",
    title: "Web Application Development",
    shortDescription: "Scalable browser-based platforms",
    icon: Globe,
    category: "Development",
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    shortDescription: "iOS & Android native experiences",
    icon: Smartphone,
    category: "Development",
  },
  {
    id: "saas-development",
    title: "SaaS Application Development",
    shortDescription: "Multi-tenant products built to scale",
    icon: Rocket,
    category: "Development",
  },
  {
    id: "wordpress-development",
    title: "WordPress Development",
    shortDescription: "Custom themes, plugins & CMS",
    icon: Layout,
    category: "Development",
  },
  {
    id: "crm-development",
    title: "CRM Development",
    shortDescription: "Sales pipelines your team will use",
    icon: Users,
    category: "Enterprise",
  },
  {
    id: "erp-solutions",
    title: "ERP Solutions",
    shortDescription: "Unified operations across departments",
    icon: Building2,
    category: "Enterprise",
  },
  {
    id: "hospital-management-systems",
    title: "Hospital Management Systems",
    shortDescription: "HIPAA-compliant healthcare platforms",
    icon: HeartPulse,
    category: "Enterprise",
  },
  {
    id: "e-commerce-development",
    title: "E-Commerce Development",
    shortDescription: "High-converting online stores",
    icon: ShoppingCart,
    category: "Enterprise",
  },
  {
    id: "seo",
    title: "SEO Services",
    shortDescription: "Rank higher & drive organic growth",
    icon: Search,
    category: "Growth & Design",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    shortDescription: "Interfaces users love to use",
    icon: PenTool,
    category: "Growth & Design",
  },
  {
    id: "portfolio-websites",
    title: "Portfolio Websites",
    shortDescription: "Showcase work that wins clients",
    icon: Briefcase,
    category: "Growth & Design",
  },
];

export const serviceHeroConfig: Record<
  string,
  { variant: HeroVariant; valueProposition: string }
> = {
  "custom-development": {
    variant: "code",
    valueProposition: "Software built around your business — not the other way around",
  },
  "mern-stack-development": {
    variant: "mern",
    valueProposition: "Ship production-ready MERN apps in weeks, not months",
  },
  "full-stack-solutions": {
    variant: "fullstack",
    valueProposition: "One team. One vision. From database to deployment.",
  },
  "saas-development": {
    variant: "saas",
    valueProposition: "Launch your SaaS MVP and start generating recurring revenue",
  },
  "mobile-app-development": {
    variant: "mobile",
    valueProposition: "Native-quality apps that users download and keep",
  },
  "web-application-development": {
    variant: "webapp",
    valueProposition: "Enterprise web platforms that scale with your growth",
  },
  seo: {
    variant: "seo",
    valueProposition: "Dominate search results and capture high-intent traffic",
  },
  "ui-ux-design": {
    variant: "design",
    valueProposition: "Design that converts visitors into loyal customers",
  },
  "portfolio-websites": {
    variant: "portfolio",
    valueProposition: "A portfolio that makes the right impression in 3 seconds",
  },
  "hospital-management-systems": {
    variant: "healthcare",
    valueProposition: "HIPAA-ready systems that streamline patient care",
  },
  "crm-development": {
    variant: "crm",
    valueProposition: "Close more deals with a CRM built for your sales process",
  },
  "erp-solutions": {
    variant: "erp",
    valueProposition: "One platform to run your entire business operation",
  },
  "e-commerce-development": {
    variant: "ecommerce",
    valueProposition: "Stores engineered for conversion, not just aesthetics",
  },
  "wordpress-development": {
    variant: "wordpress",
    valueProposition: "WordPress sites that load fast and rank on Google",
  },
};

export const getServicePath = (serviceId: string) => `/services/${serviceId}`;

export const homepageServiceSlugs: Record<number, string> = {
  1: "custom-development",
  2: "mern-stack-development",
  3: "full-stack-solutions",
  4: "portfolio-websites",
  5: "mobile-app-development",
  6: "hospital-management-systems",
  7: "wordpress-development",
  8: "saas-development",
};
