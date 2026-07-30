export interface ResourceFAQ {
  question: string;
  answer: string;
}

export type ResourceType =
  | "Guide"
  | "Checklist"
  | "Template"
  | "Case Study"
  | "Toolkit"
  | "Prompt Pack";

export type ResourceLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export interface Resource {
  title: string;
  slug: string;

  category: string;
  type: ResourceType;
  level: ResourceLevel;

  description: string;
  overview: string;
  whyItExists: string;

  coverImage: string;
  socialImage?: string;

  previewImage: string;

  pdf: string;

  pages: number;
  fileSize: string;
  readingTime: number;

  publishedAt: string;
  updatedAt: string;
  version: string;

  featured: boolean;

  keywords: string[];

  audience: string[];

  learnings: string[];

  relatedResources: string[];

  faqs?: ResourceFAQ[];
}