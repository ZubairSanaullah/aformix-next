"use client";

import { Download, FileText, Clock, HardDrive, BadgeInfo } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
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

  const handleDownload = () => {
    trackEvent("resource_download", {
      resource_title: resource.title,
      resource_slug: resource.slug,
      category: resource.category,
      file_size: resource.fileSize,
      file_type: "pdf",
    });
  };

  return (
    <GlassCard className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem]">
      <CardHeader
        icon={<FileText className="h-5 w-5 sm:h-7 sm:w-7" />}
        title="Download this resource"
        description="Get instant access to the PDF and keep it for offline reading, sharing with your team, or future reference."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
        <InfoItem
          icon={<FileText className="h-4 w-4 sm:h-5 sm:w-5" />}
          label="Pages"
          value={`${resource.pages} Pages`}
        />

        <InfoItem
          icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
          label="Reading Time"
          value={`${resource.readingTime} min`}
        />

        <InfoItem
          icon={<HardDrive className="h-4 w-4 sm:h-5 sm:w-5" />}
          label="File Size"
          value={resource.fileSize}
        />

        <InfoItem
          icon={<BadgeInfo className="h-4 w-4 sm:h-5 sm:w-5" />}
          label="Version"
          value={resource.version}
        />
      </div>

      <div className="mt-6 border-t border-[var(--color-glass-border)] pt-6 sm:mt-8 sm:pt-8">
        <DownloadButton
          href={resource.pdf}
          className="w-full justify-center"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5" />
          Download PDF
        </DownloadButton>
      </div>
    </GlassCard>
  );
}