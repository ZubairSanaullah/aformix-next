import type { Metadata } from "next";
import BlogClient from "@/components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Blog | Aformix",
  description:
    "Explore web development, UI/UX, SEO, AI, and digital product insights from Aformix.",
};

export default function BlogPage() {
  return <BlogClient />;
}