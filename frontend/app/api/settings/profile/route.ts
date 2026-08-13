import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_IMAGE_URL_LENGTH = 2048;

function isValidImageUrl(value: string): boolean {
    if (value === "") return true; // allow clearing the avatar
    if (value.length > MAX_IMAGE_URL_LENGTH) return false;
    return /^https?:\/\//i.test(value);
}

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("GET /api/settings/profile error:", error);

        return NextResponse.json(
            { error: "Failed to load profile" },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();

        if (
            body.name !== undefined &&
            typeof body.name !== "string"
        ) {
            return NextResponse.json(
                { error: "Name must be a string" },
                { status: 400 },
            );
        }

        if (
            body.image !== undefined &&
            typeof body.image !== "string"
        ) {
            return NextResponse.json(
                { error: "Image must be a string URL" },
                { status: 400 },
            );
        }

        const name =
            typeof body.name === "string"
                ? body.name.trim()
                : undefined;

        const image =
            typeof body.image === "string"
                ? body.image.trim()
                : undefined;

        if (name !== undefined && name.length > 100) {
            return NextResponse.json(
                { error: "Name must be 100 characters or less" },
                { status: 400 },
            );
        }

        if (image !== undefined && !isValidImageUrl(image)) {
            return NextResponse.json(
                { error: "Image must be a valid http(s) URL" },
                { status: 400 },
            );
        }

        const user = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                ...(name !== undefined ? { name } : {}),
                ...(image !== undefined ? { image: image || null } : {}),
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("PATCH /api/settings/profile error:", error);

        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 },
        );
    }
}