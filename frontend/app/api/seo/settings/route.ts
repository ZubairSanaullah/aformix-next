import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
    getSEOSettings,
    updateSEOSettings,
} from "@/lib/services/seo/settings";
import { seoSettingsUpdateSchema } from "@/lib/validations/seo";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const settings = await getSEOSettings();

        return NextResponse.json({
            data: settings,
        });
    } catch (error) {
        console.error(
            "GET /api/seo/settings error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to fetch SEO settings.",
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
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
                {
                    error: "Invalid JSON request body.",
                },
                { status: 400 }
            );
        }

        const result =
            seoSettingsUpdateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error:
                        result.error.issues[0]?.message ??
                        "Invalid SEO settings data.",
                },
                { status: 400 }
            );
        }

        const settings = await updateSEOSettings(
            result.data
        );

        return NextResponse.json({
            data: settings,
            message:
                "SEO settings updated successfully.",
        });
    } catch (error) {
        console.error(
            "PATCH /api/seo/settings error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to update SEO settings.",
            },
            { status: 500 }
        );
    }
}