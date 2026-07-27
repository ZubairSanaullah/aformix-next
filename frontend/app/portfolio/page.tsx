import { generateSEO } from "@/lib/seo";
import Portfolio from "@/components/Portfolio";

export const metadata = generateSEO({
  title: "Our Portfolio | Aformix",
  description:
    "Browse our portfolio of modern websites, applications, and UI/UX projects.",
  path: "/portfolio",
  keywords: [
    "Portfolio",
    "Projects",
    "Case Studies",
  ],
});

export default function PortfolioPage() {
  return (
    <main className="pt-24">
      <Portfolio />
    </main>
  );
}