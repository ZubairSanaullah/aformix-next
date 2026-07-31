import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import type { Resource } from "@/types/resource";
import ResourceCard from "./ResourceCard";

interface FeaturedResourcesProps {
  resources: Resource[];
}

export default function FeaturedResources({
  resources,
}: FeaturedResourcesProps) {
  if (!resources.length) return null;

  return (
    <section className="rounded-[2.5rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.14)] lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--color-primary)]">
            <Sparkles size={16} />
            Featured Resources
          </div>

          <h2 className="mt-5 text-3xl font-bold text-[var(--color-text)]">
            Start with our most popular guides
          </h2>

          <p className="mt-3 max-w-2xl text-[var(--color-text-muted)]">
            Hand-picked frameworks, checklists, and prompt packs designed to
            help businesses improve SEO, websites, and digital growth.
          </p>
        </div>

        <Link
          href="#all-resources"
          className="inline-flex items-center gap-2 font-medium text-[var(--color-primary)] transition-all hover:gap-3"
        >
          Browse all resources
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.slug}
            resource={resource}
          />
        ))}
      </div>
    </section>
  );
}