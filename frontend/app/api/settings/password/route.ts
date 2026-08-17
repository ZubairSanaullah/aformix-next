import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { sendPasswordChangedEmail } from "@/lib/email";

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Rate limit: 5 password change attempts per 15 minutes per user
        const rateLimit = checkRateLimit(`change-password:${session.user.id}`, 5, 15 * 60 * 1000);
        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    error: `Too many password change attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const parseResult = changePasswordSchema.safeParse({
            currentPassword: body.currentPassword,
            newPassword: body.newPassword,
            confirmPassword: body.confirmPassword || body.newPassword,
        });

        if (!parseResult.success) {
            return NextResponse.json(
                {
                    error: parseResult.error.issues[0].message,
                },
                { status: 400 },
            );
        }

        const { currentPassword, newPassword } = parseResult.data;

        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 },
            );
        }

        if (!user.password) {
            return NextResponse.json(
                {
                    error:
                        "Password authentication is not configured for this account.",
                },
                { status: 400 },
            );
        }

        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.password,
        );

        if (!passwordMatches) {
            return NextResponse.json(
                { error: "Current password is incorrect." },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updateTime = new Date();

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        // Send security alert notification email
        await sendPasswordChangedEmail({
            to: user.email,
            name: user.name,
            timestamp: updateTime,
        });

        return NextResponse.json({
            success: true,
            message: "Password updated successfully.",
        });
    } catch (error) {
        console.error("PATCH /api/settings/password error:", error);

        return NextResponse.json(
            { error: "Failed to update password. Please try again." },
            { status: 500 },
        );
    }
}