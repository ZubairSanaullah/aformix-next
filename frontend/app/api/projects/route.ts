import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";
import {
    createProjectSchema,
    projectListQuerySchema,
} from "@/lib/validations/projects";
import {
    createProject,
    getProjects,
} from "@/lib/services/projects";

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
    }

    if (error instanceof Error) {
        return NextResponse.json(
            {
                error: error.message,
            },
            {
                status: 400,
            }
        );
    }

    console.error("Projects API error:", error);

    return NextResponse.json(
        {
            error: "An unexpected error occurred.",
        },
        {
            status: 500,
        }
    );
}

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = request.nextUrl.searchParams;

        const parsedQuery = projectListQuerySchema.safeParse({
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            status: searchParams.get("status") ?? undefined,
            priority: searchParams.get("priority") ?? undefined,
            ownerId: searchParams.get("ownerId") ?? undefined,
            companyId: searchParams.get("companyId") ?? undefined,
            startDateFrom:
                searchParams.get("startDateFrom") ?? undefined,
            startDateTo:
                searchParams.get("startDateTo") ?? undefined,
            dueDateFrom:
                searchParams.get("dueDateFrom") ?? undefined,
            dueDateTo:
                searchParams.get("dueDateTo") ?? undefined,
            sort: searchParams.get("sort") ?? undefined,
            order: searchParams.get("order") ?? undefined,
        });

        if (!parsedQuery.success) {
            return NextResponse.json(
                {
                    error: "Invalid project query parameters.",
                    details: parsedQuery.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        const projects = await getProjects(parsedQuery.data);

        return NextResponse.json(
            projects,
            {
                status: 200,
            }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin();

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

        const parsedBody = createProjectSchema.safeParse(body);

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

        const project = await createProject(parsedBody.data);

        return NextResponse.json(
            {
                project,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}