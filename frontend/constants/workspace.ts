import {
  BarChart3,
  Bookmark,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  LayoutGrid,
  Library,
  MessageSquareText,
  PenTool,
  Search,
  Settings,
  Sparkles,
  Target,
  Users,
  Wallet,
} from "lucide-react";

export const workspaceModules = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, path: "/workspace" },
  { id: "projects", label: "Projects", icon: FolderKanban, path: "/workspace/projects" },
  { id: "scheduler", label: "Scheduler", icon: CalendarDays, path: "/workspace/scheduler" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, path: "/workspace/tasks" },
  { id: "notes", label: "Notes", icon: PenTool, path: "/workspace/notes" },
  { id: "crm", label: "CRM", icon: Users, path: "/workspace/crm" },
  { id: "content", label: "Content Planner", icon: MessageSquareText, path: "/workspace/content" },
  { id: "seo", label: "SEO Workspace", icon: Search, path: "/workspace/seo" },
  { id: "finance", label: "Finance", icon: Wallet, path: "/workspace/finance" },
  { id: "knowledge", label: "Knowledge Base", icon: Library, path: "/workspace/knowledge" },
  { id: "assets", label: "Assets", icon: Sparkles, path: "/workspace/assets" },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark, path: "/workspace/bookmarks" },
  { id: "goals", label: "Goals", icon: Target, path: "/workspace/goals" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/workspace/analytics" },
  { id: "settings", label: "Settings", icon: Settings, path: "/workspace/settings" },
];

export const priorities = [
  { title: "Launch Orbit onboarding", due: "Today · 11:30", pct: 82 },
  { title: "Client proposal review", due: "Today · 15:00", pct: 64 },
  { title: "SEO audit for Aformix", due: "Tomorrow · 09:00", pct: 47 },
];

export const activityFeed = [
  { title: "New note created", detail: "Operating system blueprint", time: "8 min ago" },
  { title: "Project updated", detail: "Aformix website refresh", time: "24 min ago" },
  { title: "Invoice sent", detail: "Northstar Studio", time: "1 hr ago" },
];

export const stats = [
  { label: "Today focus", value: "5.2h", hint: "Healthy pace" },
  { label: "Revenue", value: "$12.8k", hint: "This month" },
  { label: "Tasks done", value: "18", hint: "Completed" },
  { label: "Productivity", value: "92%", hint: "Momentum" },
];
