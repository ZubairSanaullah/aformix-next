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
    <section className="rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-5 sm:rounded-[2.5rem] sm:p-8 lg:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.14)]">
      <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-primary)] sm:px-4 sm:py-2 sm:text-sm">
            <Sparkles size={15} />
            Featured Resources
          </div>

          <h2 className="mt-4 text-2xl font-bold text-[var(--color-text)] sm:mt-5 sm:text-3xl">
            Start with our most popular guides
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)] sm:mt-3 sm:text-base max-w-2xl">
            Hand-picked frameworks, checklists, and prompt packs designed to
            help businesses improve SEO, websites, and digital growth.
          </p>
        </div>

        <Link
          href="#all-resources"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] transition-all hover:gap-3 sm:text-base"
        >
          Browse all resources
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
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