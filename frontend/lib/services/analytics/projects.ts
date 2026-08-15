import { prisma } from "@/lib/prisma";

export async function getProjectAnalytics(startDate: Date, endDate: Date) {
    const projects = await prisma.project.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
            deletedAt: null
        },
        select: {
            status: true,
            progress: true,
            dueDate: true,
        }
    });

    const now = new Date();

    const totalProjects = projects.length;
    let planningProjects = 0;
    let activeProjects = 0;
    let onHoldProjects = 0;
    let completedProjects = 0;
    let cancelledProjects = 0;
    let overdueProjects = 0;
    let totalProgress = 0;

    for (const p of projects) {
        totalProgress += p.progress || 0;

        if (p.status === "PLANNING") planningProjects++;
        else if (p.status === "ACTIVE") activeProjects++;
        else if (p.status === "ON_HOLD") onHoldProjects++;
        else if (p.status === "COMPLETED") completedProjects++;
        else if (p.status === "CANCELLED") cancelledProjects++;

        if (p.dueDate && p.dueDate < now && p.status !== "COMPLETED" && p.status !== "CANCELLED") {
            overdueProjects++;
        }
    }

    const averageProjectProgress = totalProjects > 0 ? totalProgress / totalProjects : 0;
    const projectCompletionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    const tasks = await prisma.task.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            status: true,
            dueAt: true,
        }
    });

    const totalTasks = tasks.length;
    let todoTasks = 0;
    let inProgressTasks = 0;
    let completedTasks = 0;
    let cancelledTasks = 0;
    let overdueTasks = 0;

    for (const t of tasks) {
        if (t.status === "TODO") todoTasks++;
        else if (t.status === "IN_PROGRESS") inProgressTasks++;
        else if (t.status === "COMPLETED") completedTasks++;
        else if (t.status === "CANCELLED") cancelledTasks++;

        if (t.dueAt && t.dueAt < now && t.status !== "COMPLETED" && t.status !== "CANCELLED") {
            overdueTasks++;
        }
    }

    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
        projects: {
            total: totalProjects,
            planning: planningProjects,
            active: activeProjects,
            onHold: onHoldProjects,
            completed: completedProjects,
            cancelled: cancelledProjects,
            overdue: overdueProjects,
            averageProgress: Number(averageProjectProgress.toFixed(2)),
            completionRate: Number(projectCompletionRate.toFixed(2)),
        },
        tasks: {
            total: totalTasks,
            todo: todoTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
            cancelled: cancelledTasks,
            overdue: overdueTasks,
            completionRate: Number(taskCompletionRate.toFixed(2)),
        }
    };
}
