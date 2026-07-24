import About from "@/components/About";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "About Us",
  description:
    "Learn about Aformix, our mission, expertise, and commitment to building modern websites and digital experiences.",
  path: "/about",
  keywords: [
    "Aformix",
    "About",
    "Web Development",
    "Agency",
  ],
});

export default function AboutPage() {
  return (
    <main className="pt-24">
      <About />
    </main>
  );
}