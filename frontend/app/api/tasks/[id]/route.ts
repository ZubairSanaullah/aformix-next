import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
    getTaskById,
    updateTask,
    deleteTask,
} from "@/lib/services/tasks";
import { taskSchema } from "@/lib/validations/task";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    _request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const task = await getTaskById(id);

        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        if (task.ownerId !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            task,
        });
    } catch (error) {
        console.error(
            "GET /api/tasks/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to fetch task" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const existingTask = await getTaskById(id);

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        if (existingTask.ownerId !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await request.json();

        const parsed = taskSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    issues: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const data = parsed.data;

        const task = await updateTask(id, {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            dueAt: data.dueAt
                ? new Date(data.dueAt)
                : null,
            contactId:
                data.contactId ?? null,
            companyId:
                data.companyId ?? null,
            leadId:
                data.leadId ?? null,
            dealId:
                data.dealId ?? null,
        });

        return NextResponse.json({
            task,
        });
    } catch (error) {
        console.error(
            "PATCH /api/tasks/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const existingTask = await getTaskById(id);

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        if (existingTask.ownerId !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        await deleteTask(id);

        return NextResponse.json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE /api/tasks/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 }
        );
    }
}
