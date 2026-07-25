import type { Metadata } from "next";
import PrivacyPolicy from "./PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Aformix",
  description:
    "Learn how Aformix collects, uses and protects your personal information.",
};

export default function Page() {
  return <PrivacyPolicy />;
}