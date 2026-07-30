import ResourceGridSkeleton from "@/components/resources/ResourceGridSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <ResourceGridSkeleton />
      </div>
    </div>
  );
}