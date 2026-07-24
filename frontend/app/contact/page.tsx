import { generateSEO } from "@/lib/seo";
import Contact from "@/components/Contact";

export const metadata = generateSEO({
  title: "Contact",
  description:
    "Get in touch with Aformix to discuss your next project.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="pt-24">
      <Contact />
    </main>
  );
}