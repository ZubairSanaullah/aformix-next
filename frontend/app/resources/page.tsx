import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import ResourcesClient from "@/components/resources/ResourcesClient";

export const metadata: Metadata = generateSEO({
  title: "Free Resources | Aformix",
  description:
    "Explore premium SEO, UX, web design, and AI resources that help teams grow faster with practical guides and downloadable PDFs.",
  path: "/resources",
  keywords: ["resources", "downloadable guides", "SEO resources", "marketing templates"],
});

export default function ResourcesPage() {
  return <ResourcesClient />;
}
