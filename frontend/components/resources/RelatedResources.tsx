import type { Resource } from "@/types/resource";
import SectionHeading from "@/components/ui/SectionHeading";
import ResourceMiniCard from "@/components/resources/ResourceMiniCard";

interface RelatedResourcesProps {
  resources: Resource[];
}

export default function RelatedResources({ resources }: RelatedResourcesProps) {
  if (!resources.length) return null;

  return (
    <section className="mt-16">
      <div className="mb-8">
        <SectionHeading
          title="Explore more resources"
          description="Related guides and resources you may find useful."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <ResourceMiniCard
            key={resource.slug}
            resource={resource}
          />
        ))}
      </div>
    </section>
  );
}
