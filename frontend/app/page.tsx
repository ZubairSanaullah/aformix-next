import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  title: "Modern Web & App Development Agency",
  description:
    "Aformix helps startups and businesses build high-performance websites, web applications, mobile apps, UI/UX designs, landing pages, WordPress websites, and SEO solutions.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aformix | Modern Web & App Development Agency",
    description:
      "Premium web development, mobile app development, UI/UX design, SEO, and WordPress solutions.",
    url: "https://www.aformix.com",
  },
};

export default function HomePage() {
  return <HomeContent />;
}