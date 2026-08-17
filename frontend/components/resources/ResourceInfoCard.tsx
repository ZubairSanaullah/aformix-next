import { BookOpen, CalendarDays, Clock3, FileText, FolderOpen, Sparkles, Tag } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import InfoItem from "@/components/ui/InfoItem";

import type { Resource } from "@/types/resource";
import { formatDate } from "@/utils/format-date";

interface ResourceInfoCardProps {
  resource: Resource;
}

export default function ResourceInfoCard({
  resource,
}: ResourceInfoCardProps) {
  const items = [
    {
      id: "type",
      icon: <Tag className="h-5 w-5" />,
      label: "Type",
      value: resource.type,
    },
    {
      id: "level",
      icon: <Sparkles className="h-5 w-5" />,
      label: "Level",
      value: resource.level,
    },
    {
      id: "pages",
      icon: <FileText className="h-5 w-5" />,
      label: "Pages",
      value: `${resource.pages} Pages`,
    },
    {
      id: "reading-time",
      icon: <Clock3 className="h-5 w-5" />,
      label: "Reading Time",
      value: `${resource.readingTime} min`,
    },
    {
      id: "file-size",
      icon: <FolderOpen className="h-5 w-5" />,
      label: "File Size",
      value: resource.fileSize,
    },
    {
      id: "version",
      icon: <BookOpen className="h-5 w-5" />,
      label: "Version",
      value: resource.version,
    },
    {
      id: "updated",
      icon: <CalendarDays className="h-5 w-5" />,
      label: "Updated",
      value: formatDate(resource.updatedAt),
    },
  ];

  return (
    <GlassCard className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem]">
      <SectionHeading
        title="Resource Details"
        description="Everything you need to know about this resource at a glance."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5">
        {items.map((item) => (
          <InfoItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </GlassCard>
  );
}