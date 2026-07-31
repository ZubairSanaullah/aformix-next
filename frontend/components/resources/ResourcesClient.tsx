"use client";

import { useMemo, useState } from "react";
import type { Resource } from "@/types/resource";
import ResourceCard from "@/components/resources/ResourceCard";
import SearchBar from "@/components/resources/SearchBar";
import CategoryFilter from "@/components/resources/CategoryFilter";
import Hero from "@/components/resources/Hero";
import EmptyState from "@/components/resources/EmptyState";
import ResourceStats from "@/components/resources/ResourceStats";
import {
  getFilteredResources,
  getResourceCategories,
  getFeaturedResources,
} from "@/lib/resources";
import FeaturedResources from "@/components/resources/FeaturedResources";
import SortDropdown from "@/components/resources/SortDropdown";
import ActiveFilters from "@/components/resources/ActiveFilters";

export default function ResourcesClient() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const resources = useMemo(() => {
    const filtered = getFilteredResources(activeCategory);

    const normalizedQuery = query.trim().toLowerCase();

    const searched = !normalizedQuery
      ? filtered
      : filtered.filter((resource) => {
        const searchable = [
          resource.title,
          resource.category,
          resource.description,
          resource.type,
          resource.level,
          ...resource.keywords,
          ...resource.audience,
          ...resource.learnings,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      });

    return [...searched].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);

        case "oldest":
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );

        case "pages":
          return b.pages - a.pages;

        case "readingTime":
          return b.readingTime - a.readingTime;

        case "newest":
        default:
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
      }
    });
  }, [query, activeCategory, sortBy]);

  const allResources = useMemo(
    () => getFilteredResources("All"),
    []
  );

  const totalResources = allResources.length;

  const totalCategories = new Set(
    allResources.map((resource) => resource.category)
  ).size;

  const featuredResources = useMemo(
    () => getFeaturedResources(),
    []
  );

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("All");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-24 pt-36 sm:px-6 lg:px-8">

        <Hero
          eyebrow="Free resources"
          title="Free Resources"
          subtitle="Guides, checklists, templates, prompt packs, and frameworks designed to help businesses grow faster."
          ctaHref="/contact"
          ctaLabel="Book a consultation"
        />

        <ResourceStats totalResources={totalResources} totalCategories={totalCategories} />

        <FeaturedResources resources={featuredResources} />

        <section className="rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.16)] sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-[var(--color-text)]">Browse premium downloads</h2>
              <p className="mt-2 text-[var(--color-text-muted)]">Search instantly by topic, category, or keyword.</p>

              <p className="mt-3 text-sm font-medium text-[var(--color-primary)]">
                Showing {resources.length} of {totalResources} resources
              </p>

            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <SearchBar
                value={query}
                onChange={setQuery}
              />

              <SortDropdown
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>
          <ActiveFilters
            query={query}
            category={activeCategory}
            sort={sortBy}
            onClearQuery={() => setQuery("")}
            onClearCategory={() => setActiveCategory("All")}
            onReset={resetFilters}
          />

          <div className="mt-8">
            <CategoryFilter categories={getResourceCategories()} activeCategory={activeCategory} onChange={setActiveCategory} />
          </div>
        </section>

        {resources.length ? (
          <section
            id="all-resources"
            aria-labelledby="all-resources-heading"
          >
            <h2
              id="all-resources-heading"
              className="sr-only"
            >
              All Resources
            </h2>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.slug}
                  resource={resource}
                />
              ))}
            </div>
          </section>
        ) : (
          <EmptyState title="No resources matched your search" description="Try another keyword or filter to discover more useful guides." />
        )}
      </div>
    </div>
  );
}
