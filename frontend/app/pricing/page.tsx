import { generateSEO } from "@/lib/seo";
import Pricing from "@/components/Pricing";

export const metadata = generateSEO({
  title: "Website & App Pricing | Aformix",
  description:
    "Transparent pricing for websites, applications, and digital services.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <main className="pt-24">
      <Pricing />
    </main>
  );
}