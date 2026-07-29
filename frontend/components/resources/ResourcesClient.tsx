"use client";

import { useMemo, useState } from "react";
import { getFilteredResources, getResourceCategories } from "@/lib/resources";
import type { Resource } from "@/types/resource";
import ResourceCard from "@/components/resources/ResourceCard";
import SearchBar from "@/components/resources/SearchBar";
import CategoryFilter from "@/components/resources/CategoryFilter";
import Hero from "@/components/resources/Hero";
import EmptyState from "@/components/resources/EmptyState";

export default function ResourcesClient() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const resources = useMemo(() => {
    const filtered = getFilteredResources(activeCategory);
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return filtered;
    }

    return filtered.filter((resource: Resource) => {
      const searchable = [resource.title, resource.category, resource.description, ...resource.keywords]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [query, activeCategory]);

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

        <section className="rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.16)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-[var(--color-text)]">Browse premium downloads</h2>
              <p className="mt-2 text-[var(--color-text-muted)]">Search instantly by topic, category, or keyword.</p>
            </div>
            <div className="w-full lg:max-w-xl">
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </div>

          <div className="mt-8">
            <CategoryFilter categories={getResourceCategories()} activeCategory={activeCategory} onChange={setActiveCategory} />
          </div>
        </section>

        {resources.length ? (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </section>
        ) : (
          <EmptyState title="No resources matched your search" description="Try another keyword or filter to discover more useful guides." />
        )}
      </div>
    </div>
  );
}
