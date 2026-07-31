import { generateSEO } from "@/lib/seo";
import TermsOfServicePage from "./TermsOfService";

export const metadata = generateSEO({
  title: "Terms of Service | Aformix",
  description:
    "Read the terms governing Aformix web development, UI/UX, SEO, and digital services.",
  path: "/terms-of-service",
});

export default function TermsOfServiceRoutePage() {
  return <TermsOfServicePage />;
}