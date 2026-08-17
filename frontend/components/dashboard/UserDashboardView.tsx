import Link from "next/link";
import {
    FileText,
    Globe,
    FileEdit,
    FileUp,
    PenLine,
    Settings,
    ArrowRight,
    Clock,
} from "lucide-react";

import DashboardHero from "./DashboardHero";
import StatCard from "./StatCard";
import QuickActionCard from "./QuickActionCard";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceBadge from "@/components/workspace/ui/WorkspaceBadge";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

export interface UserStatsData {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    uploadedMedia: number;
}

export interface UserRecentPost {
    id: string;
    title: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    readingTime: number;
    createdAt: Date;
    category?: {
        name: string;
    } | null;
}

interface UserDashboardViewProps {
    stats: UserStatsData;
    recentPosts: UserRecentPost[];
}

export default function UserDashboardView({
    stats,
    recentPosts,
}: UserDashboardViewProps) {
    const statCards = [
        {
            title: "Total Articles",
            value: String(stats.totalArticles),
            description: "Your created blog articles",
            icon: FileText,
        },
        {
            title: "Published",
            value: String(stats.publishedArticles),
            description: "Live on the public website",
            icon: Globe,
        },
        {
            title: "Drafts",
            value: String(stats.draftArticles),
            description: "Works in progress",
            icon: FileEdit,
        },
        {
            title: "My Media",
            value: String(stats.uploadedMedia),
            description: "Uploaded assets & images",
            icon: FileUp,
        },
    ];

    const quickActions = [
        {
            title: "Write Article",
            description: "Create and publish a new blog article.",
            icon: PenLine,
            href: "/workspace/blog/create",
        },
        {
            title: "Upload Media",
            description: "Add images and files to your media library.",
            icon: FileUp,
            href: "/workspace/media",
        },
        {
            title: "My Articles",
            description: "Manage, edit, or archive your blog posts.",
            icon: FileText,
            href: "/workspace/blog",
        },
        {
            title: "Settings & Security",
            description: "Update your profile and password.",
            icon: Settings,
            href: "/workspace/settings",
        },
    ];

    return (
        <div className="space-y-8">
            <DashboardHero />

            {/* Author Stats */}
            <section>
                <div className="mb-4">
                    <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                        My Content Overview
                    </h2>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Summary of your published articles, drafts, and uploaded media.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section>
                <div className="mb-4">
                    <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                        Quick Actions
                    </h2>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Common content creation shortcuts.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => (
                        <QuickActionCard key={action.title} {...action} />
                    ))}
                </div>
            </section>

            {/* Recent Articles */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                            Recent Articles
                        </h2>
                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            Your most recently created and edited articles.
                        </p>
                    </div>

                    <Link href="/workspace/blog">
                        <WorkspaceButton variant="secondary" size="sm">
                            View all
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </WorkspaceButton>
                    </Link>
                </div>

                {recentPosts.length === 0 ? (
                    <WorkspaceCard padding="lg" className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                            <PenLine className="h-6 w-6" />
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-[var(--workspace-text)]">
                            No articles yet
                        </h3>
                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            You haven&apos;t written any blog posts yet. Start by writing your first article!
                        </p>
                        <div className="mt-4">
                            <Link href="/workspace/blog/create">
                                <WorkspaceButton variant="primary" size="md">
                                    <PenLine className="mr-1.5 h-3.5 w-3.5" />
                                    Write New Article
                                </WorkspaceButton>
                            </Link>
                        </div>
                    </WorkspaceCard>
                ) : (
                    <div className="divide-y divide-[var(--workspace-border)] rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                        {recentPosts.map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-[var(--workspace-background)]"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="truncate text-xs font-semibold text-[var(--workspace-text)]">
                                            {post.title}
                                        </h4>
                                        <WorkspaceBadge
                                            variant={
                                                post.status === "PUBLISHED"
                                                    ? "success"
                                                    : post.status === "DRAFT"
                                                    ? "warning"
                                                    : "default"
                                            }
                                        >
                                            {post.status}
                                        </WorkspaceBadge>
                                    </div>
                                    <div className="mt-1 flex items-center gap-3 text-[10px] text-[var(--workspace-text-muted)]">
                                        {post.category && (
                                            <span>{post.category.name}</span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {post.readingTime} min read
                                        </span>
                                        <span>
                                            {new Intl.DateTimeFormat("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }).format(new Date(post.createdAt))}
                                        </span>
                                    </div>
                                </div>

                                <Link href={`/workspace/blog/edit/${post.id}`}>
                                    <WorkspaceButton variant="secondary" size="sm">
                                        Edit
                                    </WorkspaceButton>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
