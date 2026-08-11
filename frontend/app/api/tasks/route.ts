import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
    getTasks,
    createTask,
} from "@/lib/services/tasks";
import { taskSchema } from "@/lib/validations/task";

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const search =
            searchParams.get("search") || undefined;

        const status =
            searchParams.get("status") || undefined;

        const priority =
            searchParams.get("priority") || undefined;

        const contactId =
            searchParams.get("contactId") || undefined;

        const companyId =
            searchParams.get("companyId") || undefined;

        const leadId =
            searchParams.get("leadId") || undefined;

        const dealId =
            searchParams.get("dealId") || undefined;

        const tasks = await getTasks({
            ownerId: session.user.id,
            search,
            status: status as any,
            priority: priority as any,
            contactId,
            companyId,
            leadId,
            dealId,
        });

        return NextResponse.json({
            tasks,
        });
    } catch (error) {
        console.error(
            "GET /api/tasks error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
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

        const task = await createTask(
            {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                dueAt: data.dueAt
                    ? new Date(data.dueAt)
                    : undefined,
                contactId:
                    data.contactId || undefined,
                companyId:
                    data.companyId || undefined,
                leadId:
                    data.leadId || undefined,
                dealId:
                    data.dealId || undefined,
            },
            session.user.id
        );

        return NextResponse.json(
            {
                task,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "POST /api/tasks error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        );
    }
}
