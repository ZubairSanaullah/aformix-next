import { generateSEO } from "@/lib/seo";
import BlogClient from "@/components/blog/BlogClient";

export const metadata = generateSEO({
  title: "Blog | Aformix",
  description:
    "Explore web development, UI/UX, SEO, AI, and digital product insights from Aformix.",
  path: "/blog",
  keywords: [
    "Blog",
    "Web Development",
    "UI UX",
    "SEO",
    "AI",
  ],
});

export default function BlogPage() {
  return <BlogClient />;
}