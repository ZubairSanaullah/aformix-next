import type { Metadata } from "next";
import { DEFAULT_KEYWORDS } from "@/constants/seo";

const SITE_NAME = "Aformix";
const SITE_URL = "https://aformix.com";

const DEFAULT_OG_IMAGE = "/og-image.png";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}

export function generateSEO({
  title,
  description,
  path = "",
  keywords = [],
}: SEOProps): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,

    keywords: [...DEFAULT_KEYWORDS, ...keywords],

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}