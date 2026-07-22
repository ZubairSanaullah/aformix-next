import type { MetadataRoute } from "next";

const baseUrl = "https://www.aformix.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    // Future pages
    // "/about-us",
    // "/services",
    // "/blog",
    // "/privacy-policy",
    // "/terms-of-service",
    // "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}