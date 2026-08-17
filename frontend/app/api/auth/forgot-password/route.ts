import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { requestPasswordReset } from "@/lib/services/auth-security";

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const rateLimit = checkRateLimit(`forgot-password:${ip}`, 5, 15 * 60 * 1000);

        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    error: `Too many password reset requests. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const result = forgotPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.error.issues[0].message,
                },
                { status: 400 }
            );
        }

        const { email } = result.data;
        const resetResult = await requestPasswordReset(email);

        return NextResponse.json(
            {
                success: true,
                message: resetResult.message,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Forgot password error:", error);

        return NextResponse.json(
            {
                // Never leak internal errors that reveal account states
                message: "If an account exists for this email address, you will receive password reset instructions.",
            },
            { status: 200 }
        );
    }
}
