import DownloadButton from "@/components/resources/DownloadButton";
import ShareButtons from "@/components/resources/ShareButtons";
import type { Resource } from "@/types/resource";
import GlassCard from "@/components/ui/GlassCard";
import StatRow from "@/components/ui/StatRow";

interface StickySidebarProps {
  resource: Resource;
  url: string;
}

export default function StickySidebar({ resource, url }: StickySidebarProps) {
  return (
    <aside className="sticky top-24">
      <GlassCard className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">Download</p>
        <div className="mt-4 flex flex-col gap-4">
          <DownloadButton href={resource.pdf} />
          <div className="rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)]/60 p-4">
            <StatRow
              label="Pages"
              value={resource.pages}
            />

            <StatRow
              className="mt-3"
              label="Category"
              value={resource.category}
            />

            <StatRow
              className="mt-3"
              label="Updated"
              value={resource.updatedAt}
            />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--color-text)]">Share</p>
            <ShareButtons title={resource.title} url={url} />
          </div>
        </div>
      </GlassCard>
    </aside>
  );
}
