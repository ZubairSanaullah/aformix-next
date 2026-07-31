import { generateSEO } from "@/lib/seo";
import PrivacyPolicyPage from "./PrivacyPolicy";

export const metadata = generateSEO({
  title: "Privacy Policy | Aformix",
  description:
    "Learn how Aformix collects, uses, and protects your personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyRoutePage() {
  return <PrivacyPolicyPage />;
}