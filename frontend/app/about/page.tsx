import About from "@/components/About";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "About Aformix | Our Story & Mission",
  description:
    "Learn about Aformix, our mission, expertise, and commitment to building modern websites and digital experiences.",
  path: "/about",
  keywords: [
    "About Aformix",
    "Web Development Company",
    "Digital Agency",
  ],
});

export default function AboutPage() {
  return (
    <main className="pt-24">
      <About />
    </main>
  );
}