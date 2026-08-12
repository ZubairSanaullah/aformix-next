import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
    createSEOPage,
    getSEOPages,
    isSEOPagePathTaken,
} from "@/lib/services/seo/pages";
import { seoPageSchema } from "@/lib/validations/seo";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const pages = await getSEOPages();

        return NextResponse.json({
            data: pages,
        });
    } catch (error) {
        console.error(
            "GET /api/seo/pages error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to fetch SEO pages." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
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

        const result = seoPageSchema.safeParse(body);

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

        const pathTaken = await isSEOPagePathTaken(
            result.data.path
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

        const page = await createSEOPage(
            result.data
        );

        return NextResponse.json(
            {
                data: page,
                message:
                    "SEO page created successfully.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "POST /api/seo/pages error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to create SEO page." },
            { status: 500 }
        );
    }
}