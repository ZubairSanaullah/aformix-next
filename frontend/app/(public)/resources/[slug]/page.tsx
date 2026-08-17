import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import ResourceAnalytics from "@/components/resources/ResourceAnalytics";
import { getResourceBySlug, getRelatedResources } from "@/lib/resources";
import { generateSEO } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import DownloadButton from "@/components/resources/DownloadButton";
import ShareButtons from "@/components/resources/ShareButtons";
import StickySidebar from "@/components/resources/StickySidebar";
import RelatedResources from "@/components/resources/RelatedResources";
import ResourceInfoCard from "@/components/resources/ResourceInfoCard";
import PDFPreview from "@/components/resources/PDFPreview";
import DownloadCard from "@/components/resources/DownloadCard";
import ReadingProgress from "@/components/resources/ReadingProgress";
import SectionReveal from "@/components/resources/SectionReveal";
import GlassCard from "@/components/ui/GlassCard";
import AnalyticsLink from "@/components/analytics/AnalyticsLink";
import MobileResourceBottomBar from "@/components/resources/MobileResourceBottomBar";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return generateSEO({
      title: "Resource Not Found | Aformix",
      description: "The requested resource could not be found.",
      path: "/resources",
    });
  }

  return generateSEO({
    title: `${resource.title} | Aformix Resources`,
    description: resource.description,
    path: `/resources/${resource.slug}`,
    keywords: resource.keywords,
  });
}

export async function generateStaticParams() {
  return [
    { slug: "seo-framework" },
    { slug: "chatgpt-prompts" },
    { slug: "landing-page-checklist" },
    { slug: "website-audit" },
    { slug: "ux-checklist" },
    { slug: "local-seo" },
    { slug: "technical-seo" },
    { slug: "ai-productivity" },
    { slug: "wordpress-guide" },
  ];
}

export default async function ResourcePage({ params }: Params) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const relatedResources = getRelatedResources(slug);
  const canonicalUrl = `https://www.aformix.com/resources/${resource.slug}`;

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      url: "https://www.aformix.com",
    },
    {
      label: "Resources",
      href: "/resources",
      url: "https://www.aformix.com/resources",
    },
    {
      label: resource.title,
      url: canonicalUrl,
    },
  ];

  return (
    <>
      <ResourceAnalytics
        title={resource.title}
        slug={resource.slug}
        category={resource.category}
      />

      <ReadingProgress />
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-16 lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: resource.title,
              description: resource.description,
              image: `https://www.aformix.com${resource.coverImage}`,
              author: {
                "@type": "Organization",
                name: "Aformix",
                url: "https://www.aformix.com",
              },
              publisher: {
                "@type": "Organization",
                name: "Aformix",
                url: "https://www.aformix.com",
              },
              datePublished: resource.publishedAt,
              dateModified: resource.updatedAt,
              mainEntityOfPage: canonicalUrl,
              keywords: resource.keywords.join(", "),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.label,
                item: item.url,
              })),
            }),
          }}
        />

        {resource.faqs?.length ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: resource.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
        ) : null}

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="mt-6 sm:mt-8 grid gap-8 lg:grid-cols-[1.8fr_0.75fr]">
            <div className="min-w-0">
              <section className="overflow-hidden rounded-2xl border border-[var(--color-glass-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-surface-elevated))] shadow-[0_20px_80px_rgba(0,0,0,0.16)] sm:rounded-[2.5rem]">
                {/* Hero Cover Banner with Adaptive Height */}
                <div className="relative min-h-[340px] sm:min-h-[400px] md:min-h-[440px] lg:aspect-[16/9] overflow-hidden flex flex-col justify-end">
                  <Image
                    src={resource.coverImage}
                    alt={resource.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/20" />
                  <div className="relative z-10 p-5 sm:p-8 lg:p-10">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="rounded-full border border-white/30 bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur shadow-md sm:px-3 sm:text-xs sm:tracking-[0.3em]">
                        {resource.category}
                      </span>
                      <span className="rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-md sm:px-3 sm:text-xs sm:tracking-[0.3em]">
                        Free PDF
                      </span>
                    </div>
                    <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-white sm:mt-4 sm:text-4xl lg:text-5xl">
                      {resource.title}
                    </h1>
                    <p className="mt-2 max-w-2xl text-xs sm:text-base lg:text-lg leading-relaxed text-slate-200 sm:mt-3 sm:leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-8 lg:p-12">
                  {/* Quick Mobile Download Bar */}
                  <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)]/80 p-4 lg:hidden shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Quick Download</span>
                      <span className="font-bold text-[var(--color-primary)]">Free {resource.fileSize} PDF</span>
                    </div>
                    <DownloadButton href={resource.pdf} label="Download Free PDF" />
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)] sm:gap-4 sm:text-sm">
                    <span>{resource.readingTime} min read</span>
                    <span>•</span>
                    <span>{resource.pages} pages</span>
                    <span>•</span>
                    <span>Updated {resource.updatedAt}</span>
                  </div>

                  {/* Share Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                    <ShareButtons title={resource.title} url={canonicalUrl} />
                  </div>

                  {/* Content Sections */}
                  <div className="mt-8 sm:mt-12 grid gap-0">
                    <SectionReveal delay={0}>
                      <GlassCard className="mb-6 sm:mb-8 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem]">
                        <h2 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                          Overview
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)] sm:mt-4 sm:text-lg sm:leading-8">
                          {resource.overview}
                        </p>
                      </GlassCard>
                    </SectionReveal>

                    <SectionReveal delay={100}>
                      <ResourceInfoCard resource={resource} />
                    </SectionReveal>

                    <SectionReveal delay={200}>
                      <GlassCard className="mt-6 sm:mt-8 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem]">
                        <h3 className="text-base font-bold text-[var(--color-text)] sm:text-lg">
                          Who this is for
                        </h3>

                        <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-4 sm:space-y-3 sm:text-sm sm:leading-6">
                          {resource.audience.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    </SectionReveal>
                  </div>

                  <SectionReveal delay={300}>
                    <PDFPreview resource={resource} />
                  </SectionReveal>

                  {/* What you'll learn */}
                  <section className="mt-8 sm:mt-12 rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-5 sm:rounded-[2rem] sm:p-8">
                    <h2 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                      What you’ll learn
                    </h2>
                    <ul className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2">
                      {resource.learnings.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)]/70 p-3 text-xs leading-relaxed text-[var(--color-text-muted)] sm:rounded-2xl sm:p-4 sm:text-sm"
                        >
                          <span className="mt-0.5 text-[var(--color-primary)] font-bold">✔</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Why this resource exists + Download Card */}
                  <section className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 lg:grid-cols-2">
                    <GlassCard className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem]">
                      <h2 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                        Why this resource exists
                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)] sm:mt-4 sm:text-lg sm:leading-8">
                        {resource.whyItExists}
                      </p>
                    </GlassCard>

                    <DownloadCard resource={resource} />
                  </section>

                  {/* FAQs */}
                  {resource.faqs?.length ? (
                    <section className="mt-8 sm:mt-12 rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-5 sm:rounded-[2rem] sm:p-8">
                      <h2 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                        Frequently asked questions
                      </h2>
                      <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                        {resource.faqs.map((item) => (
                          <div
                            key={item.question}
                            className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)]/70 p-3.5 sm:rounded-2xl sm:p-4"
                          >
                            <h3 className="text-sm font-semibold text-[var(--color-text)] sm:text-base">
                              {item.question}
                            </h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-2 sm:text-sm">
                              {item.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  <RelatedResources resources={relatedResources} />

                  {/* Bottom Consultation CTA */}
                  <section className="mt-12 rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-6 sm:mt-16 sm:rounded-[2.5rem] sm:p-10 text-center shadow-lg">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)] sm:text-sm sm:tracking-[0.36em]">
                      Need help implementing this?
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-[var(--color-text)] sm:mt-4 sm:text-3xl">
                      Let’s turn this resource into a real growth plan.
                    </h2>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:mt-8 sm:gap-4">
                      <AnalyticsLink
                        href="https://calendly.com/aformixtech/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] shadow-md"
                        eventName="consultation_click"
                        eventParams={{
                          location: "resource_page",
                          resource_title: resource.title,
                          resource_slug: resource.slug,
                        }}
                      >
                        Book Consultation
                      </AnalyticsLink>
                      <Link
                        href="/services"
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-[var(--color-glass-border)] px-6 py-3 text-sm sm:text-base font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                      >
                        Explore Services
                      </Link>
                    </div>
                  </section>
                </div>
              </section>
            </div>

            <div className="hidden lg:block">
              <StickySidebar resource={resource} url={canonicalUrl} />
            </div>
          </div>
        </div>

        {/* Mobile Floating Bottom Action Bar */}
        <MobileResourceBottomBar resource={resource} url={canonicalUrl} />
      </div>
    </>
  );
}
