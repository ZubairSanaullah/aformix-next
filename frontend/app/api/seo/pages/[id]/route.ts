import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
    deleteSEOPage,
    getSEOPageById,
    isSEOPagePathTaken,
    updateSEOPage,
} from "@/lib/services/seo/pages";
import { seoPageUpdateSchema } from "@/lib/validations/seo";

interface SEOPageRouteContext {
    params: Promise<{
        id: string;
    }>;
}

async function requireAuthentication() {
    const session = await auth();

    return session?.user ? session : null;
}

async function getRouteId(
    context: SEOPageRouteContext
) {
    const { id } = await context.params;

    return id?.trim() ?? "";
}

export async function GET(
    _request: Request,
    context: SEOPageRouteContext
) {
    try {
        const session = await requireAuthentication();

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const id = await getRouteId(context);

        if (!id) {
            return NextResponse.json(
                { error: "SEO page ID is required." },
                { status: 400 }
            );
        }

        const page = await getSEOPageById(id);

        if (!page) {
            return NextResponse.json(
                {
                    error:
                        "SEO page configuration not found.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: page,
        });
    } catch (error) {
        console.error(
            "GET /api/seo/pages/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to fetch SEO page." },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    context: SEOPageRouteContext
) {
    try {
        const session = await requireAuthentication();

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const id = await getRouteId(context);

        if (!id) {
            return NextResponse.json(
                { error: "SEO page ID is required." },
                { status: 400 }
            );
        }

        const existingPage =
            await getSEOPageById(id);

        if (!existingPage) {
            return NextResponse.json(
                {
                    error:
                        "SEO page configuration not found.",
                },
                { status: 404 }
            );
        }

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON request body." },
                { status: 400 }
            );
        }

        const result =
            seoPageUpdateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error:
                        result.error.issues[0]?.message ??
                        "Invalid SEO page data.",
                },
                { status: 400 }
            );
        }

        if (result.data.path !== undefined) {
            const pathTaken =
                await isSEOPagePathTaken(
                    result.data.path,
                    id
                );

            if (pathTaken) {
                return NextResponse.json(
                    {
                        error:
                            "An SEO configuration already exists for this page path.",
                    },
                    { status: 409 }
                );
            }
        }

        const page = await updateSEOPage(
            id,
            result.data
        );

        return NextResponse.json({
            data: page,
            message:
                "SEO page updated successfully.",
        });
    } catch (error) {
        console.error(
            "PATCH /api/seo/pages/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to update SEO page." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    context: SEOPageRouteContext
) {
    try {
        const session = await requireAuthentication();

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const id = await getRouteId(context);

        if (!id) {
            return NextResponse.json(
                { error: "SEO page ID is required." },
                { status: 400 }
            );
        }

        const existingPage =
            await getSEOPageById(id);

        if (!existingPage) {
            return NextResponse.json(
                {
                    error:
                        "SEO page configuration not found.",
                },
                { status: 404 }
            );
        }

        await deleteSEOPage(id);

        return NextResponse.json({
            message:
                "SEO page deleted successfully.",
        });
    } catch (error) {
        console.error(
            "DELETE /api/seo/pages/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to delete SEO page." },
            { status: 500 }
        );
    }
}