import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";
import { projectIdSchema } from "@/lib/validations/projects";
import { archiveProject } from "@/lib/services/projects";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        // CHANGED: capture the admin user so their id can be passed to
        // archiveProject() for the activity-log entry. archiveProject()
        // requires (id, userId) — the original handler only passed id,
        // which does not match lib/services/projects.ts and fails
        // `tsc --noEmit`.
        const admin = await requireAdmin();

        const { id } = await context.params;

        const parsedId = projectIdSchema.safeParse(id);

        if (!parsedId.success) {
            return NextResponse.json(
                {
                    error: "Invalid project ID.",
                    details: parsedId.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        const project = await archiveProject(parsedId.data, admin.id);

        return NextResponse.json(
            {
                project,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json(
                {
                    error: error.message,
                },
                {
                    status: error.status,
                }
            );
        }

        if (error instanceof Error) {
            if (error.message === "Project not found.") {
                return NextResponse.json(
                    {
                        error: error.message,
                    },
                    {
                        status: 404,
                    }
                );
            }

            return NextResponse.json(
                {
                    error: error.message,
                },
                {
                    status: 400,
                }
            );
        }

        console.error("Archive project error:", error);

        return NextResponse.json(
            {
                error: "An unexpected error occurred.",
            },
            {
                status: 500,
            }
        );
    }
}
