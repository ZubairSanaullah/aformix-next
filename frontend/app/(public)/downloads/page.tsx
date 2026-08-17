import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { getAllResources } from "@/lib/resources";

export const metadata: Metadata = generateSEO({
  title: "Downloads | Aformix",
  description: "Download premium Aformix resources, guides, and checklists for SEO, design, AI, and growth.",
  path: "/downloads",
});

export default function DownloadsPage() {
  const resources = getAllResources();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
        <section className="rounded-2xl border border-[var(--color-glass-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-surface-elevated))] p-5 sm:rounded-[2.5rem] sm:p-8 lg:rounded-[3rem] lg:p-12 shadow-[0_20px_70px_rgba(0,0,0,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)] sm:text-sm sm:tracking-[0.3em]">
            Downloads
          </p>
          <h1 className="mt-3 text-2xl font-bold text-[var(--color-text)] sm:mt-4 sm:text-4xl lg:text-5xl">
            Download the resources your team needs
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:mt-5 sm:text-lg">
            Every asset is optimized for sharing across Instagram, LinkedIn, email campaigns, ManyChat, and WhatsApp.
          </p>
        </section>

        <section className="mt-8 sm:mt-10 grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <article
              key={resource.slug}
              className="flex flex-col rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 p-5 sm:rounded-[2rem] sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] sm:px-3 sm:text-xs">
                  {resource.category}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] sm:text-sm">
                  {resource.pages} pages
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold text-[var(--color-text)] sm:mt-4 sm:text-xl">
                {resource.title}
              </h2>

              <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-3 sm:text-sm sm:leading-7">
                {resource.description}
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3 border-t border-[var(--color-glass-border)]/50 pt-4 sm:border-0 sm:pt-0">
                <a
                  href={resource.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--color-primary)]/90 shadow-md text-center"
                >
                  Download PDF
                </a>
                <Link
                  href={`/resources/${resource.slug}`}
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-glass-border)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-center"
                >
                  View Resource
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
