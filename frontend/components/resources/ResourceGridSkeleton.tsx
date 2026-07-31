import ResourceCardSkeleton from "./ResourceCardSkeleton";

export default function ResourceGridSkeleton() {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <ResourceCardSkeleton key={index} />
      ))}
    </section>
  );
}