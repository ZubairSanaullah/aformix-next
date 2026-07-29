import type { Resource } from "@/types/resource";

export const resources: Resource[] = [
  {
    title: "SEO Framework",
    slug: "seo-framework",
    category: "SEO",
    description:
      "A premium framework for building search visibility through strategy, content, and technical SEO foundations.",
    image: "/images/resources/seo-framework.svg",
    pdf: "/downloads/seo-framework.pdf",
    pages: 14,
    readingTime: "8 min read",
    updatedAt: "July 2026",
    publishedAt: "2024-06-01",
    keywords: ["SEO", "search strategy", "on-page SEO", "technical SEO", "content strategy"],
    featured: true,
    relatedResources: ["website-audit", "technical-seo", "landing-page-checklist"],
    overview:
      "This guide gives founders and marketing teams a practical map for turning SEO into a measurable growth engine. It focuses on building a clear plan before you publish content or request a website redesign.",
    learnings: [
      "Keyword Research",
      "On-page SEO",
      "Technical SEO",
      "Internal Linking",
      "Local SEO",
      "Content Strategy",
    ],
    audience: ["Business owners", "Marketing teams", "Developers", "Agencies"],
    whyItExists:
      "Aformix created this resource because many brands launch beautiful websites without any search foundation. This framework helps teams connect content, structure, and performance so SEO becomes predictable instead of reactive.",
    faqs: [
      {
        question: "Who is this resource best for?",
        answer: "It is ideal for founders, marketers, and agencies who need a practical starting point for SEO growth.",
      },
      {
        question: "What makes it different from a generic checklist?",
        answer: "It connects technical optimization, messaging, and conversion planning into one growth framework.",
      },
    ],
  },
  {
    title: "ChatGPT Prompt Pack",
    slug: "chatgpt-prompts",
    category: "AI",
    description:
      "A curated set of prompt templates for copywriting, ideation, technical planning, and content production.",
    image: "/images/resources/chatgpt-prompts.svg",
    pdf: "/downloads/chatgpt-prompts.pdf",
    pages: 11,
    readingTime: "6 min read",
    updatedAt: "July 2026",
    publishedAt: "2024-07-01",
    keywords: ["AI", "ChatGPT", "prompts", "marketing", "automation"],
    featured: true,
    relatedResources: ["ai-productivity", "seo-framework", "landing-page-checklist"],
    overview:
      "This prompt pack helps teams get more useful output from AI by applying clear context, structure, and business purpose to every request.",
    learnings: [
      "Prompt Structuring",
      "Content Ideation",
      "Email Campaigns",
      "UX Writing",
      "Technical Planning",
      "Review Workflows",
    ],
    audience: ["Marketing teams", "Startups", "Freelancers", "Developers"],
    whyItExists:
      "Aformix built this pack to reduce the trial-and-error fatigue many teams experience when using AI tools for strategy and content creation.",
  },
  {
    title: "Landing Page Checklist",
    slug: "landing-page-checklist",
    category: "Web Design",
    description:
      "A conversion-focused checklist for designing landing pages that connect messaging, layout, and trust signals.",
    image: "/images/resources/landing-page-checklist.svg",
    pdf: "/downloads/landing-page.pdf",
    pages: 10,
    readingTime: "5 min read",
    updatedAt: "July 2026",
    publishedAt: "2024-05-15",
    keywords: ["landing page", "conversion", "web design", "UX", "marketing"],
    featured: true,
    relatedResources: ["ux-checklist", "seo-framework", "website-audit"],
    overview:
      "Use this checklist to review the core elements that make landing pages feel credible, clear, and ready to convert visitors into leads.",
    learnings: [
      "Value Proposition",
      "Visual Hierarchy",
      "CTA Design",
      "Trust Signals",
      "Mobile Optimization",
      "Analytics Setup",
    ],
    audience: ["Business owners", "Marketing teams", "Agencies", "Startups"],
    whyItExists:
      "This resource exists to help teams avoid common conversion mistakes that quietly hurt lead generation and campaign performance.",
  },
  {
    title: "Website Audit Checklist",
    slug: "website-audit",
    category: "Performance",
    description:
      "A practical audit checklist for spotting weak areas in speed, structure, content, and conversion paths.",
    image: "/images/resources/website-audit.svg",
    pdf: "/downloads/website-audit.pdf",
    pages: 12,
    readingTime: "7 min read",
    updatedAt: "July 2026",
    publishedAt: "2024-04-20",
    keywords: ["website audit", "performance", "SEO", "conversion", "accessibility"],
    featured: false,
    relatedResources: ["technical-seo", "landing-page-checklist", "ux-checklist"],
    overview:
      "This checklist is built for teams that want a structured way to review an existing website without losing momentum or overspending on vague fixes.",
    learnings: [
      "Speed Review",
      "Accessibility Checks",
      "Content Quality",
      "Navigation Review",
      "Form Conversion",
      "Technical Health",
    ],
    audience: ["Business owners", "Developers", "Agencies", "Freelancers"],
    whyItExists:
      "Aformix uses this checklist to help clients prioritize improvements that create the biggest ROI instead of chasing minor issues first.",
  },
  {
    title: "UX Checklist",
    slug: "ux-checklist",
    category: "UI/UX",
    description:
      "A polished checklist for improving clarity, consistency, and usability across modern digital products.",
    image: "/images/resources/ux-checklist.svg",
    pdf: "/downloads/ux-checklist.pdf",
    pages: 9,
    readingTime: "5 min read",
    updatedAt: "July 2026",
    publishedAt: "2024-03-10",
    keywords: ["UX", "design system", "usability", "user experience", "wireframes"],
    featured: false,
    relatedResources: ["landing-page-checklist", "website-audit", "technical-seo"],
    overview:
      "This checklist helps teams review product flows and page experience from a user-first perspective, with clear priorities that support momentum.",
    learnings: [
      "Navigation Clarity",
      "Content Hierarchy",
      "Mobile Usability",
      "Feedback States",
      "Accessibility",
      "Consistency",
    ],
    audience: ["Product teams", "Developers", "Startups", "Agencies"],
    whyItExists:
      "Aformix created this checklist because beautiful interfaces often fail when the user journey has hidden friction or unclear expectations.",
  },
  {
    title: "Local SEO Guide",
    slug: "local-seo",
    category: "SEO",
    description:
      "A practical guide to improving visibility in local search, Google Business Profile, and nearby discovery.",
    image: "/images/resources/local-seo.svg",
    pdf: "/downloads/local-seo.pdf",
    pages: 13,
    readingTime: "7 min read",
    updatedAt: "July 2026",
    publishedAt: "2024-02-14",
    keywords: ["local SEO", "Google Business Profile", "maps", "near me", "local search"],
    featured: false,
    relatedResources: ["seo-framework", "technical-seo", "website-audit"],
    overview:
      "This guide covers the practical steps local businesses need to improve discoverability, trust, and conversion from the local search funnel.",
    learnings: [
      "Profile Optimization",
      "Local Keywords",
      "Review Strategy",
      "Location Pages",
      "Citation Building",
      "Local Content",
    ],
    audience: ["Business owners", "Agencies", "Marketing teams", "Freelancers"],
    whyItExists:
      "Aformix built this guide to help service-based businesses capture high-intent local demand without overcomplicating their search strategy.",
  },
  {
    title: "Technical SEO Essentials",
    slug: "technical-seo",
    category: "SEO",
    description:
      "A practical framework for improving crawlability, page speed, indexation, and technical site health.",
    image: "/images/resources/technical-seo.svg",
    pdf: "/downloads/technical-seo.pdf",
    pages: 15,
    readingTime: "8 min read",
    updatedAt: "July 2026",
    publishedAt: "2024-01-18",
    keywords: ["technical SEO", "site speed", "indexing", "crawlability", "schema"],
    featured: false,
    relatedResources: ["seo-framework", "website-audit", "local-seo"],
    overview:
      "This resource focuses on the technical health signals that directly affect crawlability, ranking potential, and long-term site performance.",
    learnings: [
      "Crawlability",
      "Indexation",
      "Page Speed",
      "Schema Markup",
      "Core Web Vitals",
      "Site Structure",
    ],
    audience: ["Developers", "Business owners", "Agencies", "Marketing teams"],
    whyItExists:
      "The goal is to turn technical SEO into a manageable checklist rather than a hidden backlog of fixes that never gets prioritized.",
  },
  {
    title: "AI Productivity Guide",
    slug: "ai-productivity",
    category: "AI",
    description:
      "A strategic guide for teams using AI to reduce repetition, improve quality, and create better workflows.",
    image: "/images/resources/ai-productivity.svg",
    pdf: "/downloads/ai-productivity.pdf",
    pages: 12,
    readingTime: "6 min read",
    updatedAt: "July 2026",
    publishedAt: "2024-08-01",
    keywords: ["AI productivity", "workflow automation", "prompt design", "content operations"],
    featured: false,
    relatedResources: ["chatgpt-prompts", "seo-framework", "landing-page-checklist"],
    overview:
      "This guide explains how to use AI in a way that supports quality control, speed, and consistency across content and operations.",
    learnings: [
      "Workflow Automation",
      "Review Systems",
      "Prompt Design",
      "Team Adoption",
      "Quality Control",
      "Content Scaling",
    ],
    audience: ["Startups", "Freelancers", "Marketing teams", "Developers"],
    whyItExists:
      "Aformix created this guide because AI is most valuable when it makes the team sharper rather than more chaotic.",
  },
  {
    title: "WordPress Growth Guide",
    slug: "wordpress-guide",
    category: "WordPress",
    description:
      "A modern guide for improving WordPress performance, structure, and growth without sacrificing speed or simplicity.",
    image: "/images/resources/wordpress-guide.svg",
    pdf: "/downloads/wordpress-guide.pdf",
    pages: 14,
    readingTime: "7 min read",
    updatedAt: "July 2026",
    publishedAt: "2024-06-10",
    keywords: ["WordPress", "CMS", "performance", "plugins", "growth"],
    featured: false,
    relatedResources: ["website-audit", "technical-seo", "landing-page-checklist"],
    overview:
      "This guide gives WordPress owners a useful blueprint for improving speed, maintainability, and conversion readiness without overengineering the setup.",
    learnings: [
      "Theme Strategy",
      "Plugin Review",
      "Performance Tuning",
      "Content Structure",
      "Security Basics",
      "Growth Hooks",
    ],
    audience: ["Business owners", "Developers", "Agencies", "Freelancers"],
    whyItExists:
      "Aformix created this guide because many WordPress websites suffer from plugin overload and weak content architecture even when the design looks polished.",
  },
];

export function getAllResources() {
  return resources;
}

export function getResourceBySlug(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}

export function getRelatedResources(slug: string) {
  const resource = getResourceBySlug(slug);
  if (!resource) return [];
  return resources.filter((item) => resource.relatedResources?.includes(item.slug));
}

export function getFilteredResources(category?: string) {
  if (!category || category === "All") {
    return resources;
  }

  return resources.filter((resource) => resource.category === category);
}

export function getResourceCategories() {
  return [
    "All",
    "SEO",
    "Web Design",
    "Development",
    "UI/UX",
    "WordPress",
    "AI",
    "Marketing",
    "Performance",
    "Accessibility",
    "Business Growth",
  ];
}
