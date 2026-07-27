import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { servicesData } from "@/constants/servicesData";

import { generateSEO } from "@/lib/seo";

import ServiceHero from "@/components/services/ServiceHero";
import ProblemSection from "@/components/services/ProblemSection";
import SolutionSection from "@/components/services/SolutionSection";
import FeatureGrid from "@/components/services/FeatureGrid";
import BenefitsSection from "@/components/services/BenefitsSection";
import TechnologyStack from "@/components/services/TechnologyStack";
import ProcessTimeline from "@/components/services/ProcessTimeline";
import CaseStudies from "@/components/services/CaseStudies";
import ServiceTestimonials from "@/components/services/ServiceTestimonials";
import ServicePricing from "@/components/services/ServicePricing";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceCTA from "@/components/services/ServiceCTA";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  return generateSEO({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${slug}`,
    keywords: service.seo.keywords
      ? service.seo.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean)
      : [],
  });
}

export default async function ServicePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

    return (
    <>
        <ServiceHero
        badge={service.badge}
        headline={service.heroHeadline}
        valueProposition={service.valueProposition}
        description={service.heroDescription}
        heroVariant={service.heroVariant}
        />

        <ProblemSection problems={service.problems} />

        <SolutionSection solution={service.solution} />

        <FeatureGrid features={service.features} />

        <BenefitsSection benefits={service.benefits} />

        <ProcessTimeline process={service.process} />

        <TechnologyStack techStack={service.techStack} />

        <CaseStudies caseStudies={service.caseStudies} />

        <ServiceTestimonials testimonials={service.testimonials} />

        <ServicePricing pricingPlans={service.pricingPlans} />

        <ServiceFAQ faqs={service.faqs} />

        <ServiceCTA description={service.ctaDescription} />
    </>
    );
}

