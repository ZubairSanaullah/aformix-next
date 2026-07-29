export type ResourceCategory =
  | "SEO"
  | "Web Design"
  | "Development"
  | "UI/UX"
  | "WordPress"
  | "AI"
  | "Marketing"
  | "Performance"
  | "Accessibility"
  | "Business Growth";

export interface Resource {
  title: string;
  slug: string;
  category: ResourceCategory;
  description: string;
  image: string;
  pdf: string;
  pages: number;
  readingTime: string;
  updatedAt: string;
  publishedAt: string;
  keywords: string[];
  featured?: boolean;
  relatedResources?: string[];
  overview: string;
  learnings: string[];
  audience: string[];
  whyItExists: string;
  faqs?: Array<{ question: string; answer: string }>;
}
