"use client";

import { Download, FileText, Clock, HardDrive, BadgeInfo } from "lucide-react";
import DownloadButton from "./DownloadButton";
import type { Resource } from "@/types/resource";
import InfoItem from "@/components/ui/InfoItem";
import GlassCard from "@/components/ui/GlassCard";
import CardHeader from "@/components/ui/CardHeader";

interface DownloadCardProps {
  resource: Resource;
}

export default function DownloadCard({
  resource,
}: DownloadCardProps) {
  return (
    <GlassCard className="p-8">
      <CardHeader
        icon={<FileText className="h-7 w-7" />}
        title="Download this resource"
        description="Get instant access to the PDF and keep it for offline reading, sharing with your team, or future reference."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">

        <InfoItem
          icon={<FileText size={18} />}
          label="Pages"
          value={`${resource.pages} Pages`}
        />

        <InfoItem
          icon={<Clock size={18} />}
          label="Reading Time"
          value={`${resource.readingTime} min`}
        />

        <InfoItem
          icon={<HardDrive size={18} />}
          label="File Size"
          value={resource.fileSize}
        />

        <InfoItem
          icon={<BadgeInfo size={18} />}
          label="Version"
          value={resource.version}
        />

      </div>

      <div className="mt-10 border-t border-[var(--color-glass-border)] pt-8">
        <DownloadButton
          href={resource.pdf}
          className="w-full justify-center"
        >
          <Download className="h-5 w-5" />
          Download PDF
        </DownloadButton>
      </div>
    </GlassCard>
  );
}