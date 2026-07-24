import { generateSEO } from "@/lib/seo";
import Services from "@/components/Services";

export const metadata = generateSEO({
  title: "Services",
  description:
    "Explore professional web development, UI/UX design, SEO, WordPress, and app development services.",
  path: "/services",
  keywords: [
    "Web Development",
    "SEO",
    "WordPress",
    "UI UX",
  ],
});

export default function ServicesPage() {
  return (
    <main className="pt-24">
      <Services />
    </main>
  );
}