import {
  BookOpen,
  FolderOpen,
  Download,
  RefreshCw,
} from "lucide-react";

interface ResourceStatsProps {
  totalResources: number;
  totalCategories: number;
}

export default function ResourceStats({
  totalResources,
  totalCategories,
}: ResourceStatsProps) {
  const stats = [
    {
      icon: BookOpen,
      label: "Resources",
      value: `${totalResources}+`,
    },
    {
      icon: FolderOpen,
      label: "Categories",
      value: totalCategories,
    },
    {
      icon: Download,
      label: "Free Downloads",
      value: "100%",
    },
    {
      icon: RefreshCw,
      label: "Updated",
      value: "Monthly",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Icon size={24} />
            </div>

            <h3 className="mt-6 text-3xl font-bold text-[var(--color-text)]">
              {stat.value}
            </h3>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {stat.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}