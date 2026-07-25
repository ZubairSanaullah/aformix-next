import type { Metadata } from "next";
import TermsOfService from "./TermsOfService";

export const metadata: Metadata = {
  title: "Terms of Service | Aformix",
  description:
    "Read the terms governing Aformix web development, UI/UX, SEO and digital services.",
};

export default function Page() {
  return <TermsOfService />;
}