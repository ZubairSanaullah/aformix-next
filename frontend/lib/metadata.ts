import type { Metadata } from "next";
import type { Resource } from "@/types/resource";

const SITE_NAME = "Aformix";
const SITE_URL = "https://www.aformix.com";

export function generateResourceMetadata(
  resource: Resource
): Metadata {
  const url = `${SITE_URL}/resources/${resource.slug}`;

  const title = `${resource.title} | ${SITE_NAME}`;

  return {
    title,

    description: resource.description,

    keywords: resource.keywords,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description: resource.description,
      url,
      siteName: SITE_NAME,
      type: "article",

      images: [
        {
          url: resource.socialImage ?? resource.coverImage,
          width: 1200,
          height: 630,
          alt: resource.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description: resource.description,
      images: [resource.socialImage ?? resource.coverImage],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}