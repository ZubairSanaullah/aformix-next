import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";
import {
    projectIdSchema,
    updateProjectSchema,
} from "@/lib/validations/projects";
import {
    deleteProject,
    getProjectById,
    updateProject,
} from "@/lib/services/projects";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

function handleRouteError(error: unknown) {
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return NextResponse.json(
                {
                    error: "A project with this slug already exists.",
                },
                {
                    status: 409,
                }
            );
        }

        if (error.code === "P2003") {
            return NextResponse.json(
                {
                    error: "One of the referenced records does not exist.",
                },
                {
                    status: 400,
                }
            );
        }

        if (error.code === "P2025") {
            return NextResponse.json(
                {
                    error: "Project not found.",
                },
                {
                    status: 404,
                }
            );
        }
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

    console.error("Project API error:", error);

    return NextResponse.json(
        {
            error: "An unexpected error occurred.",
        },
        {
            status: 500,
        }
    );
}

export async function GET(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();

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

        const project = await getProjectById(parsedId.data);

        if (!project) {
            return NextResponse.json(
                {
                    error: "Project not found.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                project,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();

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

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    error: "Invalid JSON request body.",
                },
                {
                    status: 400,
                }
            );
        }

        const parsedBody = updateProjectSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    error: "Invalid project data.",
                    details: parsedBody.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        if (Object.keys(parsedBody.data).length === 0) {
            return NextResponse.json(
                {
                    error: "At least one project field is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const project = await updateProject(
            parsedId.data,
            parsedBody.data
        );

        return NextResponse.json(
            {
                project,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function DELETE(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        // CHANGED: capture the admin user — deleteProject() requires
        // (id, userId) for its activity-log entry, but the original
        // handler only passed id. Same class of fix as
        // archive/route.ts and restore/route.ts.
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

        const project = await deleteProject(parsedId.data, admin.id);

        return NextResponse.json(
            {
                project,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}
