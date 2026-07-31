import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Briefcase,
  Users,
  CheckSquare,
  CalendarDays,
  Search,
  Wallet,
  FolderOpen,
  BookOpen,
  BarChart3,
  Settings,
} from "lucide-react";

export const workspaceNavigation = [
  {
    title: "Dashboard",
    href: "/workspace",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/workspace/projects",
    icon: FolderKanban,
  },
  {
    title: "Blog CMS",
    href: "/workspace/blog",
    icon: FileText,
  },
  {
    title: "Portfolio",
    href: "/workspace/portfolio",
    icon: Briefcase,
  },
  {
    title: "CRM",
    href: "/workspace/crm",
    icon: Users,
  },
  {
    title: "Tasks",
    href: "/workspace/tasks",
    icon: CheckSquare,
  },
  {
    title: "Scheduler",
    href: "/workspace/scheduler",
    icon: CalendarDays,
  },
  {
    title: "SEO",
    href: "/workspace/seo",
    icon: Search,
  },
  {
    title: "Finance",
    href: "/workspace/finance",
    icon: Wallet,
  },
  {
    title: "Assets",
    href: "/workspace/assets",
    icon: FolderOpen,
  },
  {
    title: "Knowledge Base",
    href: "/workspace/knowledge",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    href: "/workspace/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/workspace/settings",
    icon: Settings,
  },
];