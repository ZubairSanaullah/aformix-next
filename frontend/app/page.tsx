import { generateSEO } from "@/lib/seo";
import HomeContent from "@/components/HomeContent";

export const metadata = generateSEO({
  title: "Modern Web & App Development Agency",
  description:
    "Aformix builds high-performance websites, mobile apps, UI/UX designs, WordPress websites, landing pages, and SEO solutions for modern businesses.",
  path: "/",
});

export default function HomePage() {
  return <HomeContent />;
}