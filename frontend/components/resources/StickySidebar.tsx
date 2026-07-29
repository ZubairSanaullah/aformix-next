import DownloadButton from "@/components/resources/DownloadButton";
import ShareButtons from "@/components/resources/ShareButtons";
import type { Resource } from "@/types/resource";

interface StickySidebarProps {
  resource: Resource;
  url: string;
}

export default function StickySidebar({ resource, url }: StickySidebarProps) {
  return (
    <aside className="sticky top-24 rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/90 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">Download</p>
      <div className="mt-4 flex flex-col gap-4">
        <DownloadButton href={resource.pdf} />
        <div className="rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)]/60 p-4 text-sm text-[var(--color-text-muted)]">
          <div className="flex items-center justify-between">
            <span>Pages</span>
            <span className="font-semibold text-[var(--color-text)]">{resource.pages}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span>Category</span>
            <span className="font-semibold text-[var(--color-text)]">{resource.category}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span>Updated</span>
            <span className="font-semibold text-[var(--color-text)]">{resource.updatedAt}</span>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-[var(--color-text)]">Share</p>
          <ShareButtons title={resource.title} url={url} />
        </div>
      </div>
    </aside>
  );
}
