"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { workspaceNavigation } from "@/constants/workspace-navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-[var(--color-glass-border)] bg-[var(--color-card)]">
      <div className="border-b border-[var(--color-glass-border)] p-6">
        <h2 className="text-2xl font-bold">
          Aformix
        </h2>

        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Workspace
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {workspaceNavigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/workspace" &&
                pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white"
                      : "hover:bg-[var(--color-primary)]/10"
                  }`}
                >
                  <Icon size={20} />

                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}