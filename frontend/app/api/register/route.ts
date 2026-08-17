import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { createAndSendVerificationOtp } from "@/lib/services/auth-security";

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const rateLimit = checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000);

        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    error: `Too many registration attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.error.issues[0].message,
                },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: "An account with this email address already exists.",
                },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                name,
                email: normalizedEmail,
                password: hashedPassword,
                emailVerified: null,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        // Generate and dispatch verification OTP email
        await createAndSendVerificationOtp(newUser);

        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully. A 6-digit verification code has been sent to your email.",
                email: newUser.email,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Registration error:", error);

        return NextResponse.json(
            {
                error: "Something went wrong during registration. Please try again.",
            },
            { status: 500 }
        );
    }
}