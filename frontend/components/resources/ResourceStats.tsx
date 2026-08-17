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
    <section className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-4 sm:rounded-[2rem] sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] sm:h-12 sm:w-12 sm:rounded-2xl">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <h3 className="mt-3 text-2xl font-bold text-[var(--color-text)] sm:mt-6 sm:text-3xl">
              {stat.value}
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)] sm:mt-2 sm:text-sm">
              {stat.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}