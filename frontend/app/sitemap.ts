import type { MetadataRoute } from "next";
import { getAllResources } from "@/lib/resources";

const baseUrl = "https://www.aformix.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const resources = getAllResources();
  const routes = ["", "/resources", ...resources.map((resource) => `/resources/${resource.slug}`)];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified:
      route.startsWith("/resources/")
        ? resources.find(
          (resource) => `/resources/${resource.slug}` === route
        )?.updatedAt
        : new Date(),
    changeFrequency: route === "" ? "weekly" : route === "/resources" ? "monthly" : "monthly",
    priority: route === "" ? 1 : route === "/resources" ? 0.9 : 0.8,
  }));
}