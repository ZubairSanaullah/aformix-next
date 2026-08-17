import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import DashboardHero from "@/components/dashboard/DashboardHero";
import StatsSection from "@/components/dashboard/StatsSection";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import QuickActionsSection from "@/components/dashboard/QuickActionsSection";
import ActivitySection from "@/components/dashboard/ActivitySection";
import AIInsightsSection from "@/components/dashboard/AIInsightsSection";
import AutoRefresh from "@/components/dashboard/AutoRefresh";
import UserDashboardView from "@/components/dashboard/UserDashboardView";

import { getAnalyticsOverview } from "@/lib/services/analytics/overview";
import { getActivities } from "@/lib/services/activity";

export default async function WorkspacePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin) {
    const [totalArticles, publishedArticles, draftArticles, uploadedMedia, recentPosts] =
      await Promise.all([
        prisma.post.count({
          where: {
            authorId: session.user.id,
            deletedAt: null,
          },
        }),
        prisma.post.count({
          where: {
            authorId: session.user.id,
            status: "PUBLISHED",
            deletedAt: null,
          },
        }),
        prisma.post.count({
          where: {
            authorId: session.user.id,
            status: "DRAFT",
            deletedAt: null,
          },
        }),
        prisma.media.count({
          where: {
            userId: session.user.id,
            deletedAt: null,
          },
        }),
        prisma.post.findMany({
          where: {
            authorId: session.user.id,
            deletedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
          select: {
            id: true,
            title: true,
            status: true,
            readingTime: true,
            createdAt: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

    const userStats = {
      totalArticles,
      publishedArticles,
      draftArticles,
      uploadedMedia,
    };

    return (
      <div className="mx-auto w-full max-w-[1600px]">
        <AutoRefresh interval={30000} />
        <UserDashboardView stats={userStats} recentPosts={recentPosts} />
      </div>
    );
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const overview = await getAnalyticsOverview(startDate, endDate, true);
  const recentActivities = await getActivities();
  const activities = recentActivities.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <AutoRefresh interval={30000} />
      <div className="space-y-8">
        <DashboardHero />
        <StatsSection stats={overview} />
        <AnalyticsSection />
        <QuickActionsSection />
        <ActivitySection activities={activities} />
        <AIInsightsSection stats={overview} />
      </div>
    </div>
  );
}