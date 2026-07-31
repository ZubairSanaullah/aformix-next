import { generateSEO } from "@/lib/seo";
import Contact from "@/components/Contact";

export const metadata = generateSEO({
  title: "Contact Aformix | Start Your Project Today",
  description:
    "Contact Aformix to discuss web development, mobile apps, UI/UX design, SEO, and WordPress solutions for your business.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="pt-24">
      <Contact />
    </main>
  );
}