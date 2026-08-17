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
  BookOpen,
  BarChart3,
  Settings,
  FolderTree,
  Tags,
  Trash2,
  FileUp
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
    title: "Content",
    items: [
      {
        title: "Blog CMS",
        href: "/workspace/blog",
        icon: FileText,
      },
      {
        title: "Media",
        href: "/workspace/media",
        icon: FileUp,
      },
      {
        title: "Trash",
        href: "/workspace/blog/trash",
        icon: Trash2,
      },
      {
        title: "Categories",
        href: "/workspace/categories",
        icon: FolderTree,
        adminOnly: true,
      },
      {
        title: "Tags",
        href: "/workspace/tags",
        icon: Tags,
        adminOnly: true,
      },
      {
        title: "Portfolio",
        href: "/workspace/portfolio",
        icon: Briefcase,
        adminOnly: true,
      },
      {
        title: "Knowledge Base",
        href: "/workspace/knowledge",
        icon: BookOpen,
        adminOnly: true,
      },
      {
        title: "SEO",
        href: "/workspace/seo",
        icon: Search,
        adminOnly: true,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Projects",
        href: "/workspace/projects",
        icon: FolderKanban,
        adminOnly: true,
      },
      {
        title: "Tasks",
        href: "/workspace/tasks",
        icon: CheckSquare,
        adminOnly: true,
      },
      {
        title: "CRM",
        href: "/workspace/crm",
        icon: Users,
        adminOnly: true,
      },
      {
        title: "Scheduler",
        href: "/workspace/scheduler",
        icon: CalendarDays,
        adminOnly: true,
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
        adminOnly: true,
      },
      {
        title: "Finance",
        href: "/workspace/finance",
        icon: Wallet,
        adminOnly: true,
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