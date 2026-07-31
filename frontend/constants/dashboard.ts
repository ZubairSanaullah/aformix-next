import {
    DollarSign,
    FilePlus,
    FolderKanban,
    FolderPlus,
    ImagePlus,
    Rocket,
    Target,
    UserPlus,
    Users,
    PenLine,
} from "lucide-react";

export const dashboardStats = [
    {
        title: "Projects",
        value: "24",
        description: "+4 this month",
        icon: FolderKanban,
    },
    {
        title: "Clients",
        value: "12",
        description: "+2 this month",
        icon: Users,
    },
    {
        title: "Revenue",
        value: "$8,400",
        description: "+12% this month",
        icon: DollarSign,
    },
    {
        title: "Leads",
        value: "36",
        description: "+8 this month",
        icon: Target,
    },
];


export const quickActions = [
    {
        title: "New Project",
        description: "Create a new workspace project.",
        icon: FolderPlus,
    },
    {
        title: "New Client",
        description: "Add a new client profile.",
        icon: UserPlus,
    },
    {
        title: "Publish Blog",
        description: "Create a new blog article.",
        icon: PenLine,
    },
    {
        title: "Upload Portfolio",
        description: "Add a portfolio project.",
        icon: ImagePlus,
    },
];


export const recentActivities = [
    {
        title: "New Project Created",
        description: "Aformix Website Redesign",
        time: "2h ago",
        icon: Rocket,
    },
    {
        title: "New Client Added",
        description: "Nova Solutions",
        time: "5h ago",
        icon: UserPlus,
    },
    {
        title: "Blog Published",
        description: "7 Website Mistakes That Cost Clients",
        time: "1d ago",
        icon: FilePlus,
    },
];


export const aiInsights = [
    "3 leads need follow-up this week.",
    "Project activity increased compared to last month.",
    "Consider publishing a new case study.",
];