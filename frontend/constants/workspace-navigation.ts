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
  FolderTree,
  Tags,
  Trash2
} from "lucide-react";

export const workspaceNavigation = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/workspace",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        title: "Projects",
        href: "/workspace/projects",
        icon: FolderKanban,
      },
      {
        title: "Tasks",
        href: "/workspace/tasks",
        icon: CheckSquare,
      },
      {
        title: "CRM",
        href: "/workspace/crm",
        icon: Users,
      },
      {
        title: "Scheduler",
        href: "/workspace/scheduler",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Blog CMS",
        href: "/workspace/blog",
        icon: FileText,
      },
      {
        title: "Categories",
        href: "/workspace/categories",
        icon: FolderTree,
      },
      {
        title: "Tags",
        href: "/workspace/tags",
        icon: Tags,
      },
      {
        title: "Trash",
        href: "/workspace/blog/trash",
        icon: Trash2,
      },
      {
        title: "Portfolio",
        href: "/workspace/portfolio",
        icon: Briefcase,
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
        title: "SEO",
        href: "/workspace/seo",
        icon: Search,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        title: "Analytics",
        href: "/workspace/analytics",
        icon: BarChart3,
      },
      {
        title: "Finance",
        href: "/workspace/finance",
        icon: Wallet,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/workspace/settings",
        icon: Settings,
      },
    ],
  },
];