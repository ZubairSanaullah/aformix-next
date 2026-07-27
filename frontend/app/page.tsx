import { generateSEO } from "@/lib/seo";
import HomeContent from "@/components/HomeContent";

export const metadata = generateSEO({
  title: "Modern Web & App Development Agency",
  description:
    "Aformix helps startups and businesses build high-performance websites, web applications, mobile apps, UI/UX designs, landing pages, WordPress websites, and SEO solutions.",
  path: "/",
});

export default function HomePage() {
  return <HomeContent />;
}